import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

// Portfolio-aware response engine
const PORTFOLIO_DATA = {
  name: 'Siddharth',
  roles: ['MERN Stack Developer', 'Java Developer', 'ML Enthusiast'],
  skills: ['React', 'Node.js', 'Java', 'MongoDB', 'Python', 'TensorFlow', 'Git', 'Docker'],
  github: import.meta.env.VITE_GITHUB_USERNAME || 'yourusername',
  leetcode: import.meta.env.VITE_LEETCODE_USERNAME || 'yourusername',
  email: 'hello@dev.com',
};

const QA = [
  { patterns: ['who are you', 'about you', 'introduce yourself', 'tell me about yourself'],
    answer: `I'm ${PORTFOLIO_DATA.name}, a Full Stack Developer specializing in the MERN stack, Java, and Machine Learning. I build scalable web applications and love solving complex problems with clean code.` },
  { patterns: ['projects', 'portfolio', 'what have you built', 'show projects'],
    answer: `I've built multiple projects across Full Stack (React + Node.js), Java, and ML. Check out the **Projects** page for the full list with live demos and source code!` },
  { patterns: ['skills', 'technologies', 'what do you know', 'tech stack'],
    answer: `My core stack: **${PORTFOLIO_DATA.skills.join(', ')}**. I also work with Tailwind CSS, Express.js, JWT auth, Cloudinary, and Framer Motion on the frontend.` },
  { patterns: ['resume', 'cv', 'download'],
    answer: `You can view and download my resume on the **Resume** page. Head there to see my full work history and skills summary.` },
  { patterns: ['github', 'repositories', 'open source', 'code'],
    answer: `My GitHub is **github.com/${PORTFOLIO_DATA.github}**. I have repos covering MERN projects, Java DSA, and ML experiments. Check the GitHub Dashboard page for live stats!` },
  { patterns: ['leetcode', 'dsa', 'competitive', 'problem solving'],
    answer: `My LeetCode profile is **leetcode.com/${PORTFOLIO_DATA.leetcode}**. Visit the LeetCode Dashboard page for my live problem count and difficulty breakdown.` },
  { patterns: ['contact', 'email', 'hire', 'reach', 'connect'],
    answer: `You can reach me at **${PORTFOLIO_DATA.email}** or use the Contact page to send a message directly. I typically respond within 24 hours!` },
  { patterns: ['machine learning', 'ml', 'ai', 'pytorch', 'tensorflow'],
    answer: `I work with PyTorch, TensorFlow, Scikit-learn, Pandas, and NumPy. I've built models for image classification and NLP tasks. Check the Projects page for ML-tagged projects!` },
  { patterns: ['java', 'spring', 'oop'],
    answer: `Java is one of my strongest languages. I've mastered OOP, data structures, algorithms, and have solved 500+ DSA problems in Java on LeetCode.` },
  { patterns: ['experience', 'work', 'internship', 'job'],
    answer: `I have internship and freelancing experience building full-stack web apps. See the **Experience** page for a detailed timeline.` },
  { patterns: ['hello', 'hi', 'hey', 'greet'],
    answer: `Hey there! 👋 I'm the AI assistant for this portfolio. Ask me anything about the developer — skills, projects, GitHub, LeetCode, or contact info!` },
  { patterns: ['help', 'what can you do', 'commands'],
    answer: `I can answer questions like:\n• *Who are you?*\n• *Show your projects*\n• *What technologies do you know?*\n• *How can I contact you?*\n• *Show your GitHub / LeetCode*\n• *Tell me about your ML projects*` },
];

function getAnswer(input) {
  const lower = input.toLowerCase();
  for (const qa of QA) {
    if (qa.patterns.some(p => lower.includes(p))) return qa.answer;
  }
  return `That's a great question! I'm best at answering questions about this developer's **skills, projects, GitHub, LeetCode, resume, and contact info**. Try asking one of those! 😊`;
}

const Message = ({ msg }) => (
  <div className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-white/10 border border-white/10'}`}>
      {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-blue-400" />}
    </div>
    <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-sm'}`}>
      {msg.text.split('**').map((part, i) =>
        i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
      )}
    </div>
  </div>
);

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your AI portfolio assistant. Ask me about projects, skills, GitHub, LeetCode, or anything else! 🚀" },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text }]);
    setThinking(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: 'bot', text: getAnswer(text) }]);
      setThinking(false);
    }, 600 + Math.random() * 400);
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-glow flex items-center justify-center transition-all"
        aria-label="Open AI Assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 glass rounded-2xl border border-white/15 shadow-card overflow-hidden flex flex-col"
            style={{ maxHeight: '70vh' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-blue-600/10">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Portfolio Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-white/40">Always online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((msg, i) => <Message key={i} msg={msg} />)}
              {thinking && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-blue-400" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.span key={i} className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                        animate={{ y: [-3, 3, -3] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 px-3 py-3 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                placeholder="Ask me anything..." maxLength={300}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50" />
              <button onClick={sendMessage} disabled={!input.trim() || thinking}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-all flex-shrink-0">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
