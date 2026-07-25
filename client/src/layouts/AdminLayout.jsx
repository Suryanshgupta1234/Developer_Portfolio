import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, Notebook, Award, Clock, Share2,
  FileText, Settings, LogOut, Menu, X, Code2, ChevronRight,
  Star, Image, Briefcase, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} />, exact: true },
  { label: 'Projects', href: '/admin/projects', icon: <FolderKanban size={18} /> },
  { label: 'Blog', href: '/admin/blog', icon: <Notebook size={18} /> },
  { label: 'Skills', href: '/admin/skills', icon: <Code2 size={18} /> },
  { label: 'Certificates', href: '/admin/certificates', icon: <Award size={18} /> },
  { label: 'Achievements', href: '/admin/achievements', icon: <Star size={18} /> },
  { label: 'Timeline', href: '/admin/timeline', icon: <Clock size={18} /> },
  { label: 'Experience', href: '/admin/experience', icon: <Briefcase size={18} /> },
  { label: 'Social Links', href: '/admin/social', icon: <Share2 size={18} /> },
  { label: 'Resume', href: '/admin/resume', icon: <FileText size={18} /> },
  { label: 'Media', href: '/admin/media', icon: <Image size={18} /> },
  { label: 'Profile', href: '/admin/profile', icon: <User size={18} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={18} /> },
];

const AdminLayout = () => {
  const { isAuthenticated, loading, admin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Wait for token verification before deciding to redirect
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Verifying session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const isActive = (href, exact) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href) && href !== '/admin';
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 h-full w-64 z-30 flex flex-col glass border-r border-white/10"
          >
            {/* Logo */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Code2 size={16} className="text-white" />
                </div>
                <span className="font-bold text-white">Admin</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white lg:hidden transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive(item.href, item.exact)
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  )}
                >
                  <span className={isActive(item.href, item.exact) ? 'text-blue-400' : 'text-white/30'}>
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive(item.href, item.exact) && (
                    <ChevronRight size={14} className="ml-auto text-blue-400" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Admin info */}
            <div className="px-4 py-4 border-t border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 text-sm font-bold">
                    {admin?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{admin?.name || 'Admin'}</p>
                  <p className="text-xs text-white/40">{admin?.email || ''}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={cn('flex-1 transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-0')}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <Link to="/" target="_blank" className="text-xs text-white/30 hover:text-white/60 transition-colors">
            View Portfolio →
          </Link>
        </header>

        {/* Page */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
