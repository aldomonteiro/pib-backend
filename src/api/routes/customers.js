import express from "express";
import authenticate from '../controllers/authenticate';
import { customer_get_all, customer_get_one } from '../controllers/customersController';

const router = express.Router();

router.use(authenticate); // CHECK TOKEN
router.get("/", customer_get_all); // GET_ALL
router.get("/:id", customer_get_one); // GET_ONE

export default router;
