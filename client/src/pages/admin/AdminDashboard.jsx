import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban, Notebook, Award, Code2, Clock,
  Users, Eye, TrendingUp, RefreshCw, ExternalLink,
  CheckCircle, Target, Trophy, Github, Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const USERNAME_LC = import.meta.env.VITE_LEETCODE_USERNAME || 'suryansh07102004';
const USERNAME_GH = import.meta.env.VITE_GITHUB_USERNAME || 'yourusername';

// ── fetch analytics (needs auth token) ──────────────────────────────────
async function fetchAnalytics() {
  const { data } = await api.get('/analytics');
  return data;
}

// ── fetch LC stats via GraphQL (same as LeetCode page) ───────────────────
const LC_GQL = 'https://leetcode.com/graphql';

const USER_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        ranking
        reputation
      }
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
    recentAcSubmissionList(username: $username, limit: 1) {
      timestamp
    }
  }
`;

async function queryLC(query, variables) {
  const body = JSON.stringify({ query, variables });
  const headers = { 'Content-Type': 'application/json', 'Referer': 'https://leetcode.com' };

  // 1️⃣ Try direct
  try {
    const r = await fetch(LC_GQL, { method: 'POST', headers, body });
    if (r.ok) {
      const data = await r.json();
      if (data?.data) return data.data;
    }
  } catch { /* fall through */ }

  // 2️⃣ Try via corsproxy.io
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(LC_GQL)}`;
    const r = await fetch(proxyUrl, { method: 'POST', headers, body });
    if (r.ok) {
      const data = await r.json();
      if (data?.data) return data.data;
    }
  } catch { /* fall through */ }

  throw new Error('All LC API endpoints failed');
}

async function fetchLCStats(username) {
  const data = await queryLC(USER_QUERY, { username });

  if (!data?.matchedUser) throw new Error('User not found');

  const user = data.matchedUser;
  const acStats = user?.submitStats?.acSubmissionNum || [];

  const getSolved = (diff) => acStats.find(s => s.difficulty === diff)?.count ?? 0;

  return {
    username: user.username,
    totalSolved: getSolved('All'),
    easySolved: getSolved('Easy'),
    mediumSolved: getSolved('Medium'),
    hardSolved: getSolved('Hard'),
    ranking: user?.profile?.ranking,
    reputation: user?.profile?.reputation,
    totalActiveDays: 0, // Not needed for dashboard
    lastSubmission: data.recentAcSubmissionList?.[0]?.timestamp,
  };
}

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, colorClass, href, delay, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
          {icon}
        </div>
        {href && (
          <Link to={href} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            Manage →
          </Link>
        )}
      </div>
      {loading ? (
        <div className="h-9 w-16 bg-white/10 rounded-lg animate-pulse mb-1" />
      ) : (
        <div className="text-3xl font-black text-white mb-1">{value ?? '—'}</div>
      )}
      <div className="text-sm text-white/40">{label}</div>
    </motion.div>
  );
}

