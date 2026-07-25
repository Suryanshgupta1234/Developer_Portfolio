import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { blogsAPI } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';
import Modal from '../../components/ui/Modal';
import { SkeletonCard } from '../../components/ui/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import { BLOG_CATEGORIES } from '../../utils/constants';
import { formatDateShort } from '../../utils/formatters';

const EMPTY = { title: '', slug: '', excerpt: '', content: '', category: 'React', tags: '', readTime: '5', published: false };

export default function AdminBlog() {
  const { data, loading, refetch } = useFetch(() => blogsAPI.getAll());
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const posts = data || [];

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p) => { setEditing(p._id); setForm({ ...p, tags: p.tags?.join(', ') || '' }); setModal(true); };

  const handleSave = async () => {
    if (!form.title) return toast.error('Title is required');
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-') };
      if (editing) { await blogsAPI.update(editing, payload); toast.success('Post updated'); }
      else { await blogsAPI.create(payload); toast.success('Post created'); }
      setModal(false); refetch();
    } catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try { await blogsAPI.delete(id); toast.success('Deleted'); refetch(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold text-white">Blog</h1><p className="text-white/40 text-sm">Manage your blog posts</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"><Plus size={16} /> New Post</button>
      </div>
      {loading ? <div className="space-y-3">{[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={2} />)}</div> : (
        <div className="space-y-3">
          {posts.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="glass rounded-xl p-4 border border-white/10 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-white truncate">{p.title}</span>
                  <Badge variant={p.published ? 'green' : 'gray'}>{p.published ? 'Published' : 'Draft'}</Badge>
                  {p.category && <Badge variant="default">{p.category}</Badge>}
                </div>
                <p className="text-xs text-white/30">{formatDateShort(p.createdAt)} · {p.readTime || 5} min read</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
          {posts.length === 0 && <div className="text-center py-16 text-white/30">No blog posts yet.</div>}
        </div>
      )}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Post' : 'New Post'} size="xl">
        <div className="space-y-4">
          <F label="Title *" value={form.title} set={v => setForm(f => ({ ...f, title: v }))} />
          <F label="Slug (auto-generated if empty)" value={form.slug} set={v => setForm(f => ({ ...f, slug: v }))} />
          <F label="Excerpt" value={form.excerpt} set={v => setForm(f => ({ ...f, excerpt: v }))} textarea />
          <F label="Content (Markdown supported)" value={form.content} set={v => setForm(f => ({ ...f, content: v }))} textarea rows={10} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50">
                {BLOG_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
              </select>
            </div>
            <F label="Read Time (min)" value={form.readTime} set={v => setForm(f => ({ ...f, readTime: v }))} type="number" />
          </div>
          <F label="Tags (comma separated)" value={form.tags} set={v => setForm(f => ({ ...f, tags: v }))} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 rounded accent-blue-500" />
            <span className="text-sm text-white/60">Publish immediately</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all disabled:opacity-60">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function F({ label, value, set, textarea, rows = 3, type = 'text', placeholder }) {
  return (
    <div>
      <label className="block text-sm text-white/50 mb-1.5">{label}</label>
      {textarea
        ? <textarea value={value || ''} onChange={e => set(e.target.value)} rows={rows} placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 resize-none" />
        : <input type={type} value={value || ''} onChange={e => set(e.target.value)} placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50" />}
    </div>
  );
}
