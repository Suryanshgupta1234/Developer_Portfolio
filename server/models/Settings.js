import mongoose from 'mongoose';
const settingsSchema = new mongoose.Schema({
  heroName: String,
  heroTagline: String,
  heroBio: String,
  aboutBio: String,
  siteTitle: String,
  metaDescription: String,
  resumeUrl: String,
  profileImage: String,
  socialLinks: mongoose.Schema.Types.Mixed,
}, { timestamps: true });
export default mongoose.model('Settings', settingsSchema);
