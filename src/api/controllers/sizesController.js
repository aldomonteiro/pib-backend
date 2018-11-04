import Size from "../models/sizes";
import util from "util";
import stringCapitalizeName from 'string-capitalize-name';
import { configSortQuery, configRangeQuery } from '../util/util';

// List all sizes
// TODO: use filters in the query req.query
export const size_get_all = async (req, res) => {
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

    var queryObj = {};
    if (req.query.filter) {
        var arr = JSON.parse(req.query.filter);
        queryObj[arr[0]] = arr[1];
    }
    if (req.currentUser.activePage) {
        queryObj["pageId"] = req.currentUser.activePage;
    }
    var query = {};
    if (req.query.filter || req.currentUser.activePage) {
        query = Size.find(queryObj);
    }

    Size.paginate(query, options, async (err, result) => {
        if (err) {
            res.status(500).json({ message: err.errmsg });
        } else {
            res.setHeader('Content-Range', util.format("sizes %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
            res.status(200).json(result.docs);
        }
    });
};

// List one record by filtering by ID
export const size_get_one = (req, res) => {
    if (req.params && req.params.id) {

        const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

        Size.findOne({ pageId: pageId, id: req.params.id }, (err, doc) => {
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
export const size_create = (req, res) => {
    if (req.body) {
        const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

        const newRecord = new Size({
            id: req.body.id,
            size: stringCapitalizeName(req.body.size),
            slices: req.body.slices,
            split: req.body.split,
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
export const size_update = (req, res) => {
    if (req.body && req.body.id) {

        const pageId = req.currentUser.activePage;

        Size.findOne({ pageId: pageId, id: req.body.id }, (err, doc) => {
            if (!err) {
                doc.size = stringCapitalizeName(req.body.size);
                doc.split = req.body.split;
                doc.slices = req.body.slices;
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
export const size_delete = (req, res) => {

    const pageId = req.currentUser.activePage;

    Size.findOneAndRemove({ pageId: pageId, id: req.params.id })
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(500).json({ message: err.errmsg });
        });
};

export const getSize = async (pageID, sizeID) => {
    const query = Size.findOne({ pageId: pageID, id: sizeID });
    query.select('id size');
    return await query.exec();
}

export const getSizes = (pageID, sizeIdArray) => {
    return Size.find({ pageId: pageID, id: sizeIdArray }).exec();
}
