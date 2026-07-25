import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  totalVisitors: { type: Number, default: 0 },
  pageViews: { type: Number, default: 0 },
  lastVisit: Date,
}, { timestamps: true });

export default mongoose.model('Analytics', analyticsSchema);
