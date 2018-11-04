import express from "express";
import authenticate from '../controllers/authenticate';
import { size_get_all, size_get_one, size_create, size_delete, size_update } from '../controllers/sizesController';

const router = express.Router();

router.use(authenticate);

router.get("/", size_get_all); // List all sizes
router.get("/:id", size_get_one); // List one size
router.post('/', size_create); // Create a new size
router.delete('/:id', size_delete); // DELETE
router.put('/:id', size_update); // DELETE

export default router;