import { Order } from '../models/Order.js';

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch user orders error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getGuestOrders = async (req, res) => {
  try {
    const { txnIds } = req.body;
    if (!txnIds || !Array.isArray(txnIds)) {
      return res.status(400).json({ success: false, error: 'Transaction IDs array is required' });
    }
    const orders = await Order.find({
      $or: [
        { txnId: { $in: txnIds } },
        { uroPayOrderId: { $in: txnIds } }
      ]
    }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch guest orders error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
