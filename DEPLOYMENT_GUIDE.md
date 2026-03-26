# Deployment Guide: Render vs Vercel

## 📋 Prerequisites
- GitHub repository with both frontend and backend code
- MongoDB Atlas account (free tier available)
- Cloudinary account (for image uploads)

---

## **🚀 OPTION 1: RENDER (RECOMMENDED - Simpler Setup)**

### Best for: Full-stack deployment in one place

#### Step 1: Prepare Backend for Render

1. Create `backend/.env.production`:
```
NODE_ENV=production
PORT=3000
MONGODB_URI=your_mongodb_atlas_url
JWT_SECRET=your_random_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://chatsuu-frontend.onrender.com
```

2. Push to GitHub:
```bash
git add .
git commit -m "Add deployment configs"
git push
```

#### Step 2: Deploy Backend on Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Name**: `chatsuu-backend`
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: . (current)
   - **Plan**: Free (or Paid)

6. Add Environment Variables:
   - Copy all values from `.env.production`
7. Deploy

8. **Copy Backend URL** (e.g., `https://chatsuu-backend.onrender.com`)

#### Step 3: Deploy Frontend on Render

1. Click "New +" → "Static Site"
2. Connect same GitHub repo
3. Configure:
   - **Name**: `chatsuu-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Root Directory**: `.`

4. Add Environment Variables:
   - Key: `VITE_API_URL`
   - Value: `https://chatsuu-backend.onrender.com` (from Step 2)

5. Deploy

✅ **Both frontend and backend live on Render!**

---

## **⚡ OPTION 2: VERCEL + RENDER (Alternative)**

### Best for: Fast frontend on Vercel, backend on Render

#### Step 1: Deploy Backend on Render (Same as above)

#### Step 2: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://chatsuu-backend.onrender.com`

7. Deploy

✅ **Frontend on Vercel, Backend on Render!**

---

## **🛠️ Environment Variables Setup**

### Backend Required Variables:
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-random-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend Required Variables:
```
VITE_API_URL=https://your-backend-url.com
```

---

## **🔗 Connect Services**

### Update CORS in Backend
Make sure `backend/src/index.js` has proper CORS:

```javascript
app.use(cors({ 
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  credentials: true 
}));
```

---

## **📊 Database Setup**

1. Go to [mongo.db.com](https://mongodb.com)
2. Create free cluster
3. Create database user with password
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority`
5. Add to environment variables

---

## **🖼️ Cloudinary Setup**

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up (free tier available)
3. Dashboard shows:
   - Cloud Name
   - API Key
   - API Secret
4. Add to environment variables

---

## **✅ Testing Deployment**

1. **Backend Health Check**:
   - Visit: `https://chatsuu-backend.onrender.com/api/auth` (should show route info)

2. **Frontend Loading**:
   - Visit your frontend URL
   - Open DevTools Console
   - Check if API calls work

3. **Live Chat Test**:
   - Login with test account
   - Try sending messages
   - Check socket connection

---

## **⚠️ Common Issues & Fixes**

| Issue | Solution |
|-------|----------|
| CORS Error | Update `FRONTEND_URL` in backend env vars |
| 404 on routes | Check `Build Command` includes correct path |
| Blank page | Check browser console for API errors |
| Environmental variables not loading | Redeploy after updating env vars |
| Socket.io not connecting | Ensure origin includes correct frontend URL |

---

## **📱 Quick Reference**

| Service | Type | URL |
|---------|------|-----|
| Backend | Render Web | `https://chatsuu-backend.onrender.com` |
| Frontend | Render Static | `https://chatsuu-frontend.onrender.com` |
| **OR** |  |  |
| Frontend | Vercel | `https://chatsuu.vercel.app` |
| Backend | Render Web | `https://chatsuu-backend.onrender.com` |

---

## **🎯 Next Steps**

1. ✅ Create environment files
2. ✅ Push to GitHub
3. ✅ Connect services to platforms
4. ✅ Add environment variables
5. ✅ Deploy
6. ✅ Test all features
7. ✅ Monitor logs in dashboard

