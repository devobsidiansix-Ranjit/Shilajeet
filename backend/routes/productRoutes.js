import express from 'express';
import { getProducts, updateProduct } from '../controllers/productController.js';
import { authenticateAdmin } from '../controllers/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.put('/:id', authenticateAdmin, updateProduct);

export default router;
