import express from 'express';
import { getTimeline, createTimeline, updateTimeline, deleteTimeline } from '../controllers/timelineController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.get('/', getTimeline);
router.post('/', protect, createTimeline);
router.put('/:id', protect, updateTimeline);
router.delete('/:id', protect, deleteTimeline);
export default router;
