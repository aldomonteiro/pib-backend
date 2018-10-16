import express from "express";
import Page from "../models/pages";
import util from "util";
import { configSortQuery } from '../util/util';
import { page_update } from '../controllers/pagesController';
import authenticate from "../controllers/authenticate";

const router = express.Router();

// check the token from the client
router.use(authenticate);

// UPDATE page
router.put('/:id', page_update);

// List all pages
// TODO: use filters in the query req.query
router.get("/", (req, res) => {

  console.log("Check pages from this query:", req.query);

  // check pages
  if (req.query.userID) {
    const userID = req.query.userID;
    const accessToken = req.query.accessToken;

    // console.log("Check pages from this user:", userID);

    // // List all pages
    // FB.setAccessToken(accessToken);
    // FB.api(`${userID}/accounts`, (response) => {
    //   if (!response || response.error) {
    //     constErrorMsg = response ? 'unknown error' : response.error;
    //     console.log(constErrorMsg);
    //     res.status(500).send(constErrorMsg)
    //   }
    //   else {
    //     for (const page of response.data) {
    //       const newRecord = new Page({
    //         id: page.id,
    //         name: page.name,
    //         access_token: page.access_token,
    //         userID: userID
    //       });

    //       newRecord.save().catch((err) => {
    //         console.log(err);
    //       })

    //       res.send('Sucesso');
    //     }
    //   })


  } else {
    var sortObj = req.query.sort ? configSortQuery(req.query.sort) : undefined;

    Page.find().sort(sortObj).then(result => {
      res.setHeader('Content-Range', util.format("pages %d-%d/%d", result.length, 1, result.length));
      res.json(result);
    });
  }

});

router.get("/:id", (req, res) => {
  Page.findOne({ id: req.params.id }).then(result => {
    res.json(result);
  });
});

// Create a new user
router.post('/', (req, res) => {
  if (req.body) {
    const newRecord = new Page({
      userID: req.body.userID,
      name: req.body.name,
      email: req.body.email,
      pictureUrl: req.body.pictureUrl,
      lastLogin: Date.now()
    });

    Page.findOne({ userID: newRecord.userID })
      .then(result => {
        // record found, just update the lastlogin
        Page.update({ _id: result._id }, { lastLogin: Date.now() },
          (err, doc) => {
            if (err) {
              res.status(500).send(`ERROR: ${err}`);
            }
            else {
              res.status(200).json({ succes: true });
            }
          })
      })
      .catch((err) => {
        // record not found, create a new one
        newRecord.save()
          .then((result) => res.status(200))
          .catch((err) => res.status(500).json({ statusText: err }))
      });
  }
});

// DELETE
router.delete('/:id', (req, res) => {
  Page.findOneAndRemove({ id: req.params.id })
    .then((result) => {
      res.json({
        success: true,
        msg: `It has been deleted.`,
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'Nothing to delete.' });
    });
});


export default router;
