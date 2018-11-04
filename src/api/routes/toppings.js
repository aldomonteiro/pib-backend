import express from "express";
import authenticate from '../controllers/authenticate';
import { topping_get_all, topping_get_one, topping_create, topping_delete, topping_update } from '../controllers/toppingsController';

const router = express.Router();

router.use(authenticate);

// List all toppings
router.get("/", topping_get_all);
// List one topping
router.get("/:id", topping_get_one);
// Create a new topping
router.post('/', topping_create);
// DELETE
router.delete('/:id', topping_delete);
// UPDATE
router.put('/:id', topping_update);


export default router;