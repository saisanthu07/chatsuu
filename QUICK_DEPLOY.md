# Quick Start Deployment Commands

## Step 1: Make sure to push to GitHub
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

## Step 2: Create .env files locally (DON'T commit these!)

### Backend (.env in backend folder):
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/chatsuu
JWT_SECRET=your_super_secret_random_string_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env in frontend folder):
```
VITE_API_URL=https://your-backend-domain.com
```

## Step 3: Deploy on RENDER

### A) Deploy Backend
1. Open [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Add all environment variables from your .env
6. Click Deploy
7. Copy the generated URL (e.g., https://chatsuu-backend.onrender.com)

### B) Deploy Frontend
1. New → Static Site
2. Connect same GitHub repo
3. Settings:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
4. Add environment variable:
   - VITE_API_URL = https://chatsuu-backend.onrender.com (from step A7)
5. Click Deploy

## Step 4: Deploy on VERCEL (If using Vercel instead of Render for frontend)

1. Open [vercel.com](https://vercel.com)
2. New Project
3. Import your GitHub repo
4. Configure:
   - Framework: Vite
   - Root Directory: frontend
   - Build: npm run build
   - Output: dist
5. Add environment: VITE_API_URL = your-backend-url
6. Deploy

## Verify Deployment

```bash
# Test backend is running
curl https://your-backend-url/api/auth

# Frontend should load
Visit https://your-frontend-url in browser
```

