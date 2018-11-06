import express from "express";
import authenticate from '../controllers/authenticate';
import {
    openingtimes_get_all,
    openingtimes_get_one, openingtimes_create,
    openingtimes_update, openingtimes_delete
} from '../controllers/openingTimesController';

const router = express.Router();

router.use(authenticate); // CHECK TOKEN
router.get("/", openingtimes_get_all); // GET_ALL
router.get("/:id", openingtimes_get_one); // GET_ONE
router.post('/', openingtimes_create); // CREATE
router.put('/:id', openingtimes_update); // UPDATE
router.delete('/:id', openingtimes_delete); // DELETE

export default router;
