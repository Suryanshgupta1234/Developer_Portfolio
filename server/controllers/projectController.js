import Project from '../models/Project.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder: 'portfolio/projects' });
    fs.unlinkSync(filePath);
    return result.secure_url;
  } catch {
    // Return local path if Cloudinary not configured
    return `/uploads/${filePath.split('/').pop()}`;
  }
};

export const getProjects = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (featured === 'true') filter.featured = true;
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getFeatured = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createProject = async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.techStack === 'string') data.techStack = data.techStack.split(',').map(t => t.trim()).filter(Boolean);
    if (typeof data.features === 'string') data.features = data.features.split('\n').map(f => f.trim()).filter(Boolean);
    if (req.file) data.image = await uploadImage(req.file.path);
    const project = await Project.create(data);
    res.status(201).json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateProject = async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.techStack === 'string') data.techStack = data.techStack.split(',').map(t => t.trim()).filter(Boolean);
    if (typeof data.features === 'string') data.features = data.features.split('\n').map(f => f.trim()).filter(Boolean);
    if (req.file) data.image = await uploadImage(req.file.path);
    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
