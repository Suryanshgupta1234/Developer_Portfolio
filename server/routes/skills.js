import express from 'express';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skillController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.get('/', getSkills);
router.post('/', protect, createSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);
export default router;
