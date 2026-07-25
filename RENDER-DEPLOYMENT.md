# 🚀 Render Deployment Guide

## Backend Deployment (Render)

### ✅ Fixed Issues
- ✅ Cloudinary version downgraded to v1.41.0 for compatibility
- ✅ Added Node.js version requirement (>=18.0.0)
- ✅ Fixed peer dependency conflicts
- ✅ Ready for automatic deployment

---

## 🔧 Render Configuration

### Repository Settings
- **GitHub Repo**: https://github.com/Suryanshgupta1234/Developer_Portfolio
- **Branch**: main
- **Root Directory**: `server`

### Build & Deploy Settings
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Auto-Deploy**: Yes (on every push to main)

### Region
- **Region**: Oregon (US West) or any available region

---

## ⚙️ Environment Variables

Add these in Render Dashboard → Environment tab:

```env
PORT=10000
MONGODB_URI=mongodb+srv://suryanshgupta233_db_user:suryansh2004@cluster0.5wqa3va.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=portfolio_super_secret_jwt_key_change_in_production
ADMIN_EMAIL=suryanshgupta233@gmail.com
ADMIN_PASSWORD=suryansh@2004
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Important Notes**:
- Render uses `PORT=10000` by default (don't change this)
- Update `CLIENT_URL` after deploying frontend to Vercel
- Cloudinary variables are optional (only needed for image uploads)

---

## 🎯 Deployment Steps

### 1. Wait for Current Build
- Render detected the fix and is redeploying
- Build time: ~2-3 minutes
- Watch logs for: "✅ MongoDB Connected" and "🚀 Server running on..."

### 2. Get Your Backend URL
After successful deployment:
- URL will be: `https://developer-portfolio-api-xxxx.onrender.com`
- Or: `https://your-service-name.onrender.com`

### 3. Test the API
Visit in browser:
```
https://your-render-url.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "time": "2026-07-25T..."
}
```

### 4. Test Admin Login
Use Postman or curl:
```bash
curl -X POST https://your-render-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"suryanshgupta233@gmail.com","password":"suryansh@2004"}'
```

Should return a JWT token.

---

## 📊 Deployment Status Checklist

- [ ] Repository connected to Render
- [ ] Root directory set to `server`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variables added
- [ ] Build successful (no errors)
- [ ] MongoDB connected (check logs)
- [ ] Health endpoint responding
- [ ] Admin login working
- [ ] Backend URL noted for frontend

---

## 🐛 Troubleshooting

### Build Fails with Dependency Errors
**Solution**: Already fixed! The cloudinary version is now compatible.

### MongoDB Connection Error
**Causes**:
1. MongoDB Atlas IP whitelist doesn't include Render IPs
2. Connection string incorrect

**Solution**:
1. Go to MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0` (allow all) for development
3. For production, add specific Render IPs

### Server Starts but APIs Don't Work
**Check**:
1. Environment variables are set correctly
2. `CLIENT_URL` includes your frontend domain
3. CORS is configured properly

### Admin Can't Login
**Solutions**:
1. Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in environment variables
2. Verify MongoDB connection is successful
3. Check logs for "Default admin created" message

---

## 🔄 Auto-Deployment

Render automatically redeploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Render automatically detects and redeploys
```

---

## 📝 Next Steps

After backend deployment succeeds:

1. ✅ Note your Render backend URL
2. ⏭️ Deploy frontend to Vercel
3. 🔗 Update `VITE_API_URL` in frontend
4. 🔗 Update `CLIENT_URL` in Render environment variables
5. 🎉 Full-stack app live!

---

## 🌐 Expected URLs

### Backend (Render)
- Health: `https://your-app.onrender.com/api/health`
- Auth: `https://your-app.onrender.com/api/auth/login`
- Projects: `https://your-app.onrender.com/api/projects`
- Skills: `https://your-app.onrender.com/api/skills`
- etc...

### Frontend (Vercel - deploy next)
- Main: `https://your-portfolio.vercel.app`
- Admin: `https://your-portfolio.vercel.app/admin`

---

## ⚠️ Important Notes

### Free Tier Limitations
- Render free tier spins down after 15 min of inactivity
- First request after spin-down takes ~30 seconds
- Upgrade to paid tier for always-on service

### Cold Starts
- First API call may be slow (~30s) if service is sleeping
- Subsequent calls are fast
- Keep-alive services available on paid plans

### MongoDB Atlas
- Already on cloud tier ✅
- No changes needed
- Backups enabled

---

## 🔐 Security

### Production Checklist
- [ ] Change `JWT_SECRET` to a random string (use: `openssl rand -base64 32`)
- [ ] Update `ADMIN_PASSWORD` to a very strong password
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Set `NODE_ENV=production`
- [ ] Configure HTTPS (Render does this automatically)
- [ ] Regular security updates: `npm audit fix`

---

## 📱 Monitoring

### Check Deployment Status
1. Go to Render Dashboard
2. Click on your service
3. View Logs tab for real-time logs
4. View Metrics for performance

### View Logs
```
Settings → Logs (Live tail)
```

Look for:
- "✅ MongoDB Connected"
- "🚀 Server running on http://0.0.0.0:10000"
- No error messages

---

## 🎉 Success Indicators

When deployment succeeds, you'll see in logs:
```
==> Downloading cache...
==> Running 'npm install'
==> Starting service with 'npm start'
🚀 Server running on http://0.0.0.0:10000
📁 Environment: production
✅ MongoDB Connected: ac-sejrsmz-shard-00-00.5wqa3va.mongodb.net
```

And visiting `https://your-app.onrender.com/api/health` returns:
```json
{"status":"OK","time":"..."}
```

---

**Last Updated**: ${new Date().toLocaleString()}
**Status**: Fix pushed, awaiting Render auto-deployment
