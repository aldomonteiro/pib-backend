import express from 'express';
import authenticate from '../controllers/authenticate';
import { item_get_all } from '../controllers/itemsController';

const router = express.Router();

router.use(authenticate); // CHECK TOKEN
router.get('/', item_get_all); // GET_ALL

export default router;
