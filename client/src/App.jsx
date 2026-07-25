import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider } from './context/PortfolioContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ExperiencePage from './pages/ExperiencePage';
import AchievementsPage from './pages/AchievementsPage';
import CertificatesPage from './pages/CertificatesPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import GitHubPage from './pages/GitHubPage';
import LeetCodePage from './pages/LeetCodePage';
import CodingProfilesPage from './pages/CodingProfilesPage';
import ResumePage from './pages/ResumePage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBlog from './pages/admin/AdminBlog';
import AdminSkills from './pages/admin/AdminSkills';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminTimeline from './pages/admin/AdminTimeline';
import AdminExperience from './pages/admin/AdminExperience';
import AdminSocial from './pages/admin/AdminSocial';
import AdminResume from './pages/admin/AdminResume';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'rgba(0,0,0,0.9)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                },
                success: { iconTheme: { primary: '#22c55e', secondary: '#000' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#000' } },
              }}
            />
            <Routes>
              {/* Public routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/experience" element={<ExperiencePage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/github" element={<GitHubPage />} />
                <Route path="/leetcode" element={<LeetCodePage />} />
                <Route path="/coding-profiles" element={<CodingProfilesPage />} />
                <Route path="/resume" element={<ResumePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin auth */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="certificates" element={<AdminCertificates />} />
                <Route path="achievements" element={<AdminAchievements />} />
                <Route path="timeline" element={<AdminTimeline />} />
                <Route path="experience" element={<AdminExperience />} />
                <Route path="social" element={<AdminSocial />} />
                <Route path="resume" element={<AdminResume />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
