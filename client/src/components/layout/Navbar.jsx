import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2, Moon, Sun, Terminal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { NAV_LINKS } from '../../utils/constants';
import { cn } from '../../utils/cn';

const Navbar = ({ onCommandPaletteOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location]);

  const isActive = (href, exact) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href) && href !== '/';
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 inset-x-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-card'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:shadow-glow transition-all">
                <Code2 size={16} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Dev<span className="text-blue-500">.</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive(link.href, link.exact)
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Command palette shortcut */}
              <button
                onClick={onCommandPaletteOpen}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-white/40 hover:text-white/70 text-xs transition-all"
                title="Command Palette (Ctrl+K)"
              >
                <Terminal size={14} />
                <span className="font-mono">⌘K</span>
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-30 bg-black/95 backdrop-blur-xl border-b border-white/10 md:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive(link.href, link.exact)
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
