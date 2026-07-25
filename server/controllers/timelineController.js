import Timeline from '../models/Timeline.js';
export const getTimeline = async (req, res) => {
  try { res.json(await Timeline.find().sort({ year: 1, order: 1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
export const createTimeline = async (req, res) => {
  try { res.status(201).json(await Timeline.create(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
export const updateTimeline = async (req, res) => {
  try {
    const t = await Timeline.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json(t);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
export const deleteTimeline = async (req, res) => {
  try { await Timeline.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
