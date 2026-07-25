import mongoose from 'mongoose';
const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: String,
  location: String,
  type: { type: String, default: 'Internship' },
  startDate: Date,
  endDate: Date,
  current: { type: Boolean, default: false },
  description: String,
  skills: [String],
  companyUrl: String,
}, { timestamps: true });
export default mongoose.model('Experience', experienceSchema);
