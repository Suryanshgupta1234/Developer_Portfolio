import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { skillsAPI } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';
import { useDebounce } from '../../hooks/useDebounce';
import SectionHeading from '../ui/SectionHeading';
import { SKILL_CATEGORIES } from '../../utils/constants';
import { SkeletonCard } from '../ui/LoadingSpinner';

const DEFAULT_SKILLS = [
  { name: 'Java', category: 'Programming', level: 90, icon: '☕', color: '#b07219' },
  { name: 'Python', category: 'Programming', level: 80, icon: '🐍', color: '#3572A5' },
  { name: 'JavaScript', category: 'Programming', level: 88, icon: '⚡', color: '#f7df1e' },
  { name: 'SQL', category: 'Programming', level: 78, icon: '🗄️', color: '#336791' },
  { name: 'HTML', category: 'Frontend', level: 95, icon: '🌐', color: '#e34c26' },
  { name: 'CSS', category: 'Frontend', level: 88, icon: '🎨', color: '#563d7c' },
  { name: 'React', category: 'Frontend', level: 92, icon: '⚛️', color: '#61dafb' },
  { name: 'Tailwind CSS', category: 'Frontend', level: 90, icon: '💨', color: '#06b6d4' },
  { name: 'Framer Motion', category: 'Frontend', level: 80, icon: '🎞️', color: '#ff4757' },
  { name: 'Node.js', category: 'Backend', level: 88, icon: '🟢', color: '#68a063' },
  { name: 'Express.js', category: 'Backend', level: 85, icon: '🚂', color: '#ffffff' },
  { name: 'MongoDB', category: 'Backend', level: 82, icon: '🍃', color: '#4DB33D' },
  { name: 'REST APIs', category: 'Backend', level: 90, icon: '🔌', color: '#ff6b6b' },
  { name: 'JWT', category: 'Backend', level: 85, icon: '🔐', color: '#fb923c' },
  { name: 'PyTorch', category: 'Machine Learning', level: 72, icon: '🔥', color: '#ee4c2c' },
  { name: 'TensorFlow', category: 'Machine Learning', level: 70, icon: '🧠', color: '#ff6f00' },
  { name: 'Pandas', category: 'Machine Learning', level: 78, icon: '🐼', color: '#150458' },
  { name: 'NumPy', category: 'Machine Learning', level: 80, icon: '🔢', color: '#4dabcf' },
  { name: 'Scikit-learn', category: 'Machine Learning', level: 75, icon: '📊', color: '#f89939' },
  { name: 'Git', category: 'Tools', level: 92, icon: '📦', color: '#f05032' },
  { name: 'GitHub', category: 'Tools', level: 92, icon: '🐙', color: '#ffffff' },
  { name: 'VS Code', category: 'Tools', level: 95, icon: '💙', color: '#007acc' },
  { name: 'Postman', category: 'Tools', level: 88, icon: '📮', color: '#ff6c37' },
  { name: 'Docker', category: 'Tools', level: 68, icon: '🐳', color: '#2496ed' },
];

const SkillCard = ({ skill, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.04 }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="glass rounded-2xl p-5 border border-white/10 hover:border-blue-500/30 transition-all group"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{skill.icon || '🔧'}</span>
        <div>
          <h3 className="font-semibold text-white text-sm">{skill.name}</h3>
          <span className="text-xs text-white/40">{skill.category}</span>
        </div>
      </div>
      <span className="text-xs font-mono text-blue-400 font-semibold">{skill.level}%</span>
    </div>

    {/* Progress bar */}
    <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${skill.color || '#2563eb'}, #06b6d4)` }}
        initial={{ width: 0 }}
        whileInView={{ width: `${skill.level}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: index * 0.04 + 0.3, ease: 'easeOut' }}
      />
      {/* Shimmer */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2, delay: index * 0.04 + 1.3, repeat: Infinity, repeatDelay: 3 }}
      />
    </div>
  </motion.div>
);

const Skills = () => {
  const { data, loading } = useFetch(() => skillsAPI.getAll());
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const skills = data?.length ? data : DEFAULT_SKILLS;

  const filtered = useMemo(() => {
    return skills.filter(s => {
      const matchCat = activeCategory === 'All' || s.category === activeCategory;
      const matchSearch = s.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [skills, activeCategory, debouncedSearch]);

  // Group by category for display
  const grouped = useMemo(() => {
    if (activeCategory !== 'All') return { [activeCategory]: filtered };
    return filtered.reduce((acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    }, {});
  }, [filtered, activeCategory]);

  return (
    <section className="py-24 bg-black" id="skills">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="Expertise" title="Skills & Technologies" subtitle="Technologies I use to build modern, scalable applications." />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search skills..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-white/30" />
            {SKILL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} lines={2} />)}
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-12">
              <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-4 h-px bg-blue-500" />
                {category}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((skill, i) => (
                  <SkillCard key={skill._id || skill.name} skill={skill} index={i} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Skills;
