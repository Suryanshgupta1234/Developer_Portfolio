import { motion } from 'framer-motion';
import { Trophy, Star, Code, Award, Zap } from 'lucide-react';
import { achievementsAPI } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';
import SectionHeading from '../ui/SectionHeading';
import { SkeletonCard } from '../ui/LoadingSpinner';

const DEFAULT_ACHIEVEMENTS = [
  { title: '500+ LeetCode Problems', description: 'Solved 500+ problems across Easy, Medium, and Hard categories.', icon: <Code size={24} />, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', type: 'coding' },
  { title: 'Hackathon Winner', description: 'Won 1st place in college-level 24-hour hackathon.', icon: <Trophy size={24} />, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', type: 'competition' },
  { title: '5-Star HackerRank', description: 'Achieved 5 stars in Problem Solving on HackerRank.', icon: <Star size={24} />, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20', type: 'coding' },
  { title: 'AWS Certified', description: 'Passed AWS Cloud Practitioner certification.', icon: <Award size={24} />, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20', type: 'certification' },
  { title: '100 Days of Code', description: 'Completed #100DaysOfCode challenge consistently.', icon: <Zap size={24} />, color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20', type: 'coding' },
  { title: 'Open Source Contributor', description: 'Contributed to 5+ open source projects on GitHub.', icon: <Star size={24} />, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20', type: 'contribution' },
];

const AchievementCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.08 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className={`glass rounded-2xl p-6 border ${item.bg || 'border-white/10 bg-white/5'} transition-all`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.bg || 'bg-blue-500/10'}`}>
      <span className={item.color || 'text-blue-400'}>{item.icon || <Trophy size={24} />}</span>
    </div>
    <h3 className="font-bold text-white mb-2">{item.title}</h3>
    <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
  </motion.div>
);

const Achievements = () => {
  const { data, loading } = useFetch(() => achievementsAPI.getAll());
  const items = data?.length ? data : DEFAULT_ACHIEVEMENTS;

  return (
    <section className="py-24 bg-black" id="achievements">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Wins"
          title="Achievements"
          subtitle="Milestones, competitions, and badges I'm proud of."
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} lines={2} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => <AchievementCard key={item._id || i} item={item} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default Achievements;
