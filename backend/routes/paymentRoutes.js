import express from 'express';
import { initiatePayment, verifyPayment, uropayWebhook } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/initiate-payment', initiatePayment);
router.post('/verify-payment', verifyPayment);
router.post('/payment/webhook', uropayWebhook);

export default router;
