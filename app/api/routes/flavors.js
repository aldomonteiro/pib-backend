import express from "express";
import Flavor from "../models/flavors";
import Topping from '../models/toppings';
import util from "util";
import stringCapitalizeName from 'string-capitalize-name';

const router = express.Router();

// List all flavors
// TODO: use filters in the query req.query
router.get("/", (req, res) => {
  // not considering the query filters yet
  Flavor.find().then(result => {
    res.setHeader('Content-Range', util.format("flavors %d-%d/%d", result.length, 1, result.length));
    res.json(result);
  });

});

router.get("/:id", (req, res) => {
  Flavor.findOne({ id: req.params.id }).then(result => {
    res.json(result);
  });
});

// Create a new flavor
router.post('/', (req, res) => {
  if (req.body) {
    const newRecord = new Flavor({
      id: req.body.id,
      flavor: sanitizeName(req.body.flavor),
      kind: sanitizeName(req.body.kind),
      toppings: req.body.toppings.split(","),
    });

    newRecord.save()
      .then((result) => {
        res.json({
          data: {
            id: result.id,
            flavor: result.flavor,
            kind: result.kind,
            toppings: result.toppings
          }
        });
      })
      .catch((err) => {
        if (err.errors) {
          if (err.errors.flavor) {
            res.status(400).json({ success: false, msg: err.errors.flavor.message });
            return;
          }
          if (err.errors.kind) {
            res.status(400).json({ success: false, msg: err.errors.kind.message });
            return;
          }
          // Show failed if all else fails for some reasons
          res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
        }
      });
  }
});

// UPDATE
router.put('/:id', (req, res) => {

  console.log(`req.body.toppind_ids:${req.body.topping_ids}`);

  let updatedElement = {
    id: req.body.id,
    flavor: sanitizeName(req.body.flavor),
    kind: sanitizeName(req.body.kind),
    toppings: req.body.toppings,
  };

  Flavor.findOneAndUpdate({ id: req.params.id }, updatedElement)
    .then((oldResult) => {
      Flavor.findOne({ id: req.params.id })
        .then((newResult) => {
          res.json({
            data: {
              _id: newResult._id,
              id: newResult.id,
              flavor: newResult.flavor,
              kind: newResult.kind,
              toppings: newResult.toppings
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
  Flavor.findOneAndRemove({ id: req.params.id })
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
