import express from "express";
import authenticate from '../controllers/authenticate';
import {
    users_auth, users_code,
    users_create, users_get_all, users_get_one,
    users_update, users_delete
} from '../controllers/usersController';

const router = express.Router();

router.post('/auth', users_auth);
router.post('/code', users_code);
router.use(authenticate); // CHECK TOKEN
router.post('/create', users_create);
router.get("/", users_get_all);
router.get("/:id", users_get_one);
router.put('/:id', users_update);
router.delete('/:id', users_delete);

export default router;
