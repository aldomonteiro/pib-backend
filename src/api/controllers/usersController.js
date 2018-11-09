import User from "../models/users";
import axios from 'axios';
import dotenv from "dotenv";
import util from "util";
import { configSortQuery, configRangeQuery } from '../util/util';

export const users_auth = (req, res) => {
    if (req.body) {

        User.findOne({ userID: req.body.userID }, (err, foundUser) => {
            if (err) {
                res.status(500).json(err);
                return;
            }

            if (foundUser) {
                foundUser.lastLogin = Date.now();
                foundUser.locationName = req.body.locationName;
                // if (!foundUser.hasLongLivedToken) {
                changeAccessToken(foundUser.accessToken).then(data => {
                    foundUser.hasLongLivedToken = true;
                    foundUser.accessToken = data.access_token;
                    foundUser.save();
                    res.status(200).json({ user: foundUser.toAuthJSON() });
                }).catch(err => console.log(err.response.data));
                // } else {
                //     foundUser.save();
                //     res.status(200).json({ user: foundUser.toAuthJSON() });
                // }
            } else {
                const newRecord = new User({
                    userID: req.body.userID,
                    name: req.body.name,
                    email: req.body.email,
                    pictureUrl: req.body.pictureUrl,
                    accessToken: req.body.accessToken,
                    timeZone: req.body.timeZone,
                    locationName: req.body.locationName,
                });

                changeAccessToken(newRecord.accessToken)
                    .then(data => {
                        newRecord.hasLongLivedToken = true;
                        newRecord.accessToken = data.access_token;
                        newRecord.save()
                            .then(record => res.status(200).json({ user: record.toAuthJSON() }))
                            .catch((err) => {
                                console.error(err);
                                res.status(500).json(err)
                            });
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(500).json(err)
                    });
            }
        });
    }
}

export const users_create = (req, res) => {
    var queryUser = User.findOne({ userID: req.body.userID });
    const foundUser = queryUser.exec();
    console.log("users_create");
    console.log(foundUser);
    if (foundUser) {
        users_auth(req, res);
    } else {
        const newRecord = new User({
            userID: req.body.userID,
            name: req.body.name,
            email: req.body.email,
            pictureUrl: req.body.pictureUrl,
            accessToken: req.body.accessToken,
            timeZone: req.body.timeZone,
        });

        changeAccessToken(newRecord.accessToken)
            .then((data) => {
                newRecord.hasLongLivedToken = true;
                newRecord.accessToken = data.access_token;
                newRecord.save()
                    .then(record => res.status(200).json({ user: record.toAuthJSON() }))
                    .catch((err) => {
                        console.error(err);
                        res.status(500).json(err)
                    });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json(err)
            });
    }
}

// List all users
// TODO: use filters in the query req.query
export const users_get_all = (req, res) => {
    // Getting the sort from the requisition
    // var sortObj = configSortQuery(req.query.sort);
    // Getting the range from the requisition
    var rangeObj = configRangeQuery(req.query.range);

    // let options = {
    //     offset: rangeObj['offset'],
    //     limit: rangeObj['limit'],
    //     sort: sortObj,
    //     lean: true,
    //     leanWithId: false,
    // };

    var query = {};

    // User.paginate(query, options, (err, result) => {
    User.find((err, result) => {
        if (err) {
            res.status(500).json({ message: err.errmsg });
        } else {
            res.setHeader('Content-Range', util.format("users %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
            res.status(200).json(result);
        }
    });
}

// List one record by filtering by ID
export const users_get_one = (req, res) => {
    if (req.params && req.params.id) {

        User.findOne({ userID: req.params.id }, (err, doc) => {
            if (err) {
                res.status(500).json({ message: err.errMsg });
            }
            else {
                res.status(200).json(doc);
            }
        });
    }
}

// UPDATE
export const users_update = (req, res) => {
    let updatedElement = {
        id: req.body.id,
        name: sanitizeName(req.body.name),
        email: req.body.email,
    };

    User.findOneAndUpdate({ id: req.params.id }, updatedElement)
        .then((oldResult) => {
            User.findOne({ id: req.params.id })
                .then((newResult) => {
                    res.json({
                        data: {
                            _id: newResult._id,
                            id: newResult.id,
                            name: newResult.name,
                            email: newResult.email,
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
                    return;
                });
        })
        .catch((err) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
}

// DELETE
export const users_delete = (req, res) => {
    User.findOneAndRemove({ id: req.params.id })
        .then((result) => {
            res.json({
                success: true,
                msg: `It has been deleted.`,
            });
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: 'Nothing to delete.' });
        });
}



export const changeAccessToken = async (accessToken) => {

    dotenv.config();

    const facebookAccessTokenUrl = process.env.FACEBOOK_URL_OAUTH_ACCESS_TOKEN;
    const params = {
        grant_type: 'fb_exchange_token',
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_SECRET_KEY,
        fb_exchange_token: accessToken,
    }

    return await axios.get(facebookAccessTokenUrl, { params }).then(res => res.data);
}

