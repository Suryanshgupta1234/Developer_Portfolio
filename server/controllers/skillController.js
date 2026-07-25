import Skill from '../models/Skill.js';

export const getSkills = async (req, res) => {
  try { res.json(await Skill.find().sort({ category: 1, order: 1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
export const createSkill = async (req, res) => {
  try { res.status(201).json(await Skill.create(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
export const updateSkill = async (req, res) => {
  try {
    const s = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!s) return res.status(404).json({ message: 'Not found' });
    res.json(s);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
export const deleteSkill = async (req, res) => {
  try { await Skill.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
