import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { certificatesAPI } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';
import Modal from '../../components/ui/Modal';
import { SkeletonCard } from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { formatDateShort } from '../../utils/formatters';

const EMPTY = { title: '', issuer: '', category: '', credentialUrl: '', date: '' };

export default function AdminCertificates() {
  const { data, loading, refetch } = useFetch(() => certificatesAPI.getAll());
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const certs = data || [];

  const openCreate = () => { setEditing(null); setForm(EMPTY); setFile(null); setModal(true); };
  const openEdit = (c) => { setEditing(c._id); setForm(c); setFile(null); setModal(true); };

  const handleSave = async () => {
    if (!form.title) return toast.error('Title is required');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (file) fd.append('image', file);
      if (editing) { await certificatesAPI.update(editing, fd); toast.success('Updated'); }
      else { await certificatesAPI.create(fd); toast.success('Created'); }
      setModal(false); refetch();
    } catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await certificatesAPI.delete(id); toast.success('Deleted'); refetch(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold text-white">Certificates</h1><p className="text-white/40 text-sm">Manage certifications</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"><Plus size={16} /> Add</button>
      </div>
      {loading ? <SkeletonCard lines={3} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="glass rounded-xl p-4 border border-white/10 hover:border-blue-500/20 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-white text-sm">{c.title}</p>
                  <p className="text-xs text-white/40">{c.issuer} · {formatDateShort(c.date)}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(c)} className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-all"><Pencil size={13} /></button>
                  <button onClick={() => handleDelete(c._id)} className="p-1 rounded hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all"><Trash2 size={13} /></button>
                </div>
              </div>
              {c.category && <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">{c.category}</span>}
            </motion.div>
          ))}
          {certs.length === 0 && <div className="col-span-3 text-center py-12 text-white/30">No certificates yet.</div>}
        </div>
      )}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Certificate' : 'Add Certificate'} size="md">
        <div className="space-y-4">
          {[{ l: 'Title *', k: 'title' }, { l: 'Issuer', k: 'issuer' }, { l: 'Category', k: 'category', p: 'Cloud, Frontend, ML...' }, { l: 'Credential URL', k: 'credentialUrl' }, { l: 'Date', k: 'date', t: 'date' }].map(({ l, k, p, t }) => (
            <div key={k}>
              <label className="block text-sm text-white/50 mb-1.5">{l}</label>
              <input type={t || 'text'} value={form[k] || ''} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={p}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50" />
            </div>
          ))}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Certificate Image</label>
            <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files[0])}
              className="w-full text-white/50 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:bg-white/10 file:text-white file:border-0 file:text-sm cursor-pointer" />
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
