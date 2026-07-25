import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { experienceAPI } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';
import SectionHeading from '../ui/SectionHeading';
import { formatDateShort } from '../../utils/formatters';
import { SkeletonCard } from '../ui/LoadingSpinner';
import Badge from '../ui/Badge';

const DEFAULT_EXPERIENCE = [
  {
    title: 'Full Stack Developer Intern',
    company: 'Tech Company',
    location: 'Remote',
    type: 'Internship',
    startDate: '2024-01-01',
    endDate: null,
    current: true,
    description: 'Building and maintaining React + Node.js applications. Implementing new features, fixing bugs, and improving performance.',
    skills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    companyUrl: '#',
  },
  {
    title: 'Open Source Contributor',
    company: 'GitHub',
    location: 'Remote',
    type: 'Open Source',
    startDate: '2023-06-01',
    endDate: null,
    current: true,
    description: 'Contributing to various open source projects. Writing documentation and fixing issues.',
    skills: ['JavaScript', 'Git', 'React'],
    companyUrl: '#',
  },
  {
    title: 'Freelance Web Developer',
    company: 'Self-employed',
    location: 'Remote',
    type: 'Freelance',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    current: false,
    description: 'Designed and developed responsive websites for small businesses. Managed client communication.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    companyUrl: null,
  },
];

const typeVariants = {
  Internship: 'default',
  'Open Source': 'purple',
  Freelance: 'cyan',
  Hackathon: 'yellow',
  Volunteer: 'green',
};

const ExperienceCard = ({ exp, index }) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="relative"
  >
    {/* Timeline connector */}
    <div className="absolute left-0 top-6 bottom-0 w-px bg-white/10 hidden md:block" style={{ left: '1.125rem' }} />

    <div className="flex gap-6">
      {/* Icon */}
      <div className="hidden md:flex flex-shrink-0 w-9 h-9 rounded-xl glass border border-white/10 items-center justify-center z-10">
        <Briefcase size={16} className="text-blue-400" />
      </div>

      {/* Content */}
      <div className="flex-1 glass rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all mb-6 hover:-translate-y-1">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-white text-lg">{exp.title}</h3>
              <Badge variant={typeVariants[exp.type] || 'default'}>{exp.type}</Badge>
              {exp.current && <Badge variant="green">Current</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/40">
              <span className="flex items-center gap-1">
                <Briefcase size={13} /> {exp.company}
                {exp.companyUrl && (
                  <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    <ExternalLink size={11} />
                  </a>
                )}
              </span>
              {exp.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {exp.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {formatDateShort(exp.startDate)} — {exp.current ? 'Present' : formatDateShort(exp.endDate)}
              </span>
            </div>
          </div>
        </div>

        <p className="text-white/55 text-sm leading-relaxed mb-4">{exp.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {exp.skills?.map(skill => (
            <span key={skill} className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const Experience = () => {
  const { data, loading } = useFetch(() => experienceAPI.getAll());
  const items = data?.length ? data : DEFAULT_EXPERIENCE;

  return (
    <section className="py-24 bg-black" id="experience">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Experience"
          title="Work & Contributions"
          subtitle="Internships, freelancing, open source, and hackathons."
        />

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => <SkeletonCard key={i} lines={3} />)}
          </div>
        ) : (
          <div className="relative">
            {items.map((exp, i) => (
              <ExperienceCard key={exp._id || i} exp={exp} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
