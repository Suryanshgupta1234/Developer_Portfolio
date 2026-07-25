import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowLeft, Calendar, Tag } from 'lucide-react';
import { projectsAPI } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { formatDate } from '../utils/formatters';
import { SkeletonCard } from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { data: project, loading, error } = useFetch(() => projectsAPI.getOne(id), [id]);

  if (loading) return (
    <div className="pt-24 max-w-5xl mx-auto px-6 space-y-6">
      <SkeletonCard lines={4} />
      <SkeletonCard lines={6} />
    </div>
  );

  if (error || !project) return (
    <div className="pt-24 text-center py-20">
      <p className="text-white/40 text-xl mb-4">Project not found</p>
      <Link to="/projects" className="text-blue-400 hover:underline">← Back to Projects</Link>
    </div>
  );

  return (
    <div className="pt-20 pb-24">
      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {project.image ? (
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 max-w-5xl mx-auto px-6 pb-8">
          <Link to="/projects" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to Projects
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Badge variant="default">{project.category}</Badge>
            {project.featured && <Badge variant="yellow">Featured</Badge>}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white">{project.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main */}
        <div className="lg:col-span-2 space-y-10">
          <Section title="Overview">
            <p className="text-white/60 leading-relaxed text-lg">{project.description}</p>
          </Section>
          {project.problemStatement && (
            <Section title="Problem Statement">
              <p className="text-white/60 leading-relaxed">{project.problemStatement}</p>
            </Section>
          )}
          {project.solution && (
            <Section title="Solution">
              <p className="text-white/60 leading-relaxed">{project.solution}</p>
            </Section>
          )}
          {project.features?.length > 0 && (
            <Section title="Key Features">
              <ul className="space-y-2">
                {project.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </Section>
          )}
          {project.challenges && (
            <Section title="Challenges & Learnings">
              <p className="text-white/60 leading-relaxed">{project.challenges}</p>
            </Section>
          )}
          {project.futureImprovements && (
            <Section title="Future Improvements">
              <p className="text-white/60 leading-relaxed">{project.futureImprovements}</p>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="glass rounded-2xl p-5 space-y-3 border border-white/10">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/20 hover:border-white/40 text-white hover:bg-white/5 transition-all font-medium text-sm">
                <Github size={18} /> View Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all font-medium text-sm shadow-glow-sm hover:shadow-glow">
                <ExternalLink size={18} /> Live Demo
              </a>
            )}
          </div>

          {/* Tech Stack */}
          {project.techStack?.length > 0 && (
            <div className="glass rounded-2xl p-5 border border-white/10">
              <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(t => (
                  <span key={t} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20 font-medium">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="glass rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Calendar size={15} />
              <span>{formatDate(project.createdAt)}</span>
            </div>
            {project.category && (
              <div className="flex items-center gap-2 text-sm text-white/40">
                <Tag size={15} />
                <span>{project.category}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-4 h-0.5 bg-blue-500 rounded-full" />
        {title}
      </h2>
      {children}
    </motion.div>
  );
}
