import express from 'express';
import {
  createConsignment,
  trackConsignment,
  streamLabel,
  cancelConsignment
} from '../controllers/consignmentController.js';
import { authenticateAdmin } from '../controllers/authMiddleware.js';

const router = express.Router();

// Admin secured routes
router.post('/create', authenticateAdmin, createConsignment);
router.post('/cancel/:orderId', authenticateAdmin, cancelConsignment);
router.get('/label/:referenceNumber', authenticateAdmin, streamLabel);

// Public route - allows customers to track their packages directly
router.get('/track/:referenceNumber', trackConsignment);

export default router;
