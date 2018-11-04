import express from "express";
import authenticate from '../controllers/authenticate';
import { beverage_get_all, beverage_get_one, beverage_create, beverage_update, beverage_delete } from '../controllers/beveragesController';

const router = express.Router();

router.use(authenticate); // CHECK TOKEN
router.get("/", beverage_get_all); // GET_ALL
router.get("/:id", beverage_get_one); // GET_ONE
router.post('/', beverage_create); // CREATE
router.put('/:id', beverage_update); // UPDATE
router.delete('/:id', beverage_delete); // DELETE

export default router;
