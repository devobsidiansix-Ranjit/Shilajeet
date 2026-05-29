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
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

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
          soldQty: 0,
          monthlyInventory: monthNames.map((name, idx) => ({
            monthIndex: idx,
            monthName: name,
            available: 100,
            bookings: 0,
            price: 999
          }))
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
          soldQty: 0,
          monthlyInventory: monthNames.map((name, idx) => ({
            monthIndex: idx,
            monthName: name,
            available: 100,
            bookings: 0,
            price: 1999
          }))
        }
      ];
      await Product.insertMany(defaultProducts);
      console.log('🌱 Default Products seeded successfully with 12-month calendar');
    } else {
      // Ensure existing products have inventory properties and a 12-month calendar
      const existingProducts = await Product.find();
      for (const p of existingProducts) {
        let needsUpdate = false;
        let updateObj = {};
        
        if (p.dailyLimit === undefined) { updateObj.dailyLimit = 50; needsUpdate = true; }
        if (p.receivedQty === undefined) { updateObj.receivedQty = 100; needsUpdate = true; }
        if (p.soldQty === undefined) { updateObj.soldQty = 0; needsUpdate = true; }
        
        if (!p.monthlyInventory || p.monthlyInventory.length !== 12) {
          const defaultPrice = p.price || (p.name.includes('Starter') ? 999 : 1999);
          updateObj.monthlyInventory = monthNames.map((name, idx) => ({
            monthIndex: idx,
            monthName: name,
            available: 100,
            bookings: 0,
            price: defaultPrice
          }));
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          await Product.findByIdAndUpdate(p._id, { $set: updateObj });
        }
      }
      console.log('🌱 Existing products verified and updated with inventory fields');
    }
  } catch (error) {
    console.error('Database seeding error:', error);
  }
}
