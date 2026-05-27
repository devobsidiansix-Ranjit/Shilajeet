import express from 'express';
import { getStats, getOrders, updateOrderStatus } from '../controllers/adminController.js';
import { authenticateAdmin } from '../controllers/authMiddleware.js';

const router = express.Router();

router.get('/stats', authenticateAdmin, getStats);
router.get('/orders', authenticateAdmin, getOrders);
router.put('/orders/:id/status', authenticateAdmin, updateOrderStatus);

export default router;
