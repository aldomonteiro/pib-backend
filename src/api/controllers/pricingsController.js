import Pricing from "../models/pricings";
import util from "util";
import { configSortQuery, configRangeQuery } from '../util/util';

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
            res.setHeader('Content-Range', util.format("pricings %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
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
            }
            else {
                res.status(200).json(doc);
            }
        });
    }
}

// CREATE A NEW RECORD
export const pricing_create = (req, res) => {
    if (req.body) {

        const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

        const newRecord = new Pricing({
            id: req.body.id,
            kind: req.body.kind,
            sizeId: req.body.sizeId,
            price: req.body.price, // TODO: how to handle float?
            pageId: pageId,
        });

        newRecord.save()
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((err) => {
                res.status(500).json({ message: err.errmsg });
            });
    }
}

// UPDATE
export const pricing_update = (req, res) => {
    if (req.body && req.body.id) {

        const pageId = req.currentUser.activePage;

        Pricing.findOne({ pageId: pageId, id: req.body.id }, (err, doc) => {
            if (!err) {
                doc.kind = req.body.kind;
                doc.sizeId = req.body.sizeId;
                doc.price = req.body.price;

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

export const getPricingSizing = async pageId => {
    const query = Pricing.distinct('sizeId', { pageId: pageId });
    return await query.exec();
}
