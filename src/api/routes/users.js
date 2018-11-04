import express from "express";
import User from "../models/users";
import util from "util";
import stringCapitalizeName from 'string-capitalize-name';
import { configSortQuery } from '../util/util';
import { users_auth, users_create } from '../controllers/usersController';

const router = express.Router();

// Authenticate user
router.post('/auth', users_auth);

// Create/update/authenticate user
router.post('/create', users_create);

// TODO: move to usersController
// List all users
// TODO: use filters in the query req.query
router.get("/", (req, res) => {

  var sortObj = configSortQuery(req.query.sort);

  User.find().sort(sortObj).then(result => {
    res.setHeader('Content-Range', util.format("users %d-%d/%d", result.length, 1, result.length));
    res.json(result);
  });

});

router.get("/:id", (req, res) => {
  User.findOne({ id: req.params.id }).then(result => {
    res.json(result);
  });
});

// UPDATE
router.put('/:id', (req, res) => {
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
});

// DELETE
router.delete('/:id', (req, res) => {
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
});


const sanitizeName = (name) => {
  return stringCapitalizeName(name);
}

export default router;
