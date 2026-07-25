import express from 'express';
import { getResume, uploadResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
const router = express.Router();
router.get('/', getResume);
router.post('/', protect, upload.single('resume'), uploadResume);
export default router;
