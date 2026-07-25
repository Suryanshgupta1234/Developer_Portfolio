import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { achievementsAPI } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const EMPTY = { title: '', description: '', icon: '🏆', type: 'coding' };

export default function AdminAchievements() {
  const { data, loading, refetch } = useFetch(() => achievementsAPI.getAll());
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const items = data || [];

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (a) => { setEditing(a._id); setForm(a); setModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) { await achievementsAPI.update(editing, form); toast.success('Updated'); }
      else { await achievementsAPI.create(form); toast.success('Created'); }
      setModal(false); refetch();
    } catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold text-white">Achievements</h1><p className="text-white/40 text-sm">Milestones and awards</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"><Plus size={16} /> Add</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((a, i) => (
          <div key={a._id} className="glass rounded-xl p-4 border border-white/10 flex items-start gap-3">
            <span className="text-2xl">{a.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm">{a.title}</p>
              <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{a.description}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(a)} className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-all"><Pencil size={13} /></button>
              <button onClick={async () => { if (!confirm('Delete?')) return; await achievementsAPI.delete(a._id); toast.success('Deleted'); refetch(); }}
                className="p-1 rounded hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && !loading && <div className="col-span-3 text-center py-12 text-white/30">No achievements yet.</div>}
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Achievement' : 'Add Achievement'} size="sm">
        <div className="space-y-4">
          {[{ l: 'Title', k: 'title' }, { l: 'Icon (emoji)', k: 'icon', p: '🏆' }, { l: 'Type', k: 'type', p: 'coding, competition...' }].map(({ l, k, p }) => (
            <div key={k}>
              <label className="block text-sm text-white/50 mb-1.5">{l}</label>
              <input value={form[k] || ''} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={p}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50" />
            </div>
          ))}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Description</label>
            <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
