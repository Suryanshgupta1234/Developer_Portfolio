import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Search, ExternalLink } from 'lucide-react';
import { certificatesAPI } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import SectionHeading from '../components/ui/SectionHeading';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { SkeletonCard } from '../components/ui/LoadingSpinner';
import { formatDateShort } from '../utils/formatters';
import { useDebounce } from '../hooks/useDebounce';

const DEFAULT_CERTS = [
  { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2024-01-01', category: 'Cloud', credentialUrl: '#', image: null },
  { title: 'Meta Front-End Developer', issuer: 'Meta / Coursera', date: '2023-09-01', category: 'Frontend', credentialUrl: '#', image: null },
  { title: 'MongoDB University M001', issuer: 'MongoDB', date: '2023-06-01', category: 'Database', credentialUrl: '#', image: null },
  { title: 'Python for Data Science', issuer: 'IBM / Coursera', date: '2023-03-01', category: 'ML/AI', credentialUrl: '#', image: null },
];

export default function CertificatesPage() {
  const { data, loading } = useFetch(() => certificatesAPI.getAll());
  const [preview, setPreview] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const certs = data?.length ? data : DEFAULT_CERTS;
  const categories = ['All', ...new Set(certs.map(c => c.category).filter(Boolean))];

  const filtered = certs.filter(c => {
    const matchCat = filter === 'All' || c.category === filter;
    const matchSearch = c.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.issuer?.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="Credentials" title="Certificates" subtitle="Professional certifications and completed courses." />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search certificates..."
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 w-64" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === cat ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} lines={3} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cert, i) => (
              <motion.div key={cert._id || i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}
                className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all group">
                {/* Image */}
                <div className="h-40 bg-gradient-to-br from-blue-900/30 to-purple-900/20 flex items-center justify-center relative overflow-hidden">
                  {cert.image ? (
                    <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-6xl opacity-20">🏆</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {cert.category && (
                    <div className="absolute top-3 right-3"><Badge variant="default">{cert.category}</Badge></div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-white mb-1 leading-tight">{cert.title}</h3>
                  <p className="text-sm text-white/40 mb-1">{cert.issuer}</p>
                  <p className="text-xs text-white/30 mb-4">{formatDateShort(cert.date)}</p>
                  <div className="flex gap-2">
                    {cert.image && (
                      <button onClick={() => setPreview(cert)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all">
                        <Eye size={14} /> Preview
                      </button>
                    )}
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-blue-500/40 text-white/50 hover:text-blue-400 transition-all">
                        <ExternalLink size={14} /> Verify
                      </a>
                    )}
                    {cert.fileUrl && (
                      <a href={cert.fileUrl} download
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all">
                        <Download size={14} /> Download
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Modal isOpen={!!preview} onClose={() => setPreview(null)} title={preview?.title} size="lg">
        {preview?.image && (
          <img src={preview.image} alt={preview.title} className="w-full rounded-xl" />
        )}
      </Modal>
    </div>
  );
}
