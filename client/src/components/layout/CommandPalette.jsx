import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Code, User, Mail, Briefcase, BookOpen, Award, X } from 'lucide-react';

const COMMANDS = [
  { label: 'Home', shortcut: 'H', href: '/', icon: <Code size={16} /> },
  { label: 'About Me', shortcut: 'A', href: '/about', icon: <User size={16} /> },
  { label: 'Skills', shortcut: 'S', href: '/skills', icon: <Code size={16} /> },
  { label: 'Projects', shortcut: 'P', href: '/projects', icon: <Briefcase size={16} /> },
  { label: 'Experience', shortcut: 'E', href: '/experience', icon: <Briefcase size={16} /> },
  { label: 'Blog', shortcut: 'B', href: '/blog', icon: <BookOpen size={16} /> },
  { label: 'Achievements', shortcut: null, href: '/achievements', icon: <Award size={16} /> },
  { label: 'GitHub Dashboard', shortcut: 'G', href: '/github', icon: <Code size={16} /> },
  { label: 'LeetCode Dashboard', shortcut: 'L', href: '/leetcode', icon: <Code size={16} /> },
  { label: 'Resume', shortcut: 'R', href: '/resume', icon: <FileText size={16} /> },
  { label: 'Contact', shortcut: 'C', href: '/contact', icon: <Mail size={16} /> },
];

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') setSelected(s => Math.min(s + 1, filtered.length - 1));
      if (e.key === 'ArrowUp') setSelected(s => Math.max(s - 1, 0));
      if (e.key === 'Enter' && filtered[selected]) {
        navigate(filtered[selected].href);
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, filtered, selected, navigate, onClose]);

  const handleSelect = (href) => { navigate(href); onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg glass rounded-2xl overflow-hidden shadow-card z-10"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search size={18} className="text-white/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(0); }}
                placeholder="Search pages and actions..."
                className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
              />
              <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Results */}
            <div className="py-2 max-h-80 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-white/30 text-sm">No results found</div>
              ) : (
                filtered.map((cmd, i) => (
                  <button
                    key={cmd.href}
                    onClick={() => handleSelect(cmd.href)}
                    onMouseEnter={() => setSelected(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      i === selected ? 'bg-blue-500/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className={i === selected ? 'text-blue-400' : 'text-white/30'}>
                      {cmd.icon}
                    </span>
                    <span className="flex-1 text-left">{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="px-2 py-0.5 rounded bg-white/10 text-white/40 text-xs font-mono">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-white/10 flex items-center gap-4 text-xs text-white/20">
              <span><kbd className="font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="font-mono">↵</kbd> select</span>
              <span><kbd className="font-mono">esc</kbd> close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
