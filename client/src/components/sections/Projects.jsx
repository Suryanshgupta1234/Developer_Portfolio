import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Search, SlidersHorizontal, Star } from 'lucide-react';
import { projectsAPI } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';
import { useDebounce } from '../../hooks/useDebounce';
import SectionHeading from '../ui/SectionHeading';
import Badge from '../ui/Badge';
import { SkeletonCard } from '../ui/LoadingSpinner';
import { PROJECT_CATEGORIES, SORT_OPTIONS } from '../../utils/constants';
import { formatDateShort } from '../../utils/formatters';

const ProjectCard = ({ project, index }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    whileHover={{ y: -6 }}
    className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/30 group transition-all"
  >
    {/* Image */}
    <div className="relative h-48 bg-gradient-to-br from-blue-900/30 to-purple-900/30 overflow-hidden">
      {project.image ? (
        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-6xl opacity-20">🚀</span>
        </div>
      )}
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-3 right-3">
          <Badge variant="yellow" className="flex items-center gap-1">
            <Star size={10} fill="currentColor" /> Featured
          </Badge>
        </div>
      )}

      {/* Category */}
      <div className="absolute top-3 left-3">
        <Badge variant="default">{project.category}</Badge>
      </div>
    </div>

    {/* Content */}
    <div className="p-5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-white text-lg leading-tight">{project.title}</h3>
        <span className="text-xs text-white/30 whitespace-nowrap mt-0.5">
          {formatDateShort(project.createdAt)}
        </span>
      </div>

      <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.techStack?.slice(0, 4).map((tech) => (
          <span key={tech} className="px-2 py-0.5 rounded-md bg-white/5 text-white/50 text-xs border border-white/10">
            {tech}
          </span>
        ))}
        {project.techStack?.length > 4 && (
          <span className="px-2 py-0.5 rounded-md bg-white/5 text-white/30 text-xs">
            +{project.techStack.length - 4}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-white/10 hover:border-white/20"
          >
            <Github size={14} /> Code
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-white/10 hover:border-white/20"
          >
            <ExternalLink size={14} /> Live
          </a>
        )}
        <Link
          to={`/projects/${project._id || project.slug}`}
          className="ml-auto text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          Details →
        </Link>
      </div>
    </div>
  </motion.div>
);

const Projects = ({ preview = false }) => {
  const { data, loading } = useFetch(() => projectsAPI.getAll());
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const projects = data || [];

  const filtered = useMemo(() => {
    let result = [...projects];

    // Filter by category
    if (category !== 'All') result = result.filter(p => p.category === category || p.techStack?.includes(category));

    // Filter by search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.techStack?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'latest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === 'alpha') result.sort((a, b) => a.title?.localeCompare(b.title));

    return preview ? result.slice(0, 6) : result;
  }, [projects, category, sortBy, debouncedSearch, preview]);

  return (
    <section className="py-24 bg-black" id="projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Work"
          title="Projects"
          subtitle="A collection of things I've built — from full-stack apps to ML models."
        />

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {PROJECT_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  category === cat ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-blue-500/50 cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-black">{o.label}</option>)}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <p className="text-lg">No projects found</p>
            <p className="text-sm mt-1">Try changing the filter or search</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard key={project._id || i} project={project} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* View all link */}
        {preview && projects.length > 6 && (
          <div className="text-center mt-12">
            <Link to="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 rounded-xl glass border border-white/20 hover:border-blue-500/50 text-white hover:text-blue-400 font-medium transition-all"
              >
                View All Projects →
              </motion.button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
