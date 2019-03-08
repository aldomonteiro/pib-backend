import express from 'express';
import authenticate from '../controllers/authenticate';
import {
    category_get_all, category_get_one, category_create,
    category_update, category_delete,
} from '../controllers/categoriesController';

const router = express.Router();

router.use(authenticate); // CHECK TOKEN
router.get('/', category_get_all); // GET_ALL
router.get('/:id', category_get_one); // GET_ONE
router.post('/', category_create); // CREATE
router.put('/:id', category_update); // UPDATE
router.delete('/:id', category_delete); // DELETE

export default router;
