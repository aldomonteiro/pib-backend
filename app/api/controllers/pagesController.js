
import Page from "../models/pages";
import User from "../models/users";
import axios from 'axios';


// Update or create a new page
export const page_update = (req, res) => {

    console.log("page_update");
    console.log(req.body);

    const pageId = req.body.id;

    // Find a page by id
    Page.findOne({ id: pageId }, (err, doc) => {
        if (err) { // err !== null
            res.status(500).json({ message: err.errmsg });
            return;
        }
        var record;

        if (doc) {
            record = doc;
        } else {
            record = new Page({
                id: pageId,
                name: req.body.name,
                accessToken: req.body.access_token,
            });
        }
        record.save((err, result) => {
            if (err) {
                res.status(500).json({ message: err.errmsg });
            } else {
                subscribedApps(result.id, result.accessToken)
                    .then(response => {
                        console.log(response);

                        if (response && !response.error) {
                            res.status(200).json(result);
                        } else {
                            res.status(500).json({ message: response.error.message });
                        }
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).json({ message: err.message });
                    });
            }
        });

        // update ActivePage for the current user
        if (req.currentUser) {
            User.findOne({ userID: req.currentUser.userID }, (err, docFind) => {
                if (err) {
                    res.status(500).json({ message: err.errmsg });
                    return;
                }

                if (docFind) {
                    docFind.activePage = pageId;
                    docFind.save((err, docSave) => {
                        if (err) {
                            res.status(500).json({ message: err.errmsg });
                        }
                    })
                }
            });
        }
    });
}

//oauth/access_token?grant_type=fb_exchange_token&client_id=267537643995936&client_secret=1b5307cb418218dc1b0d38568be37340&fb_exchange_token=EAADzUvY8AyABALCKnnO0nQKYa5GqwNwIiOn3ZCiUrvCZCiTHFzBZB0GNim12elB7j4WTqZCpQ4q6doZC9ZAmc3K4u1Dz8cCu3vZA8SRy7OqAewcXbPS00XVhAWWLrNkEqevdN9EGNRu2iGpMjTiQ4cxBrrbFmlATwqZCuP0wiRTaOEDcnh66KZABaVHrykAnaAAqNp5On1TvWHQZDZD
export const subscribedApps = async (pageId, accessToken) => {

    // https://graph.facebook.com/v3.1/{page-id}/subscribed_apps?access_token={}
    const facebookUrl = `https://graph.facebook.com/v3.1/${pageId}/subscribed_apps?access_token=${accessToken}`

    return await axios.post(facebookUrl).then(res => res);
}
