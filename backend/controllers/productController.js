import { Product } from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, oldPrice, grams, supply, imageUrl, videoUrl, features } = req.body;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, oldPrice, grams, supply, imageUrl, videoUrl, features },
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
