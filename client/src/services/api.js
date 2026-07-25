import axios from 'axios';

// Use production URL if not in development mode
const API_URL = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : 'https://developer-portfolio-ynn2.onrender.com/api';

// Debug log
console.log('🔧 API URL:', API_URL);

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('portfolio_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if we're on an admin route AND it's a 401
    // Don't redirect for public analytics/visitor tracking calls
    if (error.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      const isPublicEndpoint = error.config?.url?.includes('/analytics/visit') ||
        error.config?.url?.includes('/contact') ||
        error.config?.url?.includes('/settings') ||
        error.config?.url?.includes('/social') ||
        error.config?.url?.includes('/projects') ||
        error.config?.url?.includes('/skills') ||
        error.config?.url?.includes('/blogs') ||
        error.config?.url?.includes('/timeline') ||
        error.config?.url?.includes('/experience') ||
        error.config?.url?.includes('/achievements') ||
        error.config?.url?.includes('/certificates') ||
        error.config?.url?.includes('/resume');

      if (isAdminRoute && !isPublicEndpoint) {
        localStorage.removeItem('portfolio_token');
        localStorage.removeItem('portfolio_admin');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth ─────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  verify: () => api.get('/auth/verify'),
};

// ─── Projects ─────────────────────────────────────────────────────────────
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getFeatured: () => api.get('/projects/featured'),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/projects/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/projects/${id}`),
};

// ─── Blogs ─────────────────────────────────────────────────────────────────
export const blogsAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getOne: (slug) => api.get(`/blogs/${slug}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
};

// ─── Skills ────────────────────────────────────────────────────────────────
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
  reorder: (data) => api.put('/skills/reorder', data),
};

// ─── Certificates ──────────────────────────────────────────────────────────
export const certificatesAPI = {
  getAll: (params) => api.get('/certificates', { params }),
  create: (data) => api.post('/certificates', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/certificates/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/certificates/${id}`),
};

// ─── Achievements ──────────────────────────────────────────────────────────
export const achievementsAPI = {
  getAll: () => api.get('/achievements'),
  create: (data) => api.post('/achievements', data),
  update: (id, data) => api.put(`/achievements/${id}`, data),
  delete: (id) => api.delete(`/achievements/${id}`),
};

// ─── Timeline ──────────────────────────────────────────────────────────────
export const timelineAPI = {
  getAll: () => api.get('/timeline'),
  create: (data) => api.post('/timeline', data),
  update: (id, data) => api.put(`/timeline/${id}`, data),
  delete: (id) => api.delete(`/timeline/${id}`),
};

// ─── Experience ────────────────────────────────────────────────────────────
export const experienceAPI = {
  getAll: () => api.get('/experience'),
  create: (data) => api.post('/experience', data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
};

// ─── Social Links ──────────────────────────────────────────────────────────
export const socialAPI = {
  getAll: () => api.get('/social'),
  update: (data) => api.put('/social', data),
};

// ─── Settings ──────────────────────────────────────────────────────────────
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// ─── Resume ────────────────────────────────────────────────────────────────
export const resumeAPI = {
  get: () => api.get('/resume'),
  upload: (data) => api.post('/resume', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  setUrl: (data) => api.post('/resume/url', data),
};

// ─── Contact ───────────────────────────────────────────────────────────────
export const contactAPI = {
  send: (data) => api.post('/contact', data),
};

// ─── Analytics ─────────────────────────────────────────────────────────────
export const analyticsAPI = {
  get: () => api.get('/analytics'),
  trackVisit: () => api.post('/analytics/visit'),
};

// ─── AI Chatbot ────────────────────────────────────────────────────────────
export const chatbotAPI = {
  ask: (message) => api.post('/chatbot', { message }),
};

// ─── GitHub (via proxy to avoid rate limits) ──────────────────────────────
export const githubAPI = {
  getProfile: (username) => api.get(`/github/${username}`),
  getRepos: (username) => api.get(`/github/${username}/repos`),
  getPinned: (username) => api.get(`/github/${username}/pinned`),
};
