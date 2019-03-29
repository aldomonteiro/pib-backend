import Topping from '../models/toppings';
import util from 'util';
import stringCapitalizeName from 'string-capitalize-name';
import { configSortQuery, configRangeQuery, configFilterQueryMultiple } from '../util/util';


// List all toppings
export const topping_get_all = async (req, res) => {
    // Getting the sort from the requisition
    let sortObj = req.query.sort ? configSortQuery(req.query.sort) : { topping: 'ASC' };
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

    Topping.find(queryObj).sort(sortObj).exec((err, result) => {
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
            let toppingsArray = [];
            for (let i = _rangeIni; i < _rangeEnd; i++) {
                toppingsArray.push(result[i])
            }
            res.setHeader('Content-Range', util.format('toppings %d-%d/%d', _rangeIni, _rangeEnd, _totalCount));
            res.status(200).json(toppingsArray);
        }
    });
}

// List one record by filtering by ID
export const topping_get_one = (req, res) => {
    if (req.params && req.params.id) {
        const pageID = req.currentUser.activePage ? req.currentUser.activePage : null;

        Topping.findOne({ pageId: pageID, id: req.params.id }, (err, doc) => {
            if (err) {
                res.status(500).json({ message: err.errmsg });
            }
            else {
                res.status(200).json({ id: doc.id, topping: doc.topping });
            }
        });
    }
}

// CREATE A NEW RECORD
export const topping_create = async (req, res) => {
    if (req.body) {
        const pageID = req.currentUser.activePage ? req.currentUser.activePage : null;

        let { id } = req.body;

        if (!id || id === 0) {
            const lastId = await Topping.find({ pageId: pageID }).select('id').sort('-id').limit(1).exec();
            id = 1;
            if (lastId && lastId.length)
                id = lastId[0].id + 1;
        }

        const newRecord = new Topping({
            id: id,
            topping: stringCapitalizeName(req.body.topping),
            pageId: pageID,
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
export const topping_update = (req, res) => {

    const pageID = req.currentUser.activePage;

    Topping.findOne({ pageId: pageID, id: req.body.id }, (err, doc) => {
        if (!err) {
            doc.topping = stringCapitalizeName(req.body.topping);
            doc.save((err, doc) => {
                if (err) {
                    res.status(500).json({ message: err.errmsg });
                } else {
                    res.status(200).json({
                        id: doc.id,
                        topping: doc.topping,
                    });
                }
            });
        } else {
            res.status(500).json({ message: err.errmsg });
        }
    });


}

// DELETE
export const topping_delete = (req, res) => {
    const pageID = req.currentUser.activePage;

    Topping.findOneAndRemove({ pageId: pageID, id: req.params.id })
        .then((result) => {
            res.status(200).json({
                id: result.id,
                topping: result.topping,
            });
        })
        .catch((err) => {
            res.status(500).json({ message: err.errmsg });
        });
};

export const getToppings = async (toppingsArray, pageID) => {
    var queryTopping = Topping.find({ pageId: pageID, id: { $in: toppingsArray } });
    queryTopping.sort('topping');
    queryTopping.select('topping');
    return await queryTopping.exec();
}

export const getToppingsNames = async (toppingsArray, pageID) => {
    const toppingsModel = await getToppings(toppingsArray, pageID);
    const toppingsNamesArray = [];
    for (let topObj of toppingsModel) {
        toppingsNamesArray.push(topObj.topping);
    }
    return toppingsNamesArray;
}

export const getToppingsFull = async (pageID) => {
    let query = Topping.find({ pageId: pageID });
    query.sort('topping');
    return await query.exec();
}


/**
 * Delete all records from a pageID
 * @param {*} pageID
 */
export const deleteManyToppings = async (pageID) => {
    return await Topping.deleteMany({ pageId: pageID }).exec();
}