// ── LC Stat mini card ─────────────────────────────────────────────────────
function LCCard({ label, value, color, loading }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-white/50">{label}</span>
      {loading ? (
        <div className="h-5 w-12 bg-white/10 rounded animate-pulse" />
      ) : (
        <span className="font-mono font-bold text-sm" style={{ color }}>{value ?? '—'}</span>
      )}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { admin } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [lcStats, setLcStats] = useState(null);
  const [ghStats, setGhStats] = useState(null);
  const [loadingA, setLoadingA] = useState(true);
  const [loadingLC, setLoadingLC] = useState(true);
  const [loadingGH, setLoadingGH] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAll = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);

    // Analytics
    setLoadingA(true);
    try {
      const a = await fetchAnalytics();
      setAnalytics(a);
    } catch { setAnalytics(null); }
    setLoadingA(false);

    // LeetCode
    setLoadingLC(true);
    try {
      const lc = await fetchLCStats(USERNAME_LC);
      setLcStats(lc);
      // Store last fetch time
      localStorage.setItem('lcStats_lastFetch', Date.now().toString());
      localStorage.setItem('lcStats_cached', JSON.stringify(lc));
    } catch {
      // Try to use cached data if available
      const cached = localStorage.getItem('lcStats_cached');
      if (cached) setLcStats(JSON.parse(cached));
      else setLcStats(null);
    }
    setLoadingLC(false);

    // GitHub
    setLoadingGH(true);
    try {
      const r = await fetch(`https://api.github.com/users/${USERNAME_GH}`);
      if (r.ok) setGhStats(await r.json());
    } catch { setGhStats(null); }
    setLoadingGH(false);

    if (showRefresh) setRefreshing(false);
  };

  useEffect(() => {
    // Check if we need to refresh (once per day)
    const lastFetch = localStorage.getItem('lcStats_lastFetch');
    const oneDayMs = 24 * 60 * 60 * 1000;
    const shouldRefresh = !lastFetch || (Date.now() - parseInt(lastFetch)) > oneDayMs;

    // Check if cached data is valid
    const cached = localStorage.getItem('lcStats_cached');
    let hasValidCache = false;

    if (cached && !shouldRefresh) {
      try {
        const parsedData = JSON.parse(cached);
        // Validate the cached data has real values
        if (parsedData.totalSolved > 0 || parsedData.easySolved > 0) {
          hasValidCache = true;
          setLcStats(parsedData);
          setLoadingLC(false);
        } else {
          console.warn('⚠️ Admin: Cached LC stats have all 0s, forcing refresh');
        }
      } catch (e) {
        console.error('❌ Admin: Error parsing cached LC stats:', e);
      }
    }

    // If no valid cache or need refresh, fetch all data
    if (!hasValidCache || shouldRefresh) {
      loadAll(false);
    } else {
      // Still load other data (analytics, GitHub) even if using LC cache
      loadAll(false);
    }
  }, []);

  const siteStats = [
    { label: 'Total Projects', value: analytics?.projects, icon: <FolderKanban size={18} />, colorClass: 'bg-blue-500/20 text-blue-400', href: '/admin/projects', delay: 0 },
    { label: 'Blog Posts', value: analytics?.blogs, icon: <Notebook size={18} />, colorClass: 'bg-purple-500/20 text-purple-400', href: '/admin/blog', delay: 0.05 },
    { label: 'Skills', value: analytics?.skills, icon: <Code2 size={18} />, colorClass: 'bg-cyan-500/20 text-cyan-400', href: '/admin/skills', delay: 0.1 },
    { label: 'Certificates', value: analytics?.certificates, icon: <Award size={18} />, colorClass: 'bg-yellow-500/20 text-yellow-400', href: '/admin/certificates', delay: 0.15 },
    { label: 'Timeline Items', value: analytics?.timeline, icon: <Clock size={18} />, colorClass: 'bg-green-500/20 text-green-400', href: '/admin/timeline', delay: 0.2 },
    { label: 'Achievements', value: analytics?.achievements, icon: <TrendingUp size={18} />, colorClass: 'bg-red-500/20 text-red-400', href: '/admin/achievements', delay: 0.25 },
    { label: 'Visitors', value: analytics?.totalVisitors, icon: <Users size={18} />, colorClass: 'bg-pink-500/20 text-pink-400', href: null, delay: 0.3 },
    { label: 'Page Views', value: analytics?.pageViews, icon: <Eye size={18} />, colorClass: 'bg-orange-500/20 text-orange-400', href: null, delay: 0.35 },
  ];

  const easy = lcStats?.easySolved ?? 0;
  const medium = lcStats?.mediumSolved ?? 0;
  const hard = lcStats?.hardSolved ?? 0;
  const total = lcStats?.totalSolved ?? (easy + medium + hard);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {admin?.name || 'Admin'} 👋
          </h1>
          <p className="text-white/40 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => loadAll(true)} disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-sm transition-all"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh All
        </motion.button>
      </div>

      {/* Site stats */}
      <div>
        <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
          Portfolio Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {siteStats.map(s => (
            <StatCard key={s.label} {...s} loading={loadingA} />
          ))}
        </div>
      </div>

      {/* LeetCode + GitHub row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* LeetCode live stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-lg">
                🟨
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">LeetCode</h3>
                <p className="text-white/30 text-xs">
                  @{USERNAME_LC} · {(() => {
                    const lastFetch = localStorage.getItem('lcStats_lastFetch');
                    if (!lastFetch) return 'live';
                    const hours = Math.floor((Date.now() - parseInt(lastFetch)) / (1000 * 60 * 60));
                    if (hours < 1) return 'just updated';
                    if (hours < 24) return `${hours}h ago`;
                    return 'updated today';
                  })()}
                </p>
              </div>
            </div>
            <a href={`https://leetcode.com/u/${USERNAME_LC}/`} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-colors">
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Big total */}
          <div className="flex items-end gap-2 mb-4">
            {loadingLC ? (
              <div className="h-12 w-20 bg-white/10 rounded-lg animate-pulse" />
            ) : (
              <>
                <span className="text-5xl font-black text-white leading-none">{total}</span>
                <span className="text-white/30 text-sm pb-1">problems solved</span>
              </>
            )}
          </div>

          <div className="space-y-1">
            <LCCard label="🟢 Easy" value={easy} color="#22c55e" loading={loadingLC} />
            <LCCard label="🟡 Medium" value={medium} color="#f59e0b" loading={loadingLC} />
            <LCCard label="🔴 Hard" value={hard} color="#ef4444" loading={loadingLC} />
            {lcStats?.ranking && (
              <LCCard label="🏆 Global Rank" value={`#${Number(lcStats.ranking).toLocaleString()}`} color="#a78bfa" loading={loadingLC} />
            )}
            {lcStats?.totalActiveDays > 0 && (
              <LCCard label="📅 Active Days" value={lcStats.totalActiveDays} color="#60a5fa" loading={loadingLC} />
            )}
          </div>

          <Link to="/leetcode"
            className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400 text-xs font-medium transition-all">
            View Full Dashboard →
          </Link>
        </motion.div>

        {/* GitHub live stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass rounded-2xl p-5 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                <Github size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">GitHub</h3>
                <p className="text-white/30 text-xs">@{USERNAME_GH} · live</p>
              </div>
            </div>
            {ghStats && (
              <a href={ghStats.html_url} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-colors">
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          {loadingGH ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-white/5 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : ghStats ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <img src={ghStats.avatar_url} alt={ghStats.login}
                  className="w-12 h-12 rounded-xl ring-2 ring-white/10" />
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{ghStats.name || ghStats.login}</p>
                  <p className="text-white/40 text-xs">{ghStats.bio?.slice(0, 60) || 'Developer'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Repos', value: ghStats.public_repos },
                  { label: 'Followers', value: ghStats.followers },
                  { label: 'Following', value: ghStats.following },
                ].map(s => (
                  <div key={s.label} className="bg-white/5 rounded-xl p-2.5 text-center">
                    <div className="text-xl font-black text-white">{s.value}</div>
                    <div className="text-xs text-white/30">{s.label}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-6 text-center text-white/30 text-sm">
              Set <code className="text-blue-400">VITE_GITHUB_USERNAME</code> in .env
            </div>
          )}

          <Link to="/github"
            className="mt-2 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white text-xs font-medium transition-all">
            View Full Dashboard →
          </Link>
        </motion.div>
      </div>

      {/* Quick actions + Site status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-5 border border-white/10"
        >
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Activity size={15} className="text-blue-400" /> Quick Actions
          </h3>
          <div className="space-y-1">
            {[
              { label: '+ Add New Project', href: '/admin/projects' },
              { label: '+ Write a Blog Post', href: '/admin/blog' },
              { label: '+ Add Skill', href: '/admin/skills' },
              { label: '+ Upload Certificate', href: '/admin/certificates' },
              { label: '⚙ Update Site Settings', href: '/admin/settings' },
              { label: '📄 Upload Resume', href: '/admin/resume' },
            ].map(a => (
              <Link key={a.href} to={a.href}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white text-sm transition-all">
                {a.label}
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass rounded-2xl p-5 border border-white/10"
        >
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle size={15} className="text-green-400" /> System Status
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Frontend (Vite)', status: 'Running', color: 'bg-green-400' },
              { label: 'Backend (Node)', status: 'Running', color: 'bg-green-400' },
              { label: 'MongoDB', status: 'Connected', color: 'bg-green-400' },
              { label: 'LeetCode API', status: lcStats ? 'Connected' : loadingLC ? 'Checking…' : 'Unavailable', color: lcStats ? 'bg-green-400' : loadingLC ? 'bg-yellow-400' : 'bg-red-400' },
              { label: 'GitHub API', status: ghStats ? 'Connected' : loadingGH ? 'Checking…' : 'Unavailable', color: ghStats ? 'bg-green-400' : loadingGH ? 'bg-yellow-400' : 'bg-red-400' },
              { label: 'Cloudinary', status: 'Configure in .env', color: 'bg-yellow-400' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-white/50 text-sm">{s.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${s.color} ${s.status === 'Running' || s.status === 'Connected' ? 'animate-pulse' : ''}`} />
                  <span className="text-white/60 text-xs">{s.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-white/30">Portfolio URL</span>
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              localhost:5173 <ExternalLink size={10} />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
