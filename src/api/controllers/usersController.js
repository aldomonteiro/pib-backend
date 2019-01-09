import User from "../models/users";
import axios from 'axios';
import dotenv from "dotenv";
import util from "util";
import { configSortQuery, configRangeQuery } from '../util/util';

export const users_auth = async (req, res) => {
    if (req.body) {
        try {
            let user = await User.findOne({ userID: req.body.userID }).exec();
            if (!user) {
                user = new User({
                    userID: req.body.userID,
                    name: req.body.name,
                    email: req.body.email,
                    pictureUrl: req.body.pictureUrl,
                    accessToken: req.body.accessToken,
                    timeZone: req.body.timeZone,
                    locationName: req.body.locationName,
                });
            } else {
                user.accessToken = req.body.accessToken;
            }

            user.lastLogin = Date.now();
            user.locationName = req.body.locationName;
            user.shortLivedToken = user.accessToken; // only for debug analysis

            const respChangeToken = await changeAccessToken(user.accessToken);
            if (respChangeToken) {
                if (respChangeToken.hasOwnProperty('data')) {
                    if (respChangeToken.data.hasOwnProperty('access_token')) {
                        respChangeToken.access_token = respChangeToken.data.access_token;
                    }
                }
                user.hasLongLivedToken = true;
                user.longLivedToken = respChangeToken.access_token; // only for debug analysis
                user.accessToken = respChangeToken.access_token; // the token used in the system
            }

            await user.save();
            res.status(200).json({ user: user.toAuthJSON() });
        } catch (users_auth_error) {
            console.error({ users_auth_error });
            res.status(500).json({ message: users_auth_error.message });
        }
    }
}

export const users_code = async (req, res) => {
    try {
        const _code = req.body.code;
        const _redirect_uri = req.body.redirect_uri;

        console.info({ _redirect_uri });

        dotenv.config();

        const facebookAccessTokenUrl = process.env.FACEBOOK_URL_OAUTH_ACCESS_TOKEN;
        const params = {
            client_id: process.env.FACEBOOK_APP_ID,
            redirect_uri: _redirect_uri,
            client_secret: process.env.FACEBOOK_SECRET_KEY,
            code: _code,
        }

        const result = await axios.get(facebookAccessTokenUrl, { params });
        if (result && result.data && result.data.access_token) {
            console.info(result.data);
            res.status(200).send(result.data);
        }
        else {
            console.error(result.response && response.data);
            const errorMsg = result.response ? result.response.data.error.message : result.data ? result.data.error.message : 'Unknown error';
            res.status(500).json({ message: errorMsg });
        }
    } catch (err) {
        console.error(err.request);
        console.error(err.response);
        console.error(err.response.data.error);
        res.status(500).json({ message: err.response.data.error.message })
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
    try {
        dotenv.config();

        const env = process.env.NODE_ENV || 'production';
        let facebook_app_id, facebook_secret_key = '';

        if (env === 'production') {
            facebook_app_id = process.env.FACEBOOK_APP_ID;
            facebook_secret_key = process.env.FACEBOOK_SECRET_KEY;
        } else {
            facebook_app_id = process.env.DEV_FACEBOOK_APP_ID;
            facebook_secret_key = process.env.DEV_FACEBOOK_SECRET_KEY;
        }

        const facebookAccessTokenUrl = process.env.FACEBOOK_URL_OAUTH_ACCESS_TOKEN;
        const params = {
            grant_type: 'fb_exchange_token',
            client_id: facebook_app_id,
            client_secret: facebook_secret_key,
            fb_exchange_token: accessToken,
        }
        return await axios.get(facebookAccessTokenUrl, { params });
    } catch (changeAccessTokenError) {
        console.error({ changeAccessToken });
        return null;
    }
    // return await axios.get(facebookAccessTokenUrl, { params }).then(res => res.data);
}

export const removeUserActivePage = async userID => {
    try {
        let user = await User.findOne({ userID: userID }).exec();
        if (user) {
            user.activePage = null;
            await user.save();
            return true;
        }
        return false;
    } catch (removeUserActivePageErr) {
        console.error(removeUserActivePageErr);
        throw removeUserActivePageErr;
    }
}

