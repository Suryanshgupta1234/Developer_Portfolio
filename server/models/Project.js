import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: String,
  techStack: [String],
  category: { type: String, default: 'Full Stack' },
  githubUrl: String,
  liveUrl: String,
  featured: { type: Boolean, default: false },
  problemStatement: String,
  solution: String,
  challenges: String,
  futureImprovements: String,
  features: [String],
  images: [String],
  slug: String,
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
