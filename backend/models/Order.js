import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  txnId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone1: { type: String, required: true },
  phone2: { type: String },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  paymentStatus: { type: String, default: 'PENDING' }, // 'PENDING', 'PAID', 'FAILED'
  deliveryStatus: { type: String, default: 'Processing' }, // 'Processing', 'Packing', 'Shipping', 'Out for Delivery', 'Delivered'
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model('Order', orderSchema);
