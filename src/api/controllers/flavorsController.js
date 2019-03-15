import Flavor from '../models/flavors';
import util from 'util';
import stringSimilarity from 'string-similarity';
import stringCapitalizeName from 'string-capitalize-name';
import { configSortQuery, configRangeQuery, configFilterQueryMultiple } from '../util/util';
import { getToppingsNames } from './toppingsController';
import { getCategory } from './categoriesController';

// List all flavors
// TODO: use filters in the query req.query
export const flavor_get_all = async (req, res) => {
    // Getting the sort from the requisition
    let sortObj = configSortQuery(req.query.sort);
    // Getting the range from the requisition
    let rangeObj = configRangeQuery(req.query.range);

    let queryObj = {};
    if (req.query.filter) {
        const filterObj = configFilterQueryMultiple(req.query.filter);

        if (filterObj && filterObj.filterField && filterObj.filterField.length) {
            for (let i = 0; i < filterObj.filterField.length; i++) {
                const filter = filterObj.filterField[i];
                const value = filterObj.filterValues[i];
                if (Array.isArray(value)) {
                    queryObj[filter] = { $in: value };
                } else if (filter === 'flavor') {
                    queryObj[filter] = { $regex: value, $options: 'i' };
                } else
                    queryObj[filter] = value;
            }
        }
    }
    if (req.currentUser.activePage) {
        queryObj['pageId'] = req.currentUser.activePage;
    }

    Flavor.find(queryObj).sort(sortObj).exec(async (err, result) => {
        if (err) {
            res.status(500).json({ message: err.errmsg });
        } else {
            let _rangeIni = 0;
            let _rangeEnd = result.length;
            if (rangeObj) {
                _rangeIni = rangeObj.offset <= result.length ? rangeObj.offset : result.length;
                _rangeEnd = (rangeObj.offset + rangeObj.limit) <= result.length ? rangeObj.offset + rangeObj.limit : result.length;
            }
            let _totalCount = result.length;
            let flavorsArray = [];
            for (let i = _rangeIni; i < _rangeEnd; i++) {
                // const tn = await getToppingsNames(result[i].toppings, result[i].pageId);
                let flavor = {
                    id: result[i].id,
                    flavor: result[i].flavor,
                    categoryId: result[i].categoryId,
                    toppings: result[i].toppings,
                    price: result[i].price,
                    price_by_size: result[i].price_by_size,
                    createdAt: result[i].createdAt,
                    updatedAt: result[i].updatedAt,
                    // tn: tn.join(),
                }
                flavorsArray.push(flavor)
            }
            res.setHeader('Content-Range', util.format('flavors %d-%d/%d', _rangeIni, _rangeEnd, _totalCount));
            res.status(200).json(flavorsArray);
        }
    });


    // // Getting the sort from the requisition
    // var sortObj = configSortQuery(req.query.sort);
    // // Getting the range from the requisition
    // var rangeObj = configRangeQuery(req.query.range);

    // let options = {
    //     offset: rangeObj['offset'],
    //     limit: rangeObj['limit'],
    //     sort: sortObj,
    //     lean: true,
    //     leanWithId: false,
    // };

    // var query = {};

    // const pageID = req.currentUser.activePage;

    // if (pageID) {
    //     query = Flavor.find({ pageId: pageID });
    // }

    // Flavor.paginate(query, options, async (err, result) => {
    //     if (err) {
    //         res.status(500).json({ message: err.errmsg });
    //     } else {
    //         res.setHeader('Content-Range', util.format("flavors %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));

    //         for (var i = 0; i < result.docs.length; i++) {
    //             const tn = await getToppings(result.docs[i].toppings, pageID);
    //             for (var k = 0; k < tn.length; k++) {
    //                 result.docs[i].tn = result.docs[i].tn ? result.docs[i].tn + ' ' + tn[k].topping : tn[k].topping;
    //             }
    //         }
    //         res.status(200).json(result.docs);
    //     }
    // });
};

// List one record by filtering by ID
export const flavor_get_one = (req, res) => {
    if (req.params && req.params.id) {

        const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

        Flavor.findOne({ pageId: pageId, id: req.params.id }, (err, doc) => {
            if (err) {
                res.status(500).json({ message: err.errMsg });
            } else {
                res.status(200).json(doc);
            }
        });
    }
}

