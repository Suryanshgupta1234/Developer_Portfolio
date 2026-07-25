import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { experienceAPI } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { formatDateShort } from '../../utils/formatters';

const EMPTY = { title: '', company: '', location: '', type: 'Internship', startDate: '', endDate: '', current: false, description: '', skills: '' };

export default function AdminExperience() {
  const { data, loading, refetch } = useFetch(() => experienceAPI.getAll());
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const items = data || [];

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (e) => { setEditing(e._id); setForm({ ...e, skills: e.skills?.join(', ') || '' }); setModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
      if (editing) { await experienceAPI.update(editing, payload); toast.success('Updated'); }
      else { await experienceAPI.create(payload); toast.success('Created'); }
      setModal(false); refetch();
    } catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold text-white">Experience</h1></div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"><Plus size={16} /> Add</button>
      </div>
      <div className="space-y-3">
        {items.map(e => (
          <div key={e._id} className="glass rounded-xl p-4 border border-white/10 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-medium text-white text-sm">{e.title}</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">{e.type}</span>
                {e.current && <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">Current</span>}
              </div>
              <p className="text-xs text-white/40">{e.company} · {formatDateShort(e.startDate)} — {e.current ? 'Present' : formatDateShort(e.endDate)}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(e)} className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"><Pencil size={13} /></button>
              <button onClick={async () => { if (!confirm('Delete?')) return; await experienceAPI.delete(e._id); toast.success('Deleted'); refetch(); }}
                className="p-1 rounded hover:bg-red-500/10 text-white/40 hover:text-red-400"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && !loading && <div className="text-center py-12 text-white/30">No experience yet.</div>}
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Experience' : 'Add Experience'} size="md">
        <div className="space-y-4">
          {[{ l: 'Job Title *', k: 'title' }, { l: 'Company', k: 'company' }, { l: 'Location', k: 'location' }].map(({ l, k }) => (
            <div key={k}><label className="block text-sm text-white/50 mb-1.5">{l}</label>
              <input value={form[k] || ''} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50" /></div>
          ))}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50">
              {['Internship', 'Freelance', 'Open Source', 'Hackathon', 'Volunteer', 'Full-time'].map(t => <option key={t} value={t} className="bg-black">{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-white/50 mb-1.5">Start Date</label><input type="date" value={form.startDate?.split('T')[0] || ''} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50" /></div>
            <div><label className="block text-sm text-white/50 mb-1.5">End Date</label><input type="date" value={form.endDate?.split('T')[0] || ''} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} disabled={form.current} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 disabled:opacity-40" /></div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.checked }))} className="w-4 h-4 accent-blue-500" /><span className="text-sm text-white/60">Currently working here</span></label>
          <div><label className="block text-sm text-white/50 mb-1.5">Description</label><textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 resize-none" /></div>
          <div><label className="block text-sm text-white/50 mb-1.5">Skills (comma separated)</label><input value={form.skills || ''} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} placeholder="React, Node.js" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50" /></div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
