import Certificate from '../models/Certificate.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const uploadFile = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder: 'portfolio/certificates' });
    fs.unlinkSync(filePath);
    return result.secure_url;
  } catch {
    return `/uploads/${filePath.split(/[\\/]/).pop()}`;
  }
};

export const getCertificates = async (req, res) => {
  try { res.json(await Certificate.find().sort({ date: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
export const createCertificate = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = await uploadFile(req.file.path);
    res.status(201).json(await Certificate.create(data));
  } catch (err) { res.status(500).json({ message: err.message }); }
};
export const updateCertificate = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = await uploadFile(req.file.path);
    const c = await Certificate.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json(c);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
export const deleteCertificate = async (req, res) => {
  try { await Certificate.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
