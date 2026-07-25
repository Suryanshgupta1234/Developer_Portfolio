import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📁 MongoDB Connected');

    // Delete all existing admin users
    await User.deleteMany({});
    console.log('🗑️  Removed old admin users');

    // Create new admin with credentials from .env
    const admin = await User.create({
      name: 'Suryansh Gupta',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

    console.log('✅ New admin created successfully!');
    console.log('📧 Email: ****@****');
    console.log('🔐 Password: (hidden for security)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updateAdmin();
