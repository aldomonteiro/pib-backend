import express from 'express';
import { webform_create } from '../controllers/webFormsController';

const router = express.Router();
router.post('/', webform_create); // CREATE

export default router;
