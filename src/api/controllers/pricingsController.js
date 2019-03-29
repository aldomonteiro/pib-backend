import Pricing from '../models/pricings';
import util from 'util';
import { configSortQuery, configRangeQuery } from '../util/util';
import { getSizes } from './sizesController';
import { getFlavor } from './flavorsController';

// List all records
// TODO: use filters in the query req.query
export const pricing_get_all = (req, res) => {
    // Getting the sort from the requisition
    var sortObj = configSortQuery(req.query.sort);
    // Getting the range from the requisition
    var rangeObj = configRangeQuery(req.query.range);

    let options = {
        offset: rangeObj['offset'],
        limit: rangeObj['limit'],
        sort: sortObj,
        lean: true,
        leanWithId: false,
    };

    var query = {};

    if (req.currentUser.activePage) {
        query = Pricing.find({ pageId: req.currentUser.activePage });
    }

    Pricing.paginate(query, options, (err, result) => {
        if (err) {
            res.status(500).json({ message: err.errmsg });
        } else {
            res.setHeader('Content-Range', util.format('pricings %d-%d/%d', rangeObj['offset'], rangeObj['limit'], result.total));
            res.status(200).json(result.docs);
        }
    });
};

// List one record by filtering by ID
export const pricing_get_one = (req, res) => {
    if (req.params && req.params.id) {
        // Filter based on the currentUser
        const pageId = req.currentUser.activePage;

        Pricing.findOne({ pageId: pageId, id: req.params.id }, (err, doc) => {
            if (err) {
                res.status(500).json({ message: err.errmsg });
            } else {
                res.status(200).json(doc);
            }
        });
    }
}

// CREATE A NEW RECORD
export const pricing_create = async (req, res) => {
    if (req.body) {

        const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

        let { id } = req.body;

        if (!id || id === 0) {
            const lastId = await Pricing.find({ pageId: pageId }).select('id').sort('-id').limit(1).exec();
            id = 1;
            if (lastId && lastId.length)
                id = lastId[0].id + 1;
        }

        const newRecord = new Pricing({
            id: id,
            categoryId: req.body.categoryId,
            sizeId: req.body.sizeId,
            price: req.body.price,
            pageId: pageId,
        });

        newRecord.save()
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((err) => {
                if (err.code === 11000) {
                    res.status(500).json({ message: 'pos.messages.duplicatedKey' });
                } else {
                    res.status(500).json({ message: err.errmsg });
                }
            });
    }
}

// UPDATE
export const pricing_update = (req, res) => {
    if (req.body && req.params.id) {

        const pageId = req.currentUser.activePage;
        const { id } = req.params;
        const { categoryId, sizeId, price } = req.body;

        Pricing.findOne({ pageId: pageId, id: id }, (err, doc) => {
            if (!err) {

                if (categoryId) doc.categoryId = categoryId;
                if (sizeId) doc.sizeId = sizeId;
                if (price) doc.price = price;

                doc.save((err, result) => {
                    if (err) {
                        res.status(500).json({ message: err.errmsg });
                    } else {
                        res.status(200).json(result);
                    }
                });
            } else {
                res.status(500).json({ message: err.errmsg });
            }
        });
    }
}

// DELETE
export const pricing_delete = (req, res) => {

    const pageId = req.currentUser.activePage;

    Pricing.findOneAndRemove({ pageId: pageId, id: req.params.id })
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(500).json({ message: err.errmsg });
        });
};

/**
 * Delete all records from a pageID
 * @param {*} pageID
 */
export const deleteManyPricings = async (pageID) => {
    return await Pricing.deleteMany({ pageId: pageID }).exec();
}

export const getPricingSizing = async (pageID, categoryID) => {
    if (categoryID)
        return await Pricing.distinct('sizeId', { pageId: pageID, categoryId: categoryID }).exec();
    else
        return await Pricing.distinct('sizeId', { pageId: pageID }).exec();
}

export const getPricings = async (pageID) => {
    const query = Pricing.find({ pageId: pageID });
    return await query.exec();
}

export const getOnePricing = async (pageID, categoryId, sizeID) => {
    const query = Pricing.findOne({ pageId: pageID, categoryId: categoryId, sizeId: sizeID });
    return await query.exec();
}

export const getOnePricingByFlavor = async (pageID, sizeID, flavorID) => {
    const flavor = await getFlavor(pageID, flavorID);
    if (flavor) {
        return await getOnePricing(pageID, flavor.categoryId, sizeID);
    } else return null;
}


export const getPricingsWithSize = async pageID => {
    const query = Pricing.find({ pageId: pageID });
    query.sort('categoryId');
    const pricings = await query.exec();
    const sizes = await getSizes(pageID);
    for (let pricing of pricings) {
        for (let size of sizes) {
            if (size.id === pricing.sizeId) {
                pricing.size = size.size;
            }
        }
    }
    return pricings;
}

