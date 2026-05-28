import express from 'express';
import { signup, signin, getMe, googleSignin } from '../controllers/authController.js';
import { authenticateToken } from '../controllers/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', googleSignin);
router.get('/me', authenticateToken, getMe);

export default router;

