import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  grams: { type: String },
  supply: { type: String },
  imageUrl: { type: String, default: '/images/product/product_front.png' },
  videoUrl: { type: String, default: '/Home.mp4' },
  features: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  dailyLimit: { type: Number, default: 50 },
  receivedQty: { type: Number, default: 100 },
  soldQty: { type: Number, default: 0 }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.virtual('stockLeft').get(function() {
  return Math.max(0, this.receivedQty - this.soldQty);
});

export const Product = mongoose.model('Product', productSchema);
