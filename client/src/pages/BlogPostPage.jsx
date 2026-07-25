import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { blogsAPI } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { formatDate } from '../utils/formatters';
import { SkeletonCard } from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';

export default function BlogPostPage() {
  const { slug } = useParams();
  const { data: post, loading, error } = useFetch(() => blogsAPI.getOne(slug), [slug]);

  if (loading) return (
    <div className="pt-24 max-w-3xl mx-auto px-6 space-y-6">
      <SkeletonCard lines={2} />
      <SkeletonCard lines={8} />
    </div>
  );

  if (error || !post) return (
    <div className="pt-24 text-center py-20">
      <p className="text-white/40 text-xl mb-4">Post not found</p>
      <Link to="/blog" className="text-blue-400 hover:underline">← Back to Blog</Link>
    </div>
  );

  return (
    <div className="pt-20 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {post.category && <Badge variant="default">{post.category}</Badge>}
            <span className="flex items-center gap-1 text-xs text-white/30"><Clock size={12} /> {post.readTime || '5'} min read</span>
            <span className="flex items-center gap-1 text-xs text-white/30"><Calendar size={12} /> {formatDate(post.createdAt)}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">{post.title}</h1>

          {/* Cover image */}
          {post.coverImage && (
            <div className="rounded-2xl overflow-hidden mb-8 h-64 md:h-80">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div"
                      customStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', margin: '1.5rem 0' }}
                      {...props}>
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="px-1.5 py-0.5 rounded bg-white/10 text-blue-300 text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-white/10">
              <Tag size={14} className="text-white/30" />
              {post.tags.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-white/5 text-white/50 text-xs border border-white/10">{t}</span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
