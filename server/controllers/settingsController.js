import Settings from '../models/Settings.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateSettings = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'portfolio/profile' });
        data.profileImage = result.secure_url;
        fs.unlinkSync(req.file.path);
      } catch {
        data.profileImage = `/uploads/${req.file.filename}`;
      }
    }
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create(data);
    else settings = await Settings.findByIdAndUpdate(settings._id, data, { new: true });
    res.json(settings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
