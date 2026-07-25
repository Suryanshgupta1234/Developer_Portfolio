import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Download, Eye } from 'lucide-react';
import { resumeAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminResume() {
  const [current, setCurrent] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    resumeAPI.get().then(r => setCurrent(r.data)).catch(() => { });
  }, []);

  const handleUpload = async () => {
    if (!file) return toast.error('Select a PDF file');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      const { data } = await resumeAPI.upload(fd);
      setCurrent(data);
      setFile(null);
      toast.success('Resume uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleManualUrl = async () => {
    if (!manualUrl || !manualUrl.startsWith('http')) {
      return toast.error('Enter a valid URL starting with http:// or https://');
    }
    setUploading(true);
    try {
      const { data } = await resumeAPI.setUrl({ url: manualUrl });
      setCurrent(data);
      setManualUrl('');
      setShowManualInput(false);
      toast.success('Resume URL saved!');
    } catch { toast.error('Failed to save URL'); }
    finally { setUploading(false); }
  };

  return (
    <div>
      <div className="mb-6"><h1 className="text-xl font-bold text-white">Resume</h1><p className="text-white/40 text-sm">Manage your resume / CV</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        {/* Upload or Manual URL */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 border border-white/10">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Upload size={18} className="text-blue-400" /> Upload Resume</h3>

          {/* Tab switcher */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowManualInput(false)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${!showManualInput ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50 hover:text-white'
                }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setShowManualInput(true)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${showManualInput ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50 hover:text-white'
                }`}
            >
              Paste URL
            </button>
          </div>

          {!showManualInput ? (
            <>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center mb-4 hover:border-blue-500/30 transition-colors cursor-pointer"
                onClick={() => document.getElementById('resume-input').click()}>
                <FileText size={32} className="mx-auto mb-2 text-white/20" />
                <p className="text-white/40 text-sm">{file ? file.name : 'Click to select PDF'}</p>
                <p className="text-white/20 text-xs mt-1">PDF only, max 5MB</p>
              </div>
              <input id="resume-input" type="file" accept="application/pdf" className="hidden" onChange={e => setFile(e.target.files[0])} />
              <button onClick={handleUpload} disabled={!file || uploading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {uploading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Uploading...</> : <><Upload size={16} />Upload</>}
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-white/60 text-xs mb-2">Resume URL (Google Drive, Dropbox, etc.)</label>
                <input
                  type="url"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500 text-sm"
                />
                <p className="text-white/30 text-xs mt-2">
                  💡 Upload your resume to Google Drive, make it public, and paste the link here
                </p>
              </div>
              <button onClick={handleManualUrl} disabled={!manualUrl || uploading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {uploading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <>Save URL</>}
              </button>
            </>
          )}
        </motion.div>

        {/* Current */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border border-white/10">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><FileText size={18} className="text-blue-400" /> Current Resume</h3>
          {current?.url ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-white font-medium mb-0.5">resume.pdf</p>
                <p className="text-xs text-white/30">Uploaded and available publicly</p>
              </div>
              <div className="flex gap-2">
                <a href={current.url} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/20 hover:border-white/40 text-white text-sm transition-all hover:bg-white/5">
                  <Eye size={15} /> View
                </a>
                <a href={current.url} download="resume.pdf"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm transition-all">
                  <Download size={15} /> Download
                </a>
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-white/30 text-sm">No resume uploaded yet</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
