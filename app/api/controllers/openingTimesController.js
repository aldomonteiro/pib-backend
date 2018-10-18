import OpeningTimes from "../models/openingtimes";
import util from "util";
import { configSortQuery, configRangeQuery } from '../util/util';

// List all records
// TODO: use filters in the query req.query
export const openingtimes_get_all = (req, res) => {

    console.log(">>>> openingtimesController openingtimes_get_all <<<<");
    console.log(req.query);
    console.log(">>>> openingtimesController openingtimes_get_all <<<<");

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
        query = OpeningTimes.find({ pageId: req.currentUser.activePage });
    }

    OpeningTimes.paginate(query, options, (err, result) => {
        if (err) {
            res.status(500).json({ message: err.errmsg });
        } else {
            res.setHeader('Content-Range', util.format("openingtimes %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
            res.status(200).json(result.docs);
        }
    });
};

// List one record by filtering by ID
export const openingtimes_get_one = (req, res) => {
    if (req.params && req.params.id) {
        // Filter based on the currentUser
        const pageId = req.currentUser.activePage;

        OpeningTimes.findOne({ pageId: pageId, store_id: req.params.store_id }, (err, doc) => {
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
export const openingtimes_create = (req, res) => {
    if (req.body) {

        const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

        const newRecord = new OpeningTimes({
            store_id: req.body.store_id,
            pageId: pageId,
            sun_open: req.body.sun_open,
            sun_close: req.body.sun_close,
            mon_open: req.body.mon_open,
            mon_close: req.body.mon_close,
            tue_open: req.body.tue_open,
            tue_close: req.body.tue_close,
            wed_open: req.body.tue_open, // wed_open
            wed_close: req.body.tue_close, // wed_close
            thu_open: req.body.tue_open,
            thu_close: req.body.tue_close,
            fri_open: req.body.tue_open,
            fri_close: req.body.tue_close,
            sat_open: req.body.tue_open,
            sat_close: req.body.tue_close,
            hol_open: req.body.tue_open,
            hol_close: req.body.tue_close,
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
export const openingtimes_update = (req, res) => {
    if (req.body && req.body.id) {

        const pageId = req.currentUser.activePage;

        OpeningTimes.findOne({ pageId: pageId, store_id: req.body.store_id }, (err, doc) => {
            if (!err) {
                doc.sun_open = req.body.sun_open;
                doc.sun_close = req.body.sun_close;
                doc.mon_open = req.body.mon_open;
                doc.mon_close = req.body.mon_close;
                doc.tue_open = req.body.tue_open;
                doc.tue_close = req.body.tue_close;
                doc.wed_open = req.body.tue_open; // wed_open
                doc.wed_close = req.body.tue_close; // wed_close
                doc.thu_open = req.body.tue_open;
                doc.thu_close = req.body.tue_close;
                doc.fri_open = req.body.tue_open;
                doc.fri_close = req.body.tue_close;
                doc.sat_open = req.body.tue_open;
                doc.sat_close = req.body.tue_close;
                doc.hol_open = req.body.tue_open;
                doc.hol_close = req.body.tue_close;

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
export const openingtimes_delete = (req, res) => {

    const pageId = req.currentUser.activePage;

    OpeningTimes.findOneAndRemove({ pageId: pageId, store_id: req.params.store_id })
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(500).json({ message: err.errmsg });
        });
};