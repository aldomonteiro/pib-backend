import Flavor from "../models/flavors";
import util from "util";
import stringSimilarity from 'string-similarity';
import stringCapitalizeName from 'string-capitalize-name';
import { configSortQuery, configRangeQuery } from '../util/util';
import { getToppings } from './toppingsController';

// List all flavors
// TODO: use filters in the query req.query
export const flavor_get_all = async (req, res) => {
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
        query = Flavor.find({ pageId: req.currentUser.activePage });
    }

    Flavor.paginate(query, options, async (err, result) => {
        if (err) {
            res.status(500).json({ message: err.errmsg });
        } else {
            res.setHeader('Content-Range', util.format("flavors %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));

            for (var i = 0; i < result.docs.length; i++) {
                const tn = await getToppings(result.docs[i].toppings);
                for (var k = 0; k < tn.length; k++) {
                    result.docs[i].tn = result.docs[i].tn ? result.docs[i].tn + ' ' + tn[k].topping : tn[k].topping;
                }
            }
            res.status(200).json(result.docs);
        }
    });
};

// List one record by filtering by ID
export const flavor_get_one = (req, res) => {
    if (req.params && req.params.id) {

        const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

        Flavor.findOne({ pageId: pageId, id: req.params.id }, (err, doc) => {
            if (err) {
                res.status(500).json({ message: err.errMsg });
            }
            else {
                res.status(200).json(doc);
            }
        });
    }
}

// CREATE A NEW RECORD
export const flavor_create = (req, res) => {
    if (req.body) {

        const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

        const newRecord = new Flavor({
            id: req.body.id,
            flavor: stringCapitalizeName(req.body.flavor),
            kind: req.body.kind,
            pageId: pageId,
            toppings: req.body.toppings,
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
export const flavor_update = (req, res) => {
    if (req.body && req.body.id) {

        const pageId = req.currentUser.activePage;

        Flavor.findOne({ pageId: pageId, id: req.body.id }, (err, doc) => {
            if (!err) {
                doc.flavor = stringCapitalizeName(req.body.flavor);
                doc.kind = req.body.kind;
                doc.toppings = req.body.toppings;

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
    queryFlavor.select('id flavor kind toppings');
    return await queryFlavor.exec();
}

export const getFlavor = async (pageID, flavorID) => {
    var queryFlavor = Flavor.findOne({ pageId: pageID, id: flavorID });
    queryFlavor.select('id flavor kind');
    return await queryFlavor.exec();
}

export const getFlavorByName = async (pageID, flavorName) => {
    const flavors = await getFlavors(pageID);
    var flavorsNames = new Array();

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