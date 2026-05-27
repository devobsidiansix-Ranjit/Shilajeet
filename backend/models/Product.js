import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  grams: { type: String },
  supply: { type: String },
  imageUrl: { type: String, default: '/shilajit_jar_mockup.png' },
  videoUrl: { type: String, default: '/Home.mp4' },
  features: { type: [String], default: [] },
  featured: { type: Boolean, default: false }
});

export const Product = mongoose.model('Product', productSchema);
