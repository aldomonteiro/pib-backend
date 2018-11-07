import User from "../models/users";
import axios from 'axios';
import dotenv from "dotenv";

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
                            .catch(err => res.status(500).json(err));
                    })
                    .catch(err => res.status(500).json(err));
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
            .then(data => {
                newRecord.hasLongLivedToken = true;
                newRecord.accessToken = data.access_token;
                newRecord.save()
                    .then(record => res.status(200).json({ user: record.toAuthJSON() }))
                    .catch(err => res.status(500).json(err));
            })
            .catch(err => res.status(500).json(err));
    }
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

