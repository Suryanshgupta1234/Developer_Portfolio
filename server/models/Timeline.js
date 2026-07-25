import mongoose from 'mongoose';
const timelineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  year: String,
  date: Date,
  icon: String,
  type: { type: String, enum: ['personal', 'education', 'coding', 'milestone', 'goal'], default: 'education' },
  order: Number,
}, { timestamps: true });
export default mongoose.model('Timeline', timelineSchema);
