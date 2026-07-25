import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Seed admin on first call if no users exist
const ensureAdmin = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    });
    console.log('✅ Default admin created');
  }
};

export const login = async (req, res) => {
  try {
    await ensureAdmin();
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);
    res.json({
      token,
      admin: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verify = async (req, res) => {
  res.json({ admin: { id: req.admin._id, name: req.admin.name, email: req.admin.email } });
};
