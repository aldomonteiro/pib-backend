import express from "express";
import authenticate from '../controllers/authenticate';
import { pricing_get_all, pricing_get_one, pricing_create, pricing_update, pricing_delete } from '../controllers/pricingsController';

const router = express.Router();

router.use(authenticate); // CHECK TOKEN
router.get("/", pricing_get_all); // GET_ALL
router.get("/:id", pricing_get_one); // GET_ONE
router.post('/', pricing_create); // CREATE
router.put('/:id', pricing_update); // UPDATE
router.delete('/:id', pricing_delete); // DELETE

export default router;
