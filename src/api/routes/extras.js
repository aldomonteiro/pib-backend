import express from "express";
import authenticate from '../controllers/authenticate';
import { extra_get_all, extra_get_one, extra_create, extra_update, extra_delete } from '../controllers/extrasController';

const router = express.Router();

router.use(authenticate); // CHECK TOKEN
router.get("/", extra_get_all); // GET_ALL
router.get("/:id", extra_get_one); // GET_ONE
router.post('/', extra_create); // CREATE
router.put('/:id', extra_update); // UPDATE
router.delete('/:id', extra_delete); // DELETE

export default router;
