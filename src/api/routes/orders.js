import express from "express";
import authenticate from '../controllers/authenticate';
import { order_get_all, order_get_one } from '../controllers/ordersController';

const router = express.Router();

router.use(authenticate); // CHECK TOKEN
router.get("/", order_get_all); // GET_ALL
router.get("/:id", order_get_one); // GET_ONE

export default router;
