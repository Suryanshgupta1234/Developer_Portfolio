import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  excerpt: String,
  content: { type: String, required: true },
  coverImage: String,
  category: String,
  tags: [String],
  readTime: { type: Number, default: 5 },
  published: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, { timestamps: true });

blogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Blog', blogSchema);
