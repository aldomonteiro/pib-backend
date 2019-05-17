import express from 'express';
import authenticate from '../controllers/authenticate';
import { order_get_all, order_get_one, order_update, order_delete } from '../controllers/simpleOrdersController';

const router = express.Router();

router.use(authenticate); // CHECK TOKEN
router.get('/', order_get_all); // GET_ALL
router.get('/:id', order_get_one); // GET_ONE
router.put('/:id', order_update); // UPDATE
router.delete('/:id', order_delete); // DELETE

export default router;
