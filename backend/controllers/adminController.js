import { Order } from '../models/Order.js';
import { User } from '../models/User.js';

export const getStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ paymentStatus: 'PAID' });
    const totalUsers = await User.countDocuments();
    
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.price, 0);
    
    const distribution = {};
    paidOrders.forEach(order => {
      distribution[order.productName] = (distribution[order.productName] || 0) + 1;
    });
    
    res.json({
      success: true,
      stats: {
        totalOrders,
        paidOrdersCount: paidOrders.length,
        totalRevenue,
        totalUsers,
        distribution
      }
    });
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch admin orders error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { deliveryStatus, paymentStatus } = req.body;
    
    const updateFields = {};
    if (deliveryStatus !== undefined) updateFields.deliveryStatus = deliveryStatus;
    if (paymentStatus !== undefined) updateFields.paymentStatus = paymentStatus;
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
