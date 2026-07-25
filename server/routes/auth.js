import express from 'express';
import { login, verify } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.post('/login', login);
router.get('/verify', protect, verify);
export default router;
