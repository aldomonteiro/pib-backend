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
            res.setHeader('Content-Range', util.format('stores %d-%d/%d', rangeObj['offset'], rangeObj['limit'], result.total));
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
            } else {
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
            delivery_fee: req.body.delivery_fee,
            location_lat: req.location_lat,
            location_long: req.location_long,
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
            catalog_url1: req.body.catalog_url1,
            catalog_url2: req.body.catalog_url2,
            missing_address_notification: req.body.missing_address_notification,
            accept_notification: req.body.accept_notification,
            deliver_notification: req.body.deliver_notification,
            total_notification: req.body.total_notification,
            autoreply_notification: req.body.autoreply_notification,
            autoreply_delay: req.body.autoreply_delay,
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

        const { id, operation, deliveryTime, pickupTime } = req.body;
        if (operation) {
            Store.findOne({ pageId: pageId, id: id }, (err, doc) => {
                if (!err) {
                    if (operation === 'UPDATE_DELIVERY_TIME' && deliveryTime)
                        doc.delivery_time = deliveryTime;
                    if (operation === 'UPDATE_PICKUP_TIME' && pickupTime)
                        doc.pickup_time = pickupTime;

                    doc.save((err, result) => {
                        if (err) {
                            res.status(500).json({ message: err.errmsg });
                        } else {
                            res.status(200).json(result);
                        }
                    });
                }
            });

        } else {
            Store.findOne({ pageId: pageId, id: id }, (err, doc) => {
                if (!err) {
                    doc.name = req.body.name;
                    doc.address = req.body.address;
                    doc.city = req.body.city;
                    doc.state = req.body.state;
                    doc.phone = req.body.phone;
                    doc.delivery_fee = req.body.delivery_fee;
                    doc.delivery_fees = req.body.delivery_fees;
                    doc.location_lat = req.body.location_lat;
                    doc.location_long = req.body.location_long;
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

                    // Customizing
                    doc.printer = req.body.printer;
                    doc.catalog_url1 = req.body.catalog_url1;
                    doc.catalog_url2 = req.body.catalog_url2;
                    doc.payment_types = req.body.payment_types;
                    doc.missing_address_notification = req.body.missing_address_notification;
                    doc.accept_notification = req.body.accept_notification;
                    doc.deliver_notification = req.body.deliver_notification;
                    doc.total_notification = req.body.total_notification;
                    doc.default_messages = req.body.default_messages;
                    doc.autoreply_notification = req.body.autoreply_notification;
                    doc.autoreply_delay = req.body.autoreply_delay;

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

/**
 * Delete all records from a pageID
 * @param {*} pageID
 */
export const deleteManyStores = async (pageID) => {
    return await Store.deleteMany({ pageId: pageID }).exec();
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

export const getStores = async (pageID) => {
    // TODO: if is there more than one Store?
    const query = Store.find({ pageId: pageID });
    return await query.exec();
}

export const getStoreData = async (pageID) => {
    // TODO: if is there more than one Store?
    const query = Store.findOne({ pageId: pageID });
    return await query.exec();
}

/**
 * Used by WhatsappController
 * @param {*} phone
 */
export const getStoreByPhone = async (phone) => {
    return await Store.findOne({ phone: phone }).exec();
}

export const getTodayOpeningTime = async pageID => {
    const _store = await getStoreData(pageID);
    let _today = new Date();

    let _tomorrow = new Date();
    _tomorrow.get
    _tomorrow.setDate(_today.getDate() + 1);

    let todayOpenAt; let todayCloseAt; let tomorrowOpenAt; let tomorrowCloseAt = '';
    let todayIsOpen; let tomorrowIsOpen = false;

    if (_today.getDay() === 1) {
        todayIsOpen = _store.sun_is_open;
        todayOpenAt = _store.sun_open;
        todayCloseAt = _store.sun_close;

        tomorrowIsOpen = _store.mon_is_open;
        tomorrowOpenAt = _store.mon_open;
        tomorrowCloseAt = _store.mon_close;
    }
    else if (_today.getDay() === 2) {
        todayIsOpen = _store.mon_is_open;
        todayOpenAt = _store.mon_open;
        todayCloseAt = _store.mon_close;

        tomorrowIsOpen = _store.tue_is_open;
        tomorrowOpenAt = _store.tue_open;
        tomorrowCloseAt = _store.tue_close;
    }
    else if (_today.getDay() === 3) {
        todayIsOpen = _store.tue_is_open;
        todayOpenAt = _store.tue_open;
        todayCloseAt = _store.tue_close;

        tomorrowIsOpen = _store.wed_is_open;
        tomorrowOpenAt = _store.wed_open;
        tomorrowCloseAt = _store.wed_close;
    }
    else if (_today.getDay() === 4) {
        todayIsOpen = _store.wed_is_open;
        todayOpenAt = _store.wed_open;
        todayCloseAt = _store.wed_close;

        tomorrowIsOpen = _store.thu_is_open;
        tomorrowOpenAt = _store.thu_open;
        tomorrowCloseAt = _store.thu_close;
    }
    else if (_today.getDay() === 5) {
        todayIsOpen = _store.thu_is_open;
        todayOpenAt = _store.thu_open;
        todayCloseAt = _store.thu_close;

        tomorrowIsOpen = _store.fri_is_open;
        tomorrowOpenAt = _store.fri_open;
        tomorrowCloseAt = _store.fri_close;
    }
    else if (_today.getDay() === 6) {
        todayIsOpen = _store.fri_is_open;
        todayOpenAt = _store.fri_open;
        todayCloseAt = _store.fri_close;

        tomorrowIsOpen = _store.sat_is_open;
        tomorrowOpenAt = _store.sat_open;
        tomorrowCloseAt = _store.sat_close;
    }
    else if (_today.getDay() === 7) {
        todayIsOpen = _store.sat_is_open;
        todayOpenAt = _store.sat_open;
        todayCloseAt = _store.sat_close;

        tomorrowIsOpen = _store.sun_is_open;
        tomorrowOpenAt = _store.sun_open;
        tomorrowCloseAt = _store.sun_close;
    }

    const _openAtHours = new Date(todayOpenAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })
    const _closeAtHours = new Date(todayCloseAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })

    const _openAtHoursTom = new Date(tomorrowOpenAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })
    const _closeAtHoursTom = new Date(tomorrowCloseAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })

    return { todayIsOpen, todayOpenAt: _openAtHours, todayCloseAt: _closeAtHours, tomorrowIsOpen, tomorrowOpenAt: _openAtHoursTom, tomorrowCloseAt: _closeAtHoursTom };
}

export const calcDeliveryFee = (deliveryFees, distanceFromStore) => {
    if (deliveryFees && deliveryFees.length > 0) {
        for (let delivFee of deliveryFees) {
            if (delivFee.from <= distanceFromStore && delivFee.to > distanceFromStore) {
                return delivFee.fee;
            }
        }
    } else return 0;
}
