import mongoose from 'mongoose';
const socialLinkSchema = new mongoose.Schema({
  github: String, linkedin: String, twitter: String,
  email: String, phone: String, location: String,
  leetcode: String, gfg: String, instagram: String,
}, { timestamps: true });
export default mongoose.model('SocialLink', socialLinkSchema);
