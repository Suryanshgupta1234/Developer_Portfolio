import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Code2, RefreshCw, Trophy, Target, TrendingUp,
  CheckCircle, ExternalLink, Calendar, Zap, Star, AlertCircle,
} from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  Tooltip, BarChart, Bar, XAxis, YAxis,
} from 'recharts';
import SectionHeading from '../components/ui/SectionHeading';
import { SkeletonCard } from '../components/ui/LoadingSpinner';
import LeetCodeHeatmap from '../components/ui/LeetCodeHeatmap';

const USERNAME = import.meta.env.VITE_LEETCODE_USERNAME || 'suryansh07102004';
const LC_PROFILE_URL = `https://leetcode.com/u/${USERNAME}/`;

// ── LeetCode GraphQL API (direct) ─────────────────────────────────────────
const LC_GQL = 'https://leetcode.com/graphql';

const USER_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        userAvatar
        ranking
        reputation
        solutionCount
        aboutMe
        countryName
      }
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    allQuestionsCount {
      difficulty
      count
    }
  }
`;

const CALENDAR_QUERY = `
  query getCalendar($username: String!, $year: Int) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        activeYears
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`;

async function queryLC(query, variables) {
  // Try direct first (works if CORS is allowed), then via allorigins proxy
  const tryFetch = async (url, opts) => {
    const r = await fetch(url, opts);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  };

  const body = JSON.stringify({ query, variables });
  const headers = { 'Content-Type': 'application/json', 'Referer': 'https://leetcode.com' };

  // 1️⃣ Try direct
  try {
    const data = await tryFetch(LC_GQL, { method: 'POST', headers, body });
    if (data?.data) return data.data;
  } catch { /* fall through */ }

  // 2️⃣ Try via corsproxy.io
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(LC_GQL)}`;
    const data = await tryFetch(proxyUrl, { method: 'POST', headers, body });
    if (data?.data) return data.data;
  } catch { /* fall through */ }

  // 3️⃣ Try alfa-leetcode-api (REST fallback)
  throw new Error('All LC API endpoints failed');
}

async function fetchLeetCodeData(username) {
  // Parallel: profile + calendar
  const [profileData, calData] = await Promise.allSettled([
    queryLC(USER_QUERY, { username }),
    queryLC(CALENDAR_QUERY, { username, year: new Date().getFullYear() }),
  ]);

  const profile = profileData.status === 'fulfilled' ? profileData.value : null;
  const cal = calData.status === 'fulfilled' ? calData.value : null;

  if (!profile) throw new Error('Could not load profile');

  const user = profile.matchedUser;
  const allQ = profile.allQuestionsCount || [];
  const acStats = user?.submitStats?.acSubmissionNum || [];
  const calendar = cal?.matchedUser?.userCalendar;

  const getSolved = (diff) =>
    acStats.find(s => s.difficulty === diff)?.count ?? 0;
  const getTotal = (diff) =>
    allQ.find(q => q.difficulty === diff)?.count ?? 0;

  return {
    username: user?.username ?? username,
    name: user?.profile?.realName ?? username,
    avatar: user?.profile?.userAvatar,
    ranking: user?.profile?.ranking,
    reputation: user?.profile?.reputation,
    aboutMe: user?.profile?.aboutMe,
    country: user?.profile?.countryName,
    totalSolved: getSolved('All'),
    easySolved: getSolved('Easy'),
    mediumSolved: getSolved('Medium'),
    hardSolved: getSolved('Hard'),
    totalEasyQ: getTotal('Easy'),
    totalMediumQ: getTotal('Medium'),
    totalHardQ: getTotal('Hard'),
    streak: calendar?.streak ?? 0,
    totalActiveDays: calendar?.totalActiveDays ?? 0,
    submissionCalendar: calendar?.submissionCalendar ?? null,
  };
}

// ── REST fallback via alfa-leetcode-api ──────────────────────────────────
async function fetchViaRest(username) {
  console.log(`🔄 Fetching from REST API: ${username}`);

  const [solvedRes, calRes] = await Promise.allSettled([
    fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`),
    fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar`),
  ]);

  if (solvedRes.status === 'rejected') {
    console.error('❌ Solved stats fetch failed:', solvedRes.reason);
    throw new Error('REST API stats failed');
  }

  if (!solvedRes.value.ok) {
    console.error('❌ Solved stats response not OK:', solvedRes.value.status);
    throw new Error(`REST API returned ${solvedRes.value.status}`);
  }

  const solved = await solvedRes.value.json();
  console.log('📊 REST API solved response:', solved);

  const cal = calRes.status === 'fulfilled' && calRes.value.ok
    ? await calRes.value.json() : {};

  return {
    username: username,
    name: username,
    avatar: null,
    ranking: null,
    reputation: null,
    aboutMe: null,
    country: null,
    totalSolved: solved.solvedProblem ?? 0,
    easySolved: solved.easySolved ?? 0,
    mediumSolved: solved.mediumSolved ?? 0,
    hardSolved: solved.hardSolved ?? 0,
    totalEasyQ: 874,
    totalMediumQ: 1831,
    totalHardQ: 808,
    streak: 0,
    totalActiveDays: 0,
    submissionCalendar: cal?.submissionCalendar ?? null,
  };
}

