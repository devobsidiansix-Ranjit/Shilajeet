import express from 'express';
import { getMyOrders, getGuestOrders } from '../controllers/orderController.js';
import { authenticateToken } from '../controllers/authMiddleware.js';

const router = express.Router();

router.get('/my-orders', authenticateToken, getMyOrders);
router.post('/guest-orders', getGuestOrders);

export default router;
