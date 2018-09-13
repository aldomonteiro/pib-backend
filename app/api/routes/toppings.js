import express from "express";
import Topping from "../models/toppings";
import util from "util";
import stringCapitalizeName from 'string-capitalize-name';

const router = express.Router();

// List all toppings
// TODO: use filters in the query req.query
router.get("/", (req, res) => {
    // not considering the query filters yet
    Topping.find().then(result => {
        res.setHeader('Content-Range', util.format("toppings %d-%d/%d", result.length, 1, result.length));
        res.json(result);
    });

});

router.get("/:id", (req, res) => {
    Topping.findOne({ id: req.params.id }).then(result => {
        res.json(result);
    });
});

// Create a new topping
router.post('/', (req, res) => {
    if (req.body) {
        const newRecord = new Topping({
            id: req.body.id,
            topping: sanitizeName(req.body.topping),
        });

        newRecord.save()
            .then((result) => {
                res.json({
                    data: {
                        id: result.id,
                        topping: result.topping,
                    }
                });
            })
            .catch((err) => {
                if (err.errors) {
                    if (err.errors.topping) {
                        res.status(400).json({ success: false, msg: err.errors.topping.message });
                        return;
                    }
                    // Show failed if all else fails for some reasons
                    res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
                }
            });
    }
});

// DELETE
router.delete('/:id', (req, res) => {
    Topping.findOneAndRemove({ id: req.params.id })
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

// UPDATE
router.put('/:id', (req, res) => {

    let updatedRecord = {
        id: req.body.id,
        topping: sanitizeName(req.body.topping),
    };

    Topping.findOneAndUpdate({ id: req.params.id }, updatedRecord)
        .then((oldResult) => {
            Topping.findOne({ id: req.params.id })
                .then((newResult) => {
                    res.json({
                        data: {
                            id: newResult.id,
                            _id: newResult._id,
                            topping: newResult.topping,
                        }
                    });
                })
                .catch((err) => {
                    res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
                    return;
                });
        })
        .catch((err) => {
            if (err) {
                // Show failed if all else fails for some reasons
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

const sanitizeName = (name) => {
    return stringCapitalizeName(name);
}

export default router;