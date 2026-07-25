export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'suryansh07102004';
export const LEETCODE_USERNAME = import.meta.env.VITE_LEETCODE_USERNAME || 'suryansh07102004';

export const TYPING_ROLES = [
  'Software Engineer',
  'MERN Stack Developer',
  'Java Developer',
  'Machine Learning Enthusiast',
  'Problem Solver',
  'Open to Opportunities',
];

export const SKILL_CATEGORIES = [
  'All',
  'Programming',
  'Frontend',
  'Backend',
  'Machine Learning',
  'Tools',
];

export const PROJECT_CATEGORIES = [
  'All',
  'Full Stack',
  'Machine Learning',
  'React',
  'Node',
  'Java',
];

export const BLOG_CATEGORIES = [
  'All',
  'Java',
  'React',
  'Node',
  'Machine Learning',
  'Interview Experience',
  'DSA',
];

export const SORT_OPTIONS = [
  { label: 'Latest', value: 'latest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Alphabetical', value: 'alpha' },
];

// ── Your real social links ─────────────────────────────────────────────────
export const SOCIAL_LINKS = {
  github: 'https://github.com/suryansh07102004',
  linkedin: 'https://linkedin.com/in/suryansh-gupta-dev',
  leetcode: 'https://leetcode.com/u/suryansh07102004/',
  email: 'suryanshgupta233@gmail.com',
  phone: '+91 9119858959',
  location: 'Gorakhpur, Uttar Pradesh, India',
};

export const NAV_LINKS = [
  { label: 'Home', href: '/', exact: true },
  { label: 'About', href: '/about' },
  { label: 'Skills', href: '/skills' },
  { label: 'Projects', href: '/projects' },
  { label: 'Experience', href: '/experience' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

// ── Your real personal data (used as fallback when DB is empty) ────────────
export const PERSONAL_DATA = {
  name: 'Suryansh Gupta',
  tagline: 'Developer.',
  bio: 'Motivated CSE undergrad from PSIT Kanpur building full-stack apps with MERN, Java, and ML. 250+ LeetCode problems, 5-star HackerRank, and a passion for shipping impactful products.',
  location: 'Gorakhpur, Uttar Pradesh',
  phone: '+91 9119858959',
  email: 'suryanshgupta233@gmail.com',
  college: 'Pranveer Singh Institute of Technology, Kanpur',
  cgpa: '7.97 / 10',
  batch: '2023 – 2027',
  branch: 'B.Tech CSE (IoT)',
};
