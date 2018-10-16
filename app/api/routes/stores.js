import express from "express";
import authenticate from '../controllers/authenticate';
import { store_get_all, store_get_one, store_create, store_update, store_delete } from '../controllers/storesController';

const router = express.Router();

router.use(authenticate); // CHECK TOKEN
router.get("/", store_get_all); // GET_ALL
router.get("/:id", store_get_one); // GET_ONE
router.post('/', store_create); // CREATE
router.put('/:id', store_update); // UPDATE
router.delete('/:id', store_delete); // DELETE

export default router;
