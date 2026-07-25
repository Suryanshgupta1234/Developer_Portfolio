import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, GitFork, Users, BookOpen, RefreshCw, ExternalLink, Code2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SectionHeading from '../components/ui/SectionHeading';
import { SkeletonCard } from '../components/ui/LoadingSpinner';
import { getLangColor } from '../utils/formatters';

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'yourusername';
const GH_API = `https://api.github.com`;

export default function GitHubPage() {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [langData, setLangData] = useState([]);

  const fetchGitHubData = async () => {
    setRefreshing(true);
    try {
      const [profileRes, reposRes] = await Promise.all([
        fetch(`${GH_API}/users/${GITHUB_USERNAME}`),
        fetch(`${GH_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
      ]);
      const profileData = await profileRes.json();
      const reposData = await reposRes.json();
      setProfile(profileData);
      setRepos(Array.isArray(reposData) ? reposData : []);

      // Aggregate languages
      const langs = {};
      (Array.isArray(reposData) ? reposData : []).forEach(r => {
        if (r.language) langs[r.language] = (langs[r.language] || 0) + 1;
      });
      setLangData(Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name, value })));
    } catch (e) {
      console.error('GitHub API error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchGitHubData(); }, []);

  const statCards = profile ? [
    { label: 'Public Repos', value: profile.public_repos, icon: <BookOpen size={20} /> },
    { label: 'Followers', value: profile.followers, icon: <Users size={20} /> },
    { label: 'Following', value: profile.following, icon: <Users size={20} /> },
    { label: 'Public Gists', value: profile.public_gists, icon: <Code2 size={20} /> },
  ] : [];

  const topRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);

  return (
    <div className="pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="Open Source" title="GitHub Dashboard"
          subtitle="Live stats and activity from my GitHub profile." />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} lines={3} />)}
          </div>
        ) : !profile || profile.message === 'Not Found' ? (
          <div className="text-center py-20 text-white/40">
            <Github size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">Set your GitHub username in <code className="text-blue-400">.env</code> to see your stats.</p>
            <p className="text-sm mt-2 font-mono">VITE_GITHUB_USERNAME=yourusername</p>
          </div>
        ) : (
          <>
            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 border border-white/10 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
              <img src={profile.avatar_url} alt={profile.login} className="w-20 h-20 rounded-2xl ring-2 ring-blue-500/30" />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-white">{profile.name || profile.login}</h2>
                <p className="text-blue-400 font-mono text-sm mb-2">@{profile.login}</p>
                {profile.bio && <p className="text-white/50 text-sm mb-3">{profile.bio}</p>}
                <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-white/40">
                  {profile.location && <span>📍 {profile.location}</span>}
                  {profile.company && <span>🏢 {profile.company}</span>}
                  {profile.blog && <a href={profile.blog} className="text-blue-400 hover:underline flex items-center gap-1">🔗 Website <ExternalLink size={12} /></a>}
                </div>
              </div>
              <div className="flex gap-2">
                <a href={profile.html_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-sm text-white transition-all">
                  <Github size={16} /> Profile
                </a>
                <button onClick={fetchGitHubData} disabled={refreshing}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all">
                  <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                </button>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-5 border border-white/10 text-center hover:border-blue-500/30 transition-all">
                  <div className="text-blue-400 flex justify-center mb-2">{s.icon}</div>
                  <div className="text-3xl font-black text-white mb-1">{s.value?.toLocaleString()}</div>
                  <div className="text-xs text-white/40">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Language Pie */}
              {langData.length > 0 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-2xl p-6 border border-white/10">
                  <h3 className="font-semibold text-white mb-4">Most Used Languages</h3>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie data={langData} dataKey="value" cx="50%" cy="50%" outerRadius={70} strokeWidth={0}>
                          {langData.map((entry, i) => (
                            <Cell key={i} fill={getLangColor(entry.name)} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                          itemStyle={{ color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {langData.map(l => (
                        <div key={l.name} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: getLangColor(l.name) }} />
                          <span className="text-xs text-white/60 flex-1">{l.name}</span>
                          <span className="text-xs text-white/40 font-mono">{l.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Stars Bar Chart */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="font-semibold text-white mb-4">Top Repos by Stars</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={topRepos.slice(0, 5).map(r => ({ name: r.name.slice(0, 12), stars: r.stargazers_count }))}>
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="stars" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Repo Grid */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Top Repositories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topRepos.map((repo, i) => (
                  <motion.a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -3 }}
                    className="glass rounded-2xl p-5 border border-white/10 hover:border-blue-500/30 transition-all group block">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors truncate">{repo.name}</h4>
                      {repo.language && (
                        <span className="px-2 py-0.5 rounded-full text-xs ml-2 flex-shrink-0"
                          style={{ background: `${getLangColor(repo.language)}20`, color: getLangColor(repo.language) }}>
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <p className="text-white/40 text-xs mb-3 line-clamp-2">{repo.description || 'No description'}</p>
                    <div className="flex items-center gap-3 text-xs text-white/30">
                      <span className="flex items-center gap-1"><Star size={12} /> {repo.stargazers_count}</span>
                      <span className="flex items-center gap-1"><GitFork size={12} /> {repo.forks_count}</span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
