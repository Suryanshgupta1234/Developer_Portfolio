import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Code2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate('/admin');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-3xl p-8 border border-white/10 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Code2 size={22} />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@portfolio.com" required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/60 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••" required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-11 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/60 transition-all" />
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-glow-sm hover:shadow-glow disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</> : 'Sign In'}
          </motion.button>
        </form>

        <div className="mt-6 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
          <p className="text-xs text-white/30">Default: <code className="text-blue-400">admin@portfolio.com</code> / <code className="text-blue-400">admin123</code></p>
          <p className="text-xs text-white/20 mt-0.5">Change via server <code>.env</code> after first login</p>
        </div>
      </motion.div>
    </div>
  );
}
