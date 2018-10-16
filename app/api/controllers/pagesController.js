
import Page from "../models/pages";
import User from "../models/users";


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
                res.status(200).json(result);
            }
        });
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

};
