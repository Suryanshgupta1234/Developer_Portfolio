import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { settingsAPI } from '../../services/api';
import { usePortfolio } from '../../context/PortfolioContext';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { refreshSettings } = usePortfolio();
  const [form, setForm] = useState({ heroName: '', heroTagline: '', heroBio: '', aboutBio: '', siteTitle: '', metaDescription: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsAPI.get().then(r => setForm(r.data || {})).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      await settingsAPI.update(fd);
      await refreshSettings();
      toast.success('Settings saved!');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const F = ({ label, k, textarea, placeholder }) => (
    <div>
      <label className="block text-sm text-white/50 mb-1.5">{label}</label>
      {textarea ? (
        <textarea value={form[k] || ''} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} rows={3} placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 resize-none placeholder-white/20" />
      ) : (
        <input value={form[k] || ''} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 placeholder-white/20" />
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6"><h1 className="text-xl font-bold text-white">Site Settings</h1><p className="text-white/40 text-sm">Configure your portfolio content</p></div>
      {loading ? <div className="space-y-4 max-w-2xl">{[...Array(4)].map((_, i) => <div key={i} className="h-12 skeleton rounded-xl" />)}</div> : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 border border-white/10 max-w-2xl space-y-5">
          <h3 className="font-semibold text-white/70 text-sm uppercase tracking-widest">Hero Section</h3>
          <F label="Your Name" k="heroName" placeholder="John Doe" />
          <F label="Hero Tagline" k="heroTagline" placeholder="Developer." />
          <F label="Hero Bio (short intro)" k="heroBio" textarea placeholder="Crafting scalable full-stack applications..." />
          <hr className="border-white/10" />
          <h3 className="font-semibold text-white/70 text-sm uppercase tracking-widest">About Section</h3>
          <F label="About Bio" k="aboutBio" textarea placeholder="A passionate developer building great things..." />
          <hr className="border-white/10" />
          <h3 className="font-semibold text-white/70 text-sm uppercase tracking-widest">SEO</h3>
          <F label="Site Title" k="siteTitle" placeholder="Dev Portfolio — Full Stack Developer" />
          <F label="Meta Description" k="metaDescription" textarea placeholder="Full Stack Developer specializing in MERN and Java..." />
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all disabled:opacity-60">
            <Save size={16} />{saving ? 'Saving...' : 'Save Settings'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
