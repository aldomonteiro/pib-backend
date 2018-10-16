import express from "express";
import authenticate from '../controllers/authenticate';
import { flavor_get_all, flavor_get_one, flavor_create, flavor_update, flavor_delete } from '../controllers/flavorsController';

const router = express.Router();

router.use(authenticate); // CHECK TOKEN
router.get("/", flavor_get_all); // GET_ALL
router.get("/:id", flavor_get_one); // GET_ONE
router.post('/', flavor_create); // CREATE
router.put('/:id', flavor_update); // UPDATE
router.delete('/:id', flavor_delete); // DELETE

export default router;
