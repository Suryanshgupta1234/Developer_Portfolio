import mongoose from 'mongoose';
const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  icon: String,
  type: { type: String, default: 'coding' },
  date: Date,
}, { timestamps: true });
export default mongoose.model('Achievement', achievementSchema);
