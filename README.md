# 🚀 Full Stack Developer Portfolio

A modern, fully responsive portfolio website built with the MERN stack featuring real-time LeetCode integration, GitHub stats dashboard, admin panel for content management, and much more.

![Portfolio](https://img.shields.io/badge/Portfolio-Live-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🎨 Frontend
- **Modern UI/UX** with Tailwind CSS and Framer Motion animations
- **Dark/Light Theme** toggle with persistent preferences
- **Fully Responsive** design for all devices
- **Interactive Components** including particle backgrounds, custom cursor, and command palette
- **SEO Optimized** with meta tags and Open Graph support

### 📊 Live Integrations
- **LeetCode Dashboard**
  - Real-time problem-solving stats (Easy/Medium/Hard)
  - 52-week activity heatmap (similar to GitHub)
  - Auto-updates daily with smart caching
  - Direct GraphQL + REST API integration

- **GitHub Dashboard**
  - Live repository statistics
  - Language distribution charts
  - Contribution graphs
  - Repository showcases

### 🎯 Dynamic Content Management
- **Admin Panel** for complete content control
- **Projects** - Add, edit, delete with images and links
- **Blog** - Full-featured blogging system with rich text
- **Skills** - Categorized skill management with progress bars
- **Experience** - Timeline-based work experience
- **Certificates** - Showcase certifications with images
- **Achievements** - Highlight accomplishments
- **Resume** - Upload and manage PDF resume

### 🔐 Authentication & Security
- JWT-based authentication
- bcrypt password hashing
- Protected admin routes
- CORS configuration
- Rate limiting
- Helmet.js security headers

### 🎨 Additional Features
- AI Chatbot for portfolio queries
- Contact form with EmailJS integration
- Scroll progress indicator
- Back to top button
- Command palette (Ctrl+K)
- Page transitions
- Analytics tracking ready

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Image hosting (optional)

### APIs & Integrations
- LeetCode GraphQL API
- GitHub REST API
- EmailJS (contact form)
- Cloudinary (media uploads)

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- npm or pnpm
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Suryanshgupta1234/Developer_Portfolio.git
cd Developer_Portfolio
```

### 2. Install dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 3. Environment Setup

Create `.env` files in both server and client directories:

**server/.env:**
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
ADMIN_EMAIL=your_email@example.com
ADMIN_PASSWORD=your_secure_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**client/.env:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GITHUB_USERNAME=your_github_username
VITE_LEETCODE_USERNAME=your_leetcode_username
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### 4. Create Admin User

```bash
cd server
npm run update-admin
```

### 5. Start Development Servers

**Backend (Terminal 1):**
```bash
cd server
npm start
```

**Frontend (Terminal 2):**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` to see your portfolio!

## 🎯 Usage

### Admin Panel
1. Navigate to `http://localhost:5173/admin/login`
2. Login with your admin credentials
3. Manage all content from the dashboard

### Adding Content
- **Projects**: Add your projects with images, descriptions, and links
- **Blog Posts**: Write blog articles with rich text formatting
- **Skills**: Categorize and rate your technical skills
- **Experience**: Add your work experience timeline
- **Certificates**: Upload certification images
- **Achievements**: Highlight your accomplishments

## 📂 Project Structure

```
Developer_Portfolio/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── common/    # Shared components
│   │   │   ├── layout/    # Layout components
│   │   │   ├── sections/  # Page sections
│   │   │   └── ui/        # UI components
│   │   ├── context/       # React Context API
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Page layouts
│   │   ├── pages/         # Route pages
│   │   │   └── admin/     # Admin panel pages
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Root component
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── scripts/          # Helper scripts
│   └── server.js         # Entry point
│
├── .gitignore
├── README.md
└── package.json
```

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Backend (Render/Railway)
1. Create new web service
2. Connect GitHub repository
3. Add environment variables
4. Set build command: `cd server && npm install`
5. Set start command: `cd server && npm start`
6. Deploy!

### Database
MongoDB Atlas is already cloud-based and production-ready!

## 🔒 Security Notes

- ⚠️ **NEVER commit `.env` files**
- ⚠️ Change default JWT secret and admin password
- ⚠️ Use strong passwords in production
- ⚠️ Enable MongoDB Atlas IP whitelist
- ⚠️ Use HTTPS in production
- ⚠️ Regular security audits: `npm audit`

## 📝 Available Scripts

### Server
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run update-admin` - Update admin credentials

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Suryansh Gupta**

- GitHub: [@Suryanshgupta1234](https://github.com/Suryanshgupta1234)
- LeetCode: [@suryansh07102004](https://leetcode.com/u/suryansh07102004/)
- Email: suryanshgupta233@gmail.com

## 🙏 Acknowledgments

- Inspired by modern portfolio designs
- LeetCode API integration
- MongoDB Atlas for cloud database
- All the amazing open-source libraries used

## 📸 Screenshots

(Add screenshots of your portfolio here after deployment)

---

⭐ Star this repo if you found it helpful!
