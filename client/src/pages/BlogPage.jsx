import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, User, ArrowRight } from 'lucide-react';
import { blogsAPI } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { useDebounce } from '../hooks/useDebounce';
import SectionHeading from '../components/ui/SectionHeading';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/LoadingSpinner';
import { formatDate, truncate, timeAgo } from '../utils/formatters';
import { BLOG_CATEGORIES } from '../utils/constants';

export default function BlogPage() {
  const { data, loading } = useFetch(() => blogsAPI.getAll());
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const posts = data || [];
  const filtered = posts.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-20 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="Writing" title="Blog" subtitle="Thoughts on Java, React, DSA, and building things." />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..."
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 w-64" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {BLOG_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === cat ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => <SkeletonCard key={i} lines={4} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <p className="text-xl mb-2">No posts found</p>
            <p className="text-sm">Check back soon — blog posts coming!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((post, i) => (
              <motion.article key={post._id || i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all group hover:-translate-y-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {post.category && <Badge variant="default">{post.category}</Badge>}
                  <span className="flex items-center gap-1 text-xs text-white/30">
                    <Clock size={12} /> {post.readTime || '5'} min read
                  </span>
                  <span className="text-xs text-white/30">{timeAgo(post.createdAt)}</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  {truncate(post.excerpt || post.content, 180)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags?.slice(0, 3).map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 text-white/40 text-xs">{t}</span>
                    ))}
                  </div>
                  <Link to={`/blog/${post.slug || post._id}`}
                    className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
