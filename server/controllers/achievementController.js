import Achievement from '../models/Achievement.js';
export const getAchievements = async (req, res) => {
  try { res.json(await Achievement.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
export const createAchievement = async (req, res) => {
  try { res.status(201).json(await Achievement.create(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
export const updateAchievement = async (req, res) => {
  try {
    const a = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!a) return res.status(404).json({ message: 'Not found' });
    res.json(a);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
export const deleteAchievement = async (req, res) => {
  try { await Achievement.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
