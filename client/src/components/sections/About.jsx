import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { timelineAPI } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';
import SectionHeading from '../ui/SectionHeading';
import { formatDateShort } from '../../utils/formatters';
import { SkeletonCard } from '../ui/LoadingSpinner';
import { usePortfolio } from '../../context/PortfolioContext';

// Suryansh Gupta's real timeline from resume
const DEFAULT_TIMELINE = [
  { year: '2020', title: 'Secondary School (10th)', description: 'R.P.M. Academy, Gorakhpur — Scored 87.6%', type: 'education', icon: '🏫' },
  { year: '2022', title: 'Higher Secondary (12th)', description: 'R.P.M. Academy, Gorakhpur — Scored 76.6%', type: 'education', icon: '📚' },
  { year: '2021', title: 'First Line of Code', description: 'Wrote my first "Hello World" in C — the spark that started everything.', type: 'coding', icon: '💡' },
  { year: '2023', title: 'B.Tech CSE (IoT) — PSIT Kanpur', description: 'Joined Pranveer Singh Institute of Technology, Kanpur. CGPA 7.97/10 (2023–2027)', type: 'education', icon: '🎓' },
  { year: '2023', title: 'Learned Java & DSA', description: 'Mastered OOP, Data Structures and Algorithms in Java. Completed DSA with OOP\'s in Java course.', type: 'coding', icon: '☕' },
  { year: '2024', title: 'MERN Stack Developer', description: 'Built full-stack apps with React, Node.js, Express, MongoDB. Shipped ZeroBite, Nestly, and more.', type: 'coding', icon: '⚛️' },
  { year: '2024', title: 'Machine Learning', description: 'Built ML models using Python, Scikit-learn, Pandas, NumPy, Matplotlib. Credit Risk prediction project.', type: 'coding', icon: '🤖' },
  { year: '2025', title: 'HackerRank 5-Star', description: 'Earned 5-star rating in Problem Solving on HackerRank with 4 badges.', type: 'milestone', icon: '⭐' },
  { year: '2025', title: 'LeetCode 250+ Problems', description: 'Solved 250+ problems on LeetCode. Consistent practice in DSA and competitive coding.', type: 'milestone', icon: '🟨' },
  { year: '2026', title: 'ET-AI Hackathon 2026 Semi-Finalist', description: 'Reached Semi-Finals of ET-AI-Hackathon-2026 — building AI-powered solutions under 24 hours.', type: 'milestone', icon: '🏆' },
  { year: '2026', title: 'Placement Preparation', description: 'Actively grinding DSA, system design, and full-stack projects. Targeting top product-based companies.', type: 'goal', icon: '🎯' },
  { year: '2027', title: 'Target: SDE Role', description: 'Final goal — land a Software Development Engineer role at a top-tier company before graduation.', type: 'goal', icon: '🚀' },
];

const typeColors = {
  personal: 'border-purple-500 bg-purple-500',
  education: 'border-blue-500 bg-blue-500',
  coding: 'border-cyan-500 bg-cyan-500',
  milestone: 'border-yellow-500 bg-yellow-500',
  goal: 'border-green-500 bg-green-500',
};

const TimelineItem = ({ item, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} gap-8 mb-12`}>
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}
      >
        <div className={`inline-block glass rounded-2xl p-5 border border-white/10 hover:border-blue-500/30 transition-all hover:-translate-y-1 max-w-sm ${isLeft ? 'ml-auto' : ''}`}>
          <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'justify-end' : ''}`}>
            <span className="text-2xl">{item.icon || '📌'}</span>
            <span className="text-xs font-mono text-white/40">{item.year || formatDateShort(item.date)}</span>
          </div>
          <h3 className="font-semibold text-white mb-1">{item.title}</h3>
          <p className="text-sm text-white/50 leading-relaxed">{item.description}</p>
        </div>
      </motion.div>

      {/* Center dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative z-10 flex-shrink-0"
      >
        <div className={`w-4 h-4 rounded-full border-2 ${typeColors[item.type] || 'border-blue-500 bg-blue-500'} shadow-glow-sm`} />
      </motion.div>

      {/* Empty side */}
      <div className="flex-1" />
    </div>
  );
};

const About = () => {
  const { data, loading } = useFetch(() => timelineAPI.getAll());
  const { settings } = usePortfolio();

  const items = data?.length ? data : DEFAULT_TIMELINE;

  return (
    <section className="py-24 bg-black" id="about">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SectionHeading
          tag="Journey"
          title="About Me"
          subtitle={settings?.aboutBio || 'A passionate developer building great things with code.'}
        />

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />

          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map(i => <SkeletonCard key={i} lines={2} />)}
            </div>
          ) : (
            items.map((item, i) => <TimelineItem key={item._id || i} item={item} index={i} />)
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
