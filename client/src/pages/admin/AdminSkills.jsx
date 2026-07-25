import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { skillsAPI } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';
import Modal from '../../components/ui/Modal';
import { SkeletonCard } from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { SKILL_CATEGORIES } from '../../utils/constants';

const EMPTY = { name: '', category: 'Programming', level: 80, icon: '', color: '#2563eb' };

export default function AdminSkills() {
  const { data, loading, refetch } = useFetch(() => skillsAPI.getAll());
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const skills = data || [];

  const grouped = skills.reduce((acc, s) => { if (!acc[s.category]) acc[s.category] = []; acc[s.category].push(s); return acc; }, {});

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (s) => { setEditing(s._id); setForm(s); setModal(true); };

  const handleSave = async () => {
    if (!form.name) return toast.error('Name is required');
    setSaving(true);
    try {
      if (editing) { await skillsAPI.update(editing, form); toast.success('Updated'); }
      else { await skillsAPI.create(form); toast.success('Created'); }
      setModal(false); refetch();
    } catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try { await skillsAPI.delete(id); toast.success('Deleted'); refetch(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold text-white">Skills</h1><p className="text-white/40 text-sm">Manage your skill set</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"><Plus size={16} /> Add Skill</button>
      </div>
      {loading ? <SkeletonCard lines={4} /> : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="mb-8">
            <h3 className="text-sm text-white/40 uppercase tracking-widest mb-3">{cat}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {items.map((s, i) => (
                <motion.div key={s._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="glass rounded-xl p-4 border border-white/10 hover:border-blue-500/20 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{s.icon}</span>
                      <span className="text-sm font-medium text-white">{s.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(s)} className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-all"><Pencil size={12} /></button>
                      <button onClick={() => handleDelete(s._id)} className="p-1 rounded hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.level}%`, background: s.color || '#2563eb' }} />
                  </div>
                  <p className="text-xs text-white/30 mt-1 text-right">{s.level}%</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Skill' : 'Add Skill'} size="sm">
        <div className="space-y-4">
          <F label="Name *" value={form.name} set={v => setForm(f => ({ ...f, name: v }))} />
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50">
              {SKILL_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Level: {form.level}%</label>
            <input type="range" min="0" max="100" value={form.level} onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))}
              className="w-full accent-blue-500" />
          </div>
          <F label="Icon (emoji)" value={form.icon} set={v => setForm(f => ({ ...f, icon: v }))} placeholder="☕" />
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.color || '#2563eb'} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0" />
              <span className="text-white/40 text-sm font-mono">{form.color}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all disabled:opacity-60">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
function F({ label, value, set, placeholder }) {
  return (
    <div>
      <label className="block text-sm text-white/50 mb-1.5">{label}</label>
      <input value={value || ''} onChange={e => set(e.target.value)} placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50" />
    </div>
  );
}
