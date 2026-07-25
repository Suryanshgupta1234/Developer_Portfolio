import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, FileText, Upload } from 'lucide-react';
import { resumeAPI } from '../services/api';
import SectionHeading from '../components/ui/SectionHeading';

export default function ResumePage() {
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resumeAPI.get()
      .then(res => setResumeUrl(res.data?.url))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="CV" title="Resume" subtitle="Download or view my latest resume." />

        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          {/* Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-white/50">
              <FileText size={18} />
              <span className="text-sm">resume.pdf</span>
            </div>
            <div className="flex gap-3">
              {resumeUrl && (
                <>
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 hover:border-white/40 text-white text-sm transition-all hover:bg-white/5">
                    <Eye size={16} /> Preview
                  </a>
                  <a href={resumeUrl} download
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm transition-all shadow-glow-sm hover:shadow-glow">
                    <Download size={16} /> Download
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Viewer */}
          <div className="relative bg-black/40" style={{ minHeight: '70vh' }}>
            {loading ? (
              <div className="flex items-center justify-center h-96 text-white/30">
                <div className="text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm">Loading resume…</p>
                </div>
              </div>
            ) : resumeUrl ? (
              <iframe src={`${resumeUrl}#view=FitH`} className="w-full h-full border-0" style={{ minHeight: '70vh' }} title="Resume" />
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-white/30 gap-4">
                <FileText size={48} className="opacity-20" />
                <p className="text-lg">No resume uploaded yet</p>
                <p className="text-sm">Upload from the <span className="text-blue-400">Admin Panel → Resume</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
