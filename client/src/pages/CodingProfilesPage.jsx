import { motion } from 'framer-motion';
import { ExternalLink, Code2 } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';

const PROFILES = [
  { name: 'GitHub', username: import.meta.env.VITE_GITHUB_USERNAME || 'yourusername', url: 'https://github.com/', icon: '🐙', color: 'border-gray-500/30 hover:border-gray-400/50', badge: 'Open Source', description: 'Code repositories, contributions & open source work.' },
  { name: 'LeetCode', username: import.meta.env.VITE_LEETCODE_USERNAME || 'yourusername', url: 'https://leetcode.com/', icon: '🟨', color: 'border-yellow-500/30 hover:border-yellow-400/50', badge: 'DSA', description: 'Algorithmic problem solving & contest performance.' },
  { name: 'GeeksforGeeks', username: 'yourusername', url: 'https://auth.geeksforgeeks.org/user/', icon: '🟩', color: 'border-green-500/30 hover:border-green-400/50', badge: 'CS Concepts', description: 'Data structures, algorithms, and CS fundamentals.' },
  { name: 'CodeChef', username: 'yourusername', url: 'https://www.codechef.com/users/', icon: '👨‍🍳', color: 'border-orange-500/30 hover:border-orange-400/50', badge: 'Competitive', description: 'Competitive programming and monthly contests.' },
  { name: 'Codeforces', username: 'yourusername', url: 'https://codeforces.com/profile/', icon: '🔵', color: 'border-blue-500/30 hover:border-blue-400/50', badge: 'Competitive', description: 'Div. 2 & Div. 3 contests and rating improvement.' },
  { name: 'HackerRank', username: 'yourusername', url: 'https://www.hackerrank.com/', icon: '⬜', color: 'border-green-500/30 hover:border-green-400/50', badge: '5★', description: '5-star in Problem Solving & Java domains.' },
  { name: 'Coding Ninjas', username: 'yourusername', url: 'https://www.naukri.com/code360/profile/', icon: '🥷', color: 'border-red-500/30 hover:border-red-400/50', badge: 'Platform', description: 'Practice problems and interview preparation.' },
];

export default function CodingProfilesPage() {
  return (
    <div className="pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="Profiles" title="Coding Profiles" subtitle="Find me across competitive programming platforms." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROFILES.map((p, i) => (
            <motion.a key={p.name}
              href={`${p.url}${p.username}`} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.07 }} whileHover={{ y: -5, scale: 1.02 }}
              className={`glass rounded-2xl p-6 border ${p.color} transition-all group block`}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{p.icon}</span>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">{p.badge}</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-1 group-hover:text-blue-400 transition-colors">{p.name}</h3>
              <p className="text-blue-400 font-mono text-xs mb-3">@{p.username}</p>
              <p className="text-white/40 text-sm mb-4 leading-relaxed">{p.description}</p>
              <div className="flex items-center gap-1.5 text-white/30 group-hover:text-blue-400 text-sm transition-colors font-medium">
                Visit Profile <ExternalLink size={14} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
