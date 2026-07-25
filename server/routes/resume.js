import express from 'express';
import { getResume, uploadResume, setResumeUrl } from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
const router = express.Router();
router.get('/', getResume);
router.post('/', protect, upload.single('resume'), uploadResume);
router.post('/url', protect, setResumeUrl);
export default router;
