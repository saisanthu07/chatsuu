# 🔧 Troubleshooting & FAQ

## Common Issues & Solutions

### 1. **CORS Error: "Access to XMLHttpRequest blocked"**

**Problem**: Frontend can't reach backend API

**Solution**:
1. Check backend environment variable: `FRONTEND_URL`
2. Make sure it matches your actual frontend domain
3. Redeploy backend after updating
4. In browser DevTools → Network tab → check request headers

```javascript
// Verify in backend/src/index.js
app.use(cors({ 
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  credentials: true 
}));
```

---

### 2. **Blank Page on Frontend**

**Problem**: Frontend loads white/blank screen

**Solutions**:
1. Check browser console (F12 → Console tab) for errors
2. Verify `VITE_API_URL` environment variable is set
3. Make sure build folder is correct (`frontend/dist`)
4. Clear browser cache: Ctrl+Shift+Delete

**On Render**:
- Go to Static Site → Settings → Redirects
- Add: `/*` → `/index.html`

---

### 3. **"Cannot GET /" Error**

**Problem**: Backend returns 404 on root path

**Solution**:
- This is normal! The backend doesn't have a root route
- Test instead: `https://your-backend.onrender.com/api/auth`
- Should return `{"message": "endpoint not found"}` or similar

---

### 4. **MongoDB Connection Timeout**

**Problem**: Backend crashes with MongoDB error

**Solutions**:
1. Check MongoDB connection string format:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```
2. Verify IP whitelist on MongoDB Atlas:
   - Go to Network Access
   - Add `0.0.0.0/0` for Render (allows any IP)
3. Check username/password don't have special characters (URL encode them)

---

### 5. **Cloudinary Upload Fails**

**Problem**: Image upload not working

**Solutions**:
1. Verify all Cloudinary credentials:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
2. Check API Secret is different from API Key
3. Regenerate credentials if unsure

---

### 6. **Socket.io Not Connecting (No Real-time Chat)**

**Problem**: Real-time features not working

**Solutions**:
1. Check that backend is actually running
2. Verify `FRONTEND_URL` includes protocol (https:// not http://)
3. Check Render logs for socket errors
4. Make sure Socket.io is imported: `socket.io`

---

### 7. **Build Fails: "Cannot find module"**

**Problem**: Deployment build command fails

**Solutions**:
1. For Render Web Service:
   ```
   Build Command: cd backend && npm install
   ```
   
2. For Render Static Site:
   ```
   Build Command: cd frontend && npm install && npm run build
   ```

3. Make sure you don't have the `root directory` set to a subfolder

---

### 8. **Environment Variables Not Loading**

**Problem**: Env vars show as undefined

**Solutions**:
1. Go to Render Dashboard → Services → Settings → Environment
2. Verify variables are typed correctly
3. **Redeploy** after adding/changing variables
4. Wait 30 seconds for variables to reload

---

### 9. **Free Tier Spinning (Service Sleeping)**

**Problem**: Site is very slow, takes 30+ seconds to load

**Reason**: Render free tier sleeps after 15 min of inactivity

**Solutions**:
1. Upgrade to paid tier ($7/month)
2. Use Render Cron Job to ping every 14 minutes
3. Use Uptime Robot to keep services awake

---

### 10. **"Port Already in Use" Error**

**Problem**: Backend won't start, port conflict

**Solution**:
- Change PORT in `.env`: `PORT=3000` (Render ignores this, uses random)
- Locally, kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5001
  taskkill /PID <PID> /F
  ```

---

## 🧪 Testing Checklist

### Backend Tests
- [ ] API responds at `https://your-backend-url/api/auth`
- [ ] MongoDB connection works (check Render logs)
- [ ] Cloudinary credentials work (test upload)
- [ ] CORS allows frontend domain

### Frontend Tests
- [ ] Page loads and looks correct
- [ ] API calls work (DevTools Network tab)
- [ ] Console has no errors
- [ ] Images load properly

### Full App Tests
- [ ] Sign up works
- [ ] Login works
- [ ] Send message works
- [ ] Receive message in real-time
- [ ] Friend requests work
- [ ] Profile updates work

---

## 📊 Monitor Your Deployment

### Render Dashboard
1. Go to your service
2. Click "Logs" to see errors
3. Check "Events" for deployment status
4. Monitor CPU/Memory usage

### Check Live Status
```bash
# Test backend
curl https://your-backend.onrender.com/api/auth

# Test frontend
Visit https://your-frontend.onrender.com/
Open DevTools (F12) → Console tab
```

---

## 🔍 Debug Commands

### Check Environment Variables
```bash
# In Render terminal (if web service)
echo $MONGODB_URI
echo $FRONTEND_URL
```

### Check Logs
- **Render**: Dashboard → Logs
- **Vercel**: Dashboard → Deployments → View Logs
- **Browser**: F12 → Console tab

### Network Debugging
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check failed requests
5. Click request → Response tab for error details

---

## 📞 Getting Help

1. **Check logs first** - 90% of issues are in logs
2. **Read error messages carefully** - They usually tell you what's wrong
3. **Verify environment variables** - Most issues are missing/wrong env vars
4. **Check .env files exist** locally
5. **Clear cache** and hard reload (Ctrl+Shift+R)

---

## 💡 Pro Tips

- Use `VITE_API_URL=http://localhost:5001/api` in frontend `.env.development`
- Use `VITE_API_URL=https://your-backend.onrender.com` in `.env.production`
- Test locally before deploying: `npm run dev` in both folders
- Keep environment variables secret - never commit `.env`
- Use `.env.example` to document required variables
- Redeploy after EVERY environment variable change

---

**Still stuck?** Check the `DEPLOYMENT_GUIDE.md` or `QUICK_DEPLOY.md` files!

