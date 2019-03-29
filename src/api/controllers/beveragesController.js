
import Beverage from '../models/beverages';
import util from 'util';
import { configSortQuery, configRangeQuery, configFilterQueryMultiple } from '../util/util';

// List all records
export const beverage_get_all = (req, res) => {
    // Getting the sort from the requisition
    let sortObj = req.query.sort ? configSortQuery(req.query.sort) : { name: 'ASC' };
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
                } else
                    queryObj[filter] = value;
            }
        }
    }
    if (req.currentUser.activePage) {
        queryObj['pageId'] = req.currentUser.activePage;
    }

    Beverage.find(queryObj).sort(sortObj).exec((err, result) => {
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
            let responseArr = [];
            for (let i = _rangeIni; i < _rangeEnd; i++) {
                responseArr.push(result[i])
            }
            res.setHeader('Content-Range', util.format('beverages %d-%d/%d', _rangeIni, _rangeEnd, _totalCount));
            res.status(200).json(responseArr);
        }
    });
};

// List one record by filtering by ID
export const beverage_get_one = (req, res) => {
    if (req.params && req.params.id) {
        // Filter based on the currentUser
        const pageId = req.currentUser.activePage;

        Beverage.findOne({ pageId: pageId, id: req.params.id }, (err, doc) => {
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
export const beverage_create = (req, res) => {
    if (req.body) {

        const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

        const newRecord = new Beverage({
            id: req.body.id,
            kind: req.body.kind,
            name: req.body.name,
            price: req.body.price,
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
export const beverage_update = (req, res) => {
    if (req.body && req.body.id) {

        const pageId = req.currentUser.activePage;

        Beverage.findOne({ pageId: pageId, id: req.body.id }, (err, doc) => {
            if (!err) {
                doc.kind = req.body.kind;
                doc.name = req.body.name;
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
export const beverage_delete = (req, res) => {

    const pageId = req.currentUser.activePage;

    Beverage.findOneAndRemove({ pageId: pageId, id: req.params.id })
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
export const deleteManyBeverages = async (pageID) => {
    return await Beverage.deleteMany({ pageId: pageID }).exec();
}


export const getBeverages = async (pageID) => {
    let query = Beverage.find({ pageId: pageID });
    query.sort('name kind');
    return await query.exec();
}

export const getBeverage = async (pageID, beverageID) => {
    const query = Beverage.findOne({ pageId: pageID, id: beverageID });
    // query.select('id name kind price');
    return await query.exec();
}

