import express from 'express';
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from '../controllers/achievementController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.get('/', getAchievements);
router.post('/', protect, createAchievement);
router.put('/:id', protect, updateAchievement);
router.delete('/:id', protect, deleteAchievement);
export default router;
