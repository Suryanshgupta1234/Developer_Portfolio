import mongoose from 'mongoose';
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: Number, min: 0, max: 100, default: 80 },
  icon: String,
  color: String,
  order: { type: Number, default: 0 },
}, { timestamps: true });
export default mongoose.model('Skill', skillSchema);
