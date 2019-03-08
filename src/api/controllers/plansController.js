import Plan from '../models/plans';
import util from 'util';
import stringCapitalizeName from 'string-capitalize-name';
import { configSortQuery, configRangeQuery, configFilterQueryMultiple } from '../util/util';


// List all toppings
export const topping_get_all = async (req, res) => {
    // Getting the sort from the requisition
    let sortObj = req.query.sort ? configSortQuery(req.query.sort) : { plan: 'ASC' };
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

    Plan.find(queryObj).sort(sortObj).exec((err, result) => {
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
            let plansArray = [];
            for (let i = _rangeIni; i < _rangeEnd; i++) {
                plansArray.push(result[i])
            }
            res.setHeader('Content-Range', util.format('plans %d-%d/%d', _rangeIni, _rangeEnd, _totalCount));
            res.status(200).json(plansArray);
        }
    });
}

// List one record by filtering by ID
export const plan_get_one = (req, res) => {
    if (req.params && req.params.id) {
        Plan.findOne({ id: req.params.id }, (err, doc) => {
            if (err) {
                res.status(500).json({ message: err.errmsg });
            } else {
                res.status(200).json(doc);
            }
        });
    }
}

// CREATE A NEW RECORD
export const plan_create = (req, res) => {
    if (req.body) {
        const newRecord = new Plan({
            id: req.body.id,
            plan: stringCapitalizeName(req.body.plan),
            amount: req.body.amount,
            interval: req.body.interval,
            currency: req.body.currency,
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
export const plan_update = (req, res) => {
    Plan.findOne({ id: req.body.id }, (err, result) => {
        if (!err) {
            result.plan = stringCapitalizeName(req.body.plan);
            result.ammount = req.body.ammount;
            result.interval = req.body.interval;
            result.currency = req.body.currency;
            result.save((err, doc) => {
                if (err) {
                    res.status(500).json({ message: err.errmsg });
                } else {
                    res.status(200).json(doc);
                }
            });
        } else {
            res.status(500).json({ message: err.errmsg });
        }
    });


}

// DELETE
export const plan_delete = (req, res) => {
    Plan.findOneAndRemove({ id: req.params.id })
        .then((result) => {
            res.status(200).json({
                id: result.id,
                plan: result.plan,
            });
        })
        .catch((err) => {
            res.status(500).json({ message: err.errmsg });
        });
};
