import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
const router = express.Router();
router.get('/', getSettings);
router.put('/', protect, upload.single('profileImage'), updateSettings);
export default router;
