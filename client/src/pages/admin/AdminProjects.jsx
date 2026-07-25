import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Github, ExternalLink, Star } from 'lucide-react';
import { projectsAPI } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';
import Modal from '../../components/ui/Modal';
import { SkeletonCard } from '../../components/ui/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import { formatDateShort } from '../../utils/formatters';

const EMPTY = { title: '', description: '', category: 'Full Stack', techStack: '', githubUrl: '', liveUrl: '', featured: false, problemStatement: '', solution: '', challenges: '', futureImprovements: '', features: '' };

export default function AdminProjects() {
  const { data, loading, refetch } = useFetch(() => projectsAPI.getAll());
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const projects = data || [];

  const openCreate = () => { setEditing(null); setForm(EMPTY); setImageFile(null); setModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, techStack: p.techStack?.join(', ') || '', features: p.features?.join('\n') || '' });
    setImageFile(null);
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.title) return toast.error('Title is required');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
      if (imageFile) fd.append('image', imageFile);
      if (editing) { await projectsAPI.update(editing, fd); toast.success('Project updated'); }
      else { await projectsAPI.create(fd); toast.success('Project created'); }
      setModal(false); refetch();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await projectsAPI.delete(id); toast.success('Deleted'); refetch(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold text-white">Projects</h1><p className="text-white/40 text-sm">Manage your portfolio projects</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {loading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <SkeletonCard key={i} lines={3} />)}</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-5 border border-white/10 hover:border-blue-500/20 transition-all">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{p.title}</h3>
                    {p.featured && <Star size={13} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                  </div>
                  <p className="text-white/40 text-xs truncate">{p.description}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <Badge variant="default">{p.category}</Badge>
                {p.techStack?.slice(0, 3).map(t => <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 text-white/40 text-xs">{t}</span>)}
              </div>
              <div className="flex items-center gap-3 text-xs text-white/30">
                {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors"><Github size={12} /> Code</a>}
                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors"><ExternalLink size={12} /> Live</a>}
                <span className="ml-auto">{formatDateShort(p.createdAt)}</span>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-2 text-center py-16 text-white/30"><p>No projects yet. Add your first one!</p></div>
          )}
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Project' : 'Add Project'} size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title *" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50">
                {['Full Stack', 'Frontend', 'Backend', 'Java', 'React', 'Node', 'MongoDB', 'Machine Learning'].map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
              </select>
            </div>
          </div>
          <Field label="Description" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} textarea />
          <Field label="Tech Stack (comma separated)" value={form.techStack} onChange={v => setForm(f => ({ ...f, techStack: v }))} placeholder="React, Node.js, MongoDB" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="GitHub URL" value={form.githubUrl} onChange={v => setForm(f => ({ ...f, githubUrl: v }))} />
            <Field label="Live Demo URL" value={form.liveUrl} onChange={v => setForm(f => ({ ...f, liveUrl: v }))} />
          </div>
          <Field label="Problem Statement" value={form.problemStatement} onChange={v => setForm(f => ({ ...f, problemStatement: v }))} textarea />
          <Field label="Solution" value={form.solution} onChange={v => setForm(f => ({ ...f, solution: v }))} textarea />
          <Field label="Features (one per line)" value={form.features} onChange={v => setForm(f => ({ ...f, features: v }))} textarea />
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Project Image</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
              className="w-full text-white/50 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:bg-white/10 file:text-white file:border-0 file:text-sm cursor-pointer" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 rounded accent-blue-500" />
            <span className="text-sm text-white/60">Mark as Featured</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, textarea }) {
  return (
    <div>
      <label className="block text-sm text-white/50 mb-1.5">{label}</label>
      {textarea ? (
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 resize-none" />
      ) : (
        <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50" />
      )}
    </div>
  );
}
