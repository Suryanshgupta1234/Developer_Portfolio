import Experience from '../models/Experience.js';
export const getExperience = async (req, res) => {
  try { res.json(await Experience.find().sort({ startDate: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
export const createExperience = async (req, res) => {
  try { res.status(201).json(await Experience.create(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
export const updateExperience = async (req, res) => {
  try {
    const e = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!e) return res.status(404).json({ message: 'Not found' });
    res.json(e);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
export const deleteExperience = async (req, res) => {
  try { await Experience.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
