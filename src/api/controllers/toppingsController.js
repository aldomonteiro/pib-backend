import Topping from '../models/toppings';
import util from "util";
import stringCapitalizeName from 'string-capitalize-name';
import { configSortQuery, configRangeQuery } from '../util/util';


// List all toppings
// TODO: use filters in the query req.query
export const topping_get_all = (req, res) => {
    // Getting the sort from the requisition

    var sortObj = req.query.sort ? configSortQuery(req.query.sort) : { topping: 'ASC' };

    if (req.query.range) {
        var rangeObj = configRangeQuery(req.query.range);
        const options = {
            offset: rangeObj['offset'],
            limit: rangeObj['limit'],
            sort: sortObj,
            lean: true,
            leanWithId: false,
        };
        Topping.paginate({}, options, (err, result) => {
            if (err) {
                res.status(500).json({ message: err.errmsg });
            } else {
                res.setHeader('Content-Range', util.format("toppings %d-%d/%d", rangeObj['offset'] + 1, rangeObj['limit'], result.total));
                res.status(200).json(result.docs);
            }
        });
    } else {
        Topping.find((err, result) => {
            if (err) {
                res.status(500).json({ message: err.errmsg });
            } else {
                res.setHeader('Content-Range', util.format("toppings %d-%d/%d", 1, result.length - 1, result.length));
                res.status(200).json(result);
            }
        });
    }
};

// List one record by filtering by ID
export const topping_get_one = (req, res) => {
    if (req.params && req.params.id) {
        Topping.findOne({ id: req.params.id }, (err, doc) => {
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
export const topping_create = (req, res) => {
    if (req.body) {
        const newRecord = new Topping({
            id: req.body.id,
            topping: stringCapitalizeName(req.body.topping),
        });

        newRecord.save()
            .then((result) => {
                res.status(200).json({
                    id: result.id,
                    topping: result.topping,
                });
            })
            .catch((err) => {
                res.status(500).json({ message: err.errmsg });
            });
    }
}

// UPDATE
export const topping_update = (req, res) => {
    Topping.findOne({ id: req.body.id }, (err, doc) => {
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
    Topping.findOneAndRemove({ id: req.params.id })
        .then((result) => {
            res.status(200).json({
                id: result.id,
                topping: result.topping
            });
        })
        .catch((err) => {
            res.status(500).json({ message: err.errmsg });
        });
};

export const getToppings = async (toppingsArray) => {
    var queryTopping = Topping.find({ id: { $in: toppingsArray } });
    queryTopping.sort('topping');
    queryTopping.select('topping');
    return await queryTopping.exec();
}

export const getToppingsNames = async (toppingsArray) => {
    const toppingsModel = await getToppings(toppingsArray);
    const toppingsNamesArray = new Array();
    for (let topObj of toppingsModel) {
        toppingsNamesArray.push(topObj.topping);
    }
    return toppingsNamesArray;
}