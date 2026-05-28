import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shilajit';

export const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    await seedDatabase();
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

async function seedDatabase() {
  try {
    // 1. Seed default Admin if not present
    const adminEmail = 'admin@shilajit.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = new User({
        name: 'Satpuraa Admin',
        email: adminEmail,
        phone: '9999999999',
        password: hashedPassword,
        role: 'admin',
      });
      await newAdmin.save();
      console.log('🌱 Default Admin seeded successfully: admin@shilajit.com / admin123');
    }

    // 2. Seed default Products if not present
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const defaultProducts = [
        {
          name: 'Starter Pack',
          price: 999,
          oldPrice: 1499,
          grams: '10g jar',
          supply: '15-day supply',
          imageUrl: '/images/product/product_front.png',
          videoUrl: '/Home.mp4',
          features: [
            '10g pure rock resin',
            'COD available',
            '15-day money-back guarantee'
          ],
          featured: false,
          dailyLimit: 50,
          receivedQty: 100,
          soldQty: 0
        },
        {
          name: 'Best Value Pack',
          price: 1999,
          oldPrice: 2999,
          grams: '25g jar',
          supply: '1.5 months supply',
          imageUrl: '/images/product/product_front.png',
          videoUrl: '/Home.mp4',
          features: [
            '25g pure shilajit rock',
            'Free fast home shipping',
            'COD: Pay when it arrives',
            '15-day money-back guarantee'
          ],
          featured: true,
          dailyLimit: 50,
          receivedQty: 100,
          soldQty: 0
        }
      ];
      await Product.insertMany(defaultProducts);
      console.log('🌱 Default Products seeded successfully');
    } else {
      // Ensure existing products have inventory properties
      await Product.updateMany({ dailyLimit: { $exists: false } }, { $set: { dailyLimit: 50 } });
      await Product.updateMany({ receivedQty: { $exists: false } }, { $set: { receivedQty: 100 } });
      await Product.updateMany({ soldQty: { $exists: false } }, { $set: { soldQty: 0 } });
      console.log('🌱 Existing products verified and updated with inventory fields');
    }
  } catch (error) {
    console.error('Database seeding error:', error);
  }
}
