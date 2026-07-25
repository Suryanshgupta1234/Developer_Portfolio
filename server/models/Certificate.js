import mongoose from 'mongoose';
const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: String,
  category: String,
  date: Date,
  image: String,
  fileUrl: String,
  credentialUrl: String,
}, { timestamps: true });
export default mongoose.model('Certificate', certificateSchema);
