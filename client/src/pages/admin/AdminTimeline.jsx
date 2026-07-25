import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { timelineAPI } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const EMPTY = { title: '', description: '', year: '', icon: '📌', type: 'education' };
const TYPES = ['personal', 'education', 'coding', 'milestone', 'goal'];

export default function AdminTimeline() {
  const { data, loading, refetch } = useFetch(() => timelineAPI.getAll());
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const items = (data || []).sort((a, b) => (a.year || '').localeCompare(b.year || ''));

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (t) => { setEditing(t._id); setForm(t); setModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) { await timelineAPI.update(editing, form); toast.success('Updated'); }
      else { await timelineAPI.create(form); toast.success('Created'); }
      setModal(false); refetch();
    } catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold text-white">Timeline</h1><p className="text-white/40 text-sm">Your journey milestones</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"><Plus size={16} /> Add Event</button>
      </div>
      <div className="space-y-3">
        {items.map(t => (
          <div key={t._id} className="glass rounded-xl p-4 border border-white/10 flex items-start gap-4">
            <span className="text-xl mt-0.5">{t.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-blue-400">{t.year}</span>
                <span className="text-white font-medium text-sm">{t.title}</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/40 border border-white/10">{t.type}</span>
              </div>
              <p className="text-xs text-white/40 mt-0.5">{t.description}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(t)} className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"><Pencil size={13} /></button>
              <button onClick={async () => { if (!confirm('Delete?')) return; await timelineAPI.delete(t._id); toast.success('Deleted'); refetch(); }}
                className="p-1 rounded hover:bg-red-500/10 text-white/40 hover:text-red-400"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && !loading && <div className="text-center py-12 text-white/30">No timeline events yet.</div>}
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Event' : 'Add Event'} size="sm">
        <div className="space-y-4">
          <F label="Title" value={form.title} set={v => setForm(f => ({ ...f, title: v }))} />
          <div className="grid grid-cols-2 gap-4">
            <F label="Year" value={form.year} set={v => setForm(f => ({ ...f, year: v }))} placeholder="2023" />
            <F label="Icon (emoji)" value={form.icon} set={v => setForm(f => ({ ...f, icon: v }))} placeholder="🎓" />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50">
              {TYPES.map(t => <option key={t} value={t} className="bg-black">{t}</option>)}
            </select>
          </div>
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
function F({ label, value, set, placeholder }) {
  return <div><label className="block text-sm text-white/50 mb-1.5">{label}</label><input value={value || ''} onChange={e => set(e.target.value)} placeholder={placeholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50" /></div>;
}
