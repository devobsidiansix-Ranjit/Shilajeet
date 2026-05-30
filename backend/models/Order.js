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
  shippingDetails: {
    consignmentReference: { type: String },
    courierPartner: { type: String },
    courierAccount: { type: String },
    courierPartnerReferenceNumber: { type: String },
    consignmentStatus: { type: String },
    isCrossBorder: { type: Boolean, default: false },
    ewayBill: { type: String },
    city: { type: String },
    district: { type: String },
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number }
    },
    events: { type: Array, default: [] }
  },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model('Order', orderSchema);
