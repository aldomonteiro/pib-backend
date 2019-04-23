import express from 'express';
import authenticate from '../controllers/authenticate';
import {
    text_order_get_all,
    text_order_get_one,
    text_order_update,
} from '../controllers/textOrdersController';

const router = express.Router();

router.use(authenticate); // CHECK TOKEN
router.get('/', text_order_get_all); // GET_ALL
router.get('/:id', text_order_get_one); // GET_ONE
router.put('/:id', text_order_update); // UPDATE

export default router;