// ── Stat card ─────────────────────────────────────────────────────────────// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-5 border border-white/10 text-center hover:border-white/20 transition-all">
      <div className={`flex justify-center mb-2 ${color}`}>{icon}</div>
      <div className="text-3xl font-black text-white mb-1">{value ?? '—'}</div>
      <div className="text-xs text-white/40">{label}</div>
    </motion.div>
  );
}

// ── Colored bar shape ─────────────────────────────────────────────────────
function ColoredBar({ x, y, width, height, fill }) {
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={5} ry={5} />;
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function LeetCodePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [apiSource, setApiSource] = useState('');

  const load = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      // Try REST API first (more reliable than GraphQL with CORS)
      console.log('⚠️ Trying REST API first (more reliable)...');
      const result = await fetchViaRest(USERNAME);
      console.log('✅ REST API data:', result);

      // Validate we got actual data
      if (result.totalSolved > 0 || result.easySolved > 0) {
        setData(result);
        setApiSource('REST API');
        localStorage.setItem('leetcode_lastFetch', Date.now().toString());
        localStorage.setItem('leetcode_cached', JSON.stringify(result));
        setLoading(false);
        setRefreshing(false);
        return;
      }
    } catch (restErr) {
      console.error('❌ REST API failed:', restErr);
    }

    // If REST failed or returned 0s, try GraphQL
    try {
      console.log('🌐 Trying LeetCode GraphQL...');
      const result = await fetchLeetCodeData(USERNAME);
      console.log('✅ LeetCode GraphQL data fetched:', result);
      setData(result);
      setApiSource('LeetCode GraphQL');
      localStorage.setItem('leetcode_lastFetch', Date.now().toString());
      localStorage.setItem('leetcode_cached', JSON.stringify(result));
    } catch (err) {
      console.error('❌ LeetCode GraphQL also failed:', err);
      // Try cached data as last resort
      const cached = localStorage.getItem('leetcode_cached');
      if (cached) {
        const parsedData = JSON.parse(cached);
        // Only use cache if it has valid data
        if (parsedData.totalSolved > 0 || parsedData.easySolved > 0) {
          console.log('📦 Using cached data (fallback):', parsedData);
          setData(parsedData);
          setApiSource('Cached (offline)');
        } else {
          setError('Could not load LeetCode data. The API may be temporarily unavailable.');
        }
      } else {
        setError('Could not load LeetCode data. The API may be temporarily unavailable.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Check if we need to refresh (once per day)
    const lastFetch = localStorage.getItem('leetcode_lastFetch');
    const oneDayMs = 24 * 60 * 60 * 1000;
    const shouldRefresh = !lastFetch || (Date.now() - parseInt(lastFetch)) > oneDayMs;

    console.log('🔍 LeetCode page mount:', {
      lastFetch: lastFetch ? new Date(parseInt(lastFetch)).toLocaleString() : 'none',
      shouldRefresh,
      hasCached: !!localStorage.getItem('leetcode_cached')
    });

    // Check if cached data is valid (not all 0s)
    const cached = localStorage.getItem('leetcode_cached');
    let hasValidCache = false;

    if (cached) {
      try {
        const parsedData = JSON.parse(cached);
        // Check if data has real values (not all 0s)
        if (parsedData.totalSolved > 0 || parsedData.easySolved > 0) {
          hasValidCache = true;

          if (!shouldRefresh) {
            // Use valid cached data
            console.log('📦 Using valid cached data:', parsedData);
            setData(parsedData);
            setApiSource('Cached (today)');
            setLoading(false);
            return;
          }
        } else {
          console.warn('⚠️ Cached data has all 0s, forcing refresh');
        }
      } catch (e) {
        console.error('❌ Error parsing cached data:', e);
      }
    }

    // If no valid cache or need refresh, fetch fresh data
    console.log('🌐 Fetching fresh data from API...');
    load();
  }, [load]);

  const easy = data?.easySolved ?? 0;
  const medium = data?.mediumSolved ?? 0;
  const hard = data?.hardSolved ?? 0;
  const total = data?.totalSolved ?? (easy + medium + hard);

  const diffData = [
    { name: 'Easy', solved: easy, total: data?.totalEasyQ ?? 874, color: '#22c55e' },
    { name: 'Medium', solved: medium, total: data?.totalMediumQ ?? 1831, color: '#f59e0b' },
    { name: 'Hard', solved: hard, total: data?.totalHardQ ?? 808, color: '#ef4444' },
  ];

  const radialData = [
    { name: 'Hard', value: hard, fill: '#ef4444' },
    { name: 'Medium', value: medium, fill: '#f59e0b' },
    { name: 'Easy', value: easy, fill: '#22c55e' },
  ];

  return (
    <div className="pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="DSA" title="LeetCode Dashboard"
          subtitle="Live stats & daily activity heatmap — fetched directly from LeetCode." />

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} lines={3} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20 space-y-4">
            <AlertCircle size={48} className="mx-auto text-yellow-400/60" />
            <p className="text-white/60 text-lg">{error}</p>
            <p className="text-white/30 text-sm max-w-md mx-auto">
              LeetCode's API blocks direct browser requests sometimes.
              The free REST proxy may be sleeping (takes ~30s to wake up).
            </p>
            <motion.button onClick={load} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all">
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Retrying…' : 'Retry'}
            </motion.button>
            {/* Show profile link anyway */}
            <div className="pt-2">
              <a href={LC_PROFILE_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-400 hover:underline text-sm">
                <ExternalLink size={14} /> View @{USERNAME} on LeetCode
              </a>
            </div>
          </div>
        )}

        {/* Data */}
        {!loading && !error && data && (
          <div className="space-y-8">

            {/* Profile Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-5">

              {/* Avatar */}
              <div className="flex-shrink-0">
                {data.avatar ? (
                  <img src={data.avatar} alt={data.username}
                    className="w-16 h-16 rounded-2xl ring-2 ring-yellow-500/30 object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-3xl">
                    🧑‍💻
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white leading-tight">
                  {data.name || data.username}
                </h2>
                <p className="text-yellow-400 font-mono text-sm mb-1">@{data.username}</p>
                {data.aboutMe && (
                  <p className="text-white/40 text-sm max-w-lg mb-2">{data.aboutMe}</p>
                )}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                  {data.ranking && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                      <Trophy size={11} /> Rank #{Number(data.ranking).toLocaleString()}
                    </span>
                  )}
                  {data.reputation > 0 && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <Star size={11} /> {data.reputation} rep
                    </span>
                  )}
                  {data.country && (
                    <span className="px-2.5 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/50">
                      📍 {data.country}
                    </span>
                  )}
                  <a href={LC_PROFILE_URL} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors">
                    <ExternalLink size={11} /> View Profile
                  </a>
                </div>
              </div>

              {/* Refresh */}
              <button onClick={load} disabled={refreshing} title="Refresh"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 hover:text-white transition-all self-start flex-shrink-0">
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </motion.div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Solved" value={total} icon={<CheckCircle size={20} />} color="text-blue-400" delay={0} />
              <StatCard label="Easy" value={easy} icon={<Target size={20} />} color="text-green-400" delay={0.07} />
              <StatCard label="Medium" value={medium} icon={<TrendingUp size={20} />} color="text-yellow-400" delay={0.14} />
              <StatCard label="Hard" value={hard} icon={<Trophy size={20} />} color="text-red-400" delay={0.21} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Radial */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                  <Zap size={16} className="text-yellow-400" /> Problems Distribution
                </h3>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width={160} height={160}>
                    <RadialBarChart innerRadius={28} outerRadius={72} data={radialData}
                      startAngle={90} endAngle={-270}>
                      <RadialBar dataKey="value" cornerRadius={6}
                        background={{ fill: 'rgba(255,255,255,0.04)' }} />
                      <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                        itemStyle={{ color: '#fff' }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-3">
                    {diffData.map(d => (
                      <div key={d.name}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                            <span className="text-white/60">{d.name}</span>
                          </div>
                          <span className="font-mono font-bold text-xs" style={{ color: d.color }}>
                            {d.solved}<span className="text-white/30 font-normal">/{d.total}</span>
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div className="h-full rounded-full" style={{ background: d.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${d.total > 0 ? (d.solved / d.total) * 100 : 0}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Bar chart */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-400" /> Solved by Difficulty
                </h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={diffData} barCategoryGap="35%">
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                      axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                      axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                      cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                      formatter={(val, _, props) => [val, props.payload.name]} />
                    <Bar dataKey="solved" shape={(props) => <ColoredBar {...props} fill={props.fill || diffData.find(d => d.name === props.name)?.color || '#2563eb'} />} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Activity Heatmap */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Calendar size={17} className="text-green-400" />
                  Coding Activity — Last 52 Weeks
                </h3>
                <span className="text-xs text-white/30">
                  via {apiSource} · {(() => {
                    const lastFetch = localStorage.getItem('leetcode_lastFetch');
                    if (!lastFetch) return 'just updated';
                    const hours = Math.floor((Date.now() - parseInt(lastFetch)) / (1000 * 60 * 60));
                    if (hours < 1) return 'just updated';
                    if (hours < 24) return `updated ${hours}h ago`;
                    return 'updated today';
                  })()}
                </span>
              </div>

              {data.submissionCalendar ? (
                <LeetCodeHeatmap
                  submissionCalendar={data.submissionCalendar}
                  totalActiveDays={data.totalActiveDays}
                  loading={false}
                />
              ) : (
                <div className="text-center py-10 text-white/30 space-y-2">
                  <Calendar size={32} className="mx-auto opacity-30" />
                  <p className="text-sm">Activity data not available from this API source.</p>
                  <a href={`https://leetcode.com/u/${USERNAME}/`} target="_blank" rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-xs inline-flex items-center gap-1">
                    <ExternalLink size={12} /> View heatmap on LeetCode.com
                  </a>
                </div>
              )}
            </motion.div>

          </div>
        )}
      </div>
    </div>
  );
}