// CREATE A NEW RECORD
export const flavor_create = async (req, res) => {
    if (req.body) {

        const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

        const { categoryId, price } = req.body;
        let price_by_size = false;
        if (categoryId) {
            const category = await getCategory(pageId, categoryId);
            if (category)
                price_by_size = category.price_by_size;
        }

        if (price_by_size && price > 0) {
            res.status(500).json({ message: 'pos.flavors.messages.priceNotAllowed' });
        } else {
            let { id } = req.body;

            if (!id || id === 0) {
                const lastId = await Flavor.find({ pageId: pageId }).select('id').sort('-id').limit(1).exec();
                id = 1;
                if (lastId && lastId.length)
                    id = lastId[0].id + 1;
            }

            const newRecord = new Flavor({
                id: id,
                flavor: stringCapitalizeName(req.body.flavor),
                categoryId: req.body.categoryId,
                pageId: pageId,
                toppings: req.body.toppings,
                price: price,
                price_by_size: price_by_size,
            });

            newRecord.save()
                .then((result) => {
                    res.status(200).json(result);
                })
                .catch((err) => {
                    console.error(err);
                    if (err.code === 11000) {
                        res.status(500).json({ message: 'pos.messages.duplicatedKey' });
                    } else {
                        res.status(500).json({ message: err.errmsg });
                    }
                });
        }
    }
}

// UPDATE
export const flavor_update = async (req, res) => {
    if (req.body && req.body.id) {

        const pageId = req.currentUser.activePage;

        const { id, flavor, categoryId, price, toppings } = req.body;

        let price_by_size = false;
        if (categoryId) {
            const category = await getCategory(pageId, categoryId);
            if (category)
                price_by_size = category.price_by_size;
        }

        if (price_by_size && price > 0) {
            res.status(500).json({ message: 'pos.flavors.messages.priceNotAllowed' });
        } else {

            Flavor.findOne({ pageId: pageId, id: id }, (err, doc) => {
                if (!err) {
                    doc.flavor = stringCapitalizeName(flavor);
                    doc.categoryId = categoryId;
                    doc.toppings = toppings;
                    doc.price = price;
                    doc.price_by_size = price_by_size;
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
}

// DELETE
export const flavor_delete = (req, res) => {

    const pageId = req.currentUser.activePage;

    Flavor.findOneAndRemove({ pageId: pageId, id: req.params.id })
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
export const deleteManyFlavors = async (pageID) => {
    return await Flavor.deleteMany({ pageId: pageID }).exec();
}

export const getFlavors = async (pageID) => {
    var queryFlavor = Flavor.find({ pageId: pageID });
    queryFlavor.sort('flavor');
    queryFlavor.select('id flavor categoryId toppings price');
    return await queryFlavor.exec();
}

export const getFlavor = async (pageID, flavorID) => {
    var queryFlavor = Flavor.findOne({ pageId: pageID, id: flavorID });
    queryFlavor.select('id flavor categoryId price');
    return await queryFlavor.exec();
}

export const getFlavorByName = async (pageID, flavorName) => {
    const flavors = await getFlavors(pageID);
    var flavorsNames = [];

    for (var i = 0; i < flavors.length; i++) {
        flavorsNames.push(flavors[i].flavor);
    }


    const stringResult = stringSimilarity.findBestMatch(flavorName, flavorsNames);
    /* stringSimilarity searching for 'Escarola e bacon', result:
    { ratings:
        [ { target: 'Quatro queijos', rating: 0.09090909090909091 },
          { target: 'Frango com Catupiry', rating: 0.16 },
          { target: 'Escarola', rating: 0.7777777777777778 },
          { target: 'Escarola com bacon', rating: 0.9166666666666666 } ],
       bestMatch: { target: 'Escarola com bacon', rating: 0.9166666666666666 } }
        */

    if (stringResult.bestMatch.rating > 0.6) {
        const key = flavorsNames.indexOf(stringResult.bestMatch.target);
        console.log(stringResult, flavorsNames, key, flavors);
        return flavors[key];
    } else {
        return null;
    }
}
