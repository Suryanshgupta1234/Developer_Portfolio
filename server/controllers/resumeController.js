import Settings from '../models/Settings.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const getResume = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings?.resumeUrl) return res.status(404).json({ message: 'No resume uploaded' });
    res.json({ url: settings.resumeUrl });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });
    let resumeUrl;
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'portfolio/resume',
        resource_type: 'raw',
      });
      resumeUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    } catch {
      resumeUrl = `${process.env.CLIENT_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
    }
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({ resumeUrl });
    else await Settings.findByIdAndUpdate(settings._id, { resumeUrl });
    res.json({ url: resumeUrl });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
