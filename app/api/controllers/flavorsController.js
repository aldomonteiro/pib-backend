import Flavor from "../models/flavors";
import util from "util";
import stringCapitalizeName from 'string-capitalize-name';
import { configSortQuery, configRangeQuery } from '../util/util';

// List all flavors
// TODO: use filters in the query req.query
export const flavor_get_all = (req, res) => {
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

    Flavor.paginate(query, options, (err, result) => {
        if (err) {
            res.status(500).json({ message: err.errmsg });
        } else {
            res.setHeader('Content-Range', util.format("flavors %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
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