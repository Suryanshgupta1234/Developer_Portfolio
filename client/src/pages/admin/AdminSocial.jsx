import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { socialAPI } from '../../services/api';
import toast from 'react-hot-toast';

const FIELDS = [
  { key: 'github', label: 'GitHub URL', placeholder: 'https://github.com/username' },
  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username' },
  { key: 'twitter', label: 'Twitter URL', placeholder: 'https://twitter.com/username' },
  { key: 'email', label: 'Email', placeholder: 'hello@example.com' },
  { key: 'phone', label: 'Phone', placeholder: '+91 00000 00000' },
  { key: 'location', label: 'Location', placeholder: 'India' },
  { key: 'leetcode', label: 'LeetCode URL', placeholder: 'https://leetcode.com/username' },
  { key: 'gfg', label: 'GeeksforGeeks URL', placeholder: 'https://geeksforgeeks.org/user/...' },
  { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/username' },
];

export default function AdminSocial() {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socialAPI.getAll().then(r => setForm(r.data || {})).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try { await socialAPI.update(form); toast.success('Social links updated!'); }
    catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold text-white">Social Links</h1><p className="text-white/40 text-sm">Manage your social media & contact links</p></div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 border border-white/10 max-w-2xl">
        {loading ? <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-12 skeleton rounded-xl" />)}</div> : (
          <div className="space-y-4">
            {FIELDS.map(f => (
              <div key={f.key}>
                <label className="block text-sm text-white/50 mb-1.5">{f.label}</label>
                <input value={form[f.key] || ''} onChange={e => setForm(s => ({ ...s, [f.key]: e.target.value }))} placeholder={f.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50" />
              </div>
            ))}
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all disabled:opacity-60 mt-2">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
