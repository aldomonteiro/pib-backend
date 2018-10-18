import Store from "../models/stores";
import util from "util";
import { configSortQuery, configRangeQuery } from '../util/util';

// List all records
// TODO: use filters in the query req.query
export const store_get_all = (req, res) => {
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
        query = Store.find({ pageId: req.currentUser.activePage });
    }

    Store.paginate(query, options, (err, result) => {
        if (err) {
            res.status(500).json({ message: err.errmsg });
        } else {
            res.setHeader('Content-Range', util.format("stores %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
            res.status(200).json(result.docs);
        }
    });
};

// List one record by filtering by ID
export const store_get_one = (req, res) => {
    if (req.params && req.params.id) {
        // Filter based on the currentUser
        const pageId = req.currentUser.activePage;

        Store.findOne({ pageId: pageId, id: req.params.id }, (err, doc) => {
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
export const store_create = (req, res) => {
    if (req.body) {

        const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

        const newRecord = new Store({
            id: req.body.id,
            pageId: pageId,
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            phone: req.body.phone,
            sun_is_open: req.body.sun_is_open,
            sun_open: req.body.sun_open,
            sun_close: req.body.sun_close,
            mon_is_open: req.body.mon_is_open,
            mon_open: req.body.mon_open,
            mon_close: req.body.mon_close,
            tue_is_open: req.body.tue_is_open,
            tue_open: req.body.tue_open,
            tue_close: req.body.tue_close,
            wed_is_open: req.body.wed_is_open,
            wed_open: req.body.wed_open,
            wed_close: req.body.wed_close,
            thu_is_open: req.body.thu_is_open,
            thu_open: req.body.thu_open,
            thu_close: req.body.thu_close,
            fri_is_open: req.body.fri_is_open,
            fri_open: req.body.fri_open,
            fri_close: req.body.fri_close,
            sat_is_open: req.body.sat_is_open,
            sat_open: req.body.sat_open,
            sat_close: req.body.sat_close,
            hol_is_open: req.body.hol_is_open,
            hol_open: req.body.hol_open,
            hol_close: req.body.hol_close,
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
export const store_update = (req, res) => {
    if (req.body && req.body.id) {

        const pageId = req.currentUser.activePage;

        Store.findOne({ pageId: pageId, id: req.body.id }, (err, doc) => {
            if (!err) {
                doc.name = req.body.name;
                doc.address = req.body.address;
                doc.city = req.body.city;
                doc.state = req.body.state;
                doc.phone = req.body.phone;
                // Opening times
                doc.sun_is_open = req.body.sun_is_open;
                doc.sun_open = req.body.sun_open;
                doc.sun_close = req.body.sun_close;
                doc.mon_is_open = req.body.mon_is_open;
                doc.mon_open = req.body.mon_open;
                doc.mon_close = req.body.mon_close;
                doc.tue_is_open = req.body.tue_is_open;
                doc.tue_open = req.body.tue_open;
                doc.tue_close = req.body.tue_close;
                doc.wed_is_open = req.body.wed_is_open;
                doc.wed_open = req.body.wed_open;
                doc.wed_close = req.body.wed_close;
                doc.thu_is_open = req.body.thu_is_open;
                doc.thu_open = req.body.thu_open;
                doc.thu_close = req.body.thu_close;
                doc.fri_is_open = req.body.fri_is_open;
                doc.fri_open = req.body.fri_open;
                doc.fri_close = req.body.fri_close;
                doc.sat_is_open = req.body.sat_is_open;
                doc.sat_open = req.body.sat_open;
                doc.sat_close = req.body.sat_close;
                doc.hol_is_open = req.body.hol_is_open;
                doc.hol_open = req.body.hol_open;
                doc.hol_close = req.body.hol_close;

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
export const store_delete = (req, res) => {

    const pageId = req.currentUser.activePage;

    Store.findOneAndRemove({ pageId: pageId, id: req.params.id })
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(500).json({ message: err.errmsg });
        });
};