import express from 'express';
import { getSocial, updateSocial } from '../controllers/socialController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.get('/', getSocial);
router.put('/', protect, updateSocial);
export default router;
