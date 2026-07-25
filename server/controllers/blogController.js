import Blog from '../models/Blog.js';

export const getBlogs = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    // Public: only published. Admin: all
    if (!req.admin) filter.published = true;
    if (category && category !== 'All') filter.category = category;
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ $or: [{ slug: req.params.slug }, { _id: req.params.slug.match(/^[a-f\d]{24}$/i) ? req.params.slug : null }] });
    if (!blog) return res.status(404).json({ message: 'Post not found' });
    blog.views = (blog.views || 0) + 1;
    await blog.save();
    res.json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ message: 'Not found' });
    res.json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
