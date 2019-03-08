import express from 'express';
import authenticate from '../controllers/authenticate';
import { accounts_get_one, accounts_update } from '../controllers/accountsController';

const router = express.Router();

router.use(authenticate); // CHECK TOKEN
// router.get('/', accounts_get_all); // GET_ALL
router.get('/:id', accounts_get_one); // GET_ONE
// router.post('/', store_create); // CREATE
router.put('/:id', accounts_update); // UPDATE
// router.delete('/:id', accounts_delete); // DELETE

export default router;
