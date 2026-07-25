import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/layout/CustomCursor';
import ScrollProgress from '../components/layout/ScrollProgress';
import BackToTop from '../components/layout/BackToTop';
import CommandPalette from '../components/layout/CommandPalette';
import AIChatbot from '../components/common/AIChatbot';
import PageTransition from '../components/layout/PageTransition';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { useTheme } from '../context/ThemeContext';

const MainLayout = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const location = useLocation();
  const { isDark } = useTheme();

  // Handle Ctrl+K for command palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // First load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsFirstLoad(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (isFirstLoad) return <PageLoader />;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'} relative`}>
      {/* Premium cursor */}
      <CustomCursor />

      {/* Scroll progress bar */}
      <ScrollProgress />

      {/* Navigation */}
      <Navbar onCommandPaletteOpen={() => setCommandPaletteOpen(true)} />

      {/* Page Content */}
      <main>
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating controls */}
      <BackToTop />
      <AIChatbot />

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
};

export default MainLayout;
