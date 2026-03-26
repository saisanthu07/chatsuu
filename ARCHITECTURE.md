# 🏗️ Architecture Overview

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     END USERS' COMPUTERS                    │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ HTTPS Requests
                    ┌─────────┴─────────┐
                    │                   │
         ┌──────────▼───────────┐   ┌──▼──────────────────┐
         │  RENDER STATIC SITE  │   │  VERCEL (Optional)  │
         │   chatsuu-frontend   │   │   chatsuu.vercel    │
         │   (React/Vite Build) │   │   (React/Vite Build)│
         │                      │   │                     │
         │  - Loads HTML/CSS/JS │   │  - Serves Frontend  │
         └──────────┬───────────┘   └──────────┬──────────┘
                    │                         │
                    └────────────┬────────────┘
                                 │ API Requests
                    ┌────────────▼─────────┐
                    │  RENDER WEB SERVICE  │
                    │  chatsuu-backend     │
                    │  (Node.js/Express)   │
                    │                      │
                    │  - Handles API calls │
                    │  - WebSocket/Socket  │
                    │  - User Auth         │
                    └────────────┬─────────┘
                                 │ Database
                    ┌────────────▼─────────┐
                    │   MONGODB ATLAS      │
                    │   (Managed Database) │
                    │                      │
                    │  - Stores Users      │
                    │  - Stores Messages   │
                    │  - Stores Friends    │
                    └──────────────────────┘
                                 │
                    ┌────────────▼──────┐
                    │   CLOUDINARY       │
                    │   (Image Storage)  │
                    │                    │
                    │  - Profile Pics    │
                    │  - User Images     │
                    └────────────────────┘
```

---

## Option A: RENDER ONLY (Simplest)

```
Your GitHub Repo
        │
        ├─ /backend ──────┐
        │                 │
        ├─ /frontend ─┐   │
        │             │   │
        │             │   │
    Render            │   │
        │             │   │
        │       ┌─────▼───▼─────────┐
        │       │  Render Service 1  │
        │       │  Web Service       │
        │       │  (Backend + Built  │
        │  ┌────│   Frontend Files)  │
        │  │    │  Port: 3000        │
        │  │    └────────────────────┘
        │  │
        └──┤    ┌─────────────────┐
           ├────│  MongoDB Atlas  │
           │    │  (Cloud DB)     │
           │    └─────────────────┘
           │
           └────┐
                │ Cloudinary
                │ (Image CDN)
```

---

## Option B: VERCEL + RENDER

```
Your GitHub Repo
        │
        ├─ /backend ──────┐
        │                 │
        ├─ /frontend ─┐   │
        │             │   │
        │          Vercel │
        │             │   │
        │       ┌─────▼───│──────────┐
        │       │  Vercel Static     │
        │   ┌───│  Site              │
        │   │   │  (Frontend Only)   │
        │   │   │  https://app.url   │
        │   │   └────────────────────┘
        │   │
        │   │  Render
        │   │
        │   │
    ────┼───▼────────────────────┐
            │  Render Web Service │
            │  (Backend)          │
            │  Port: 3000         │
            └────────────────────┘
                     │
                     ├─── MongoDB
                     │
                     └─── Cloudinary
```

---

## Request Flow - Simple Version

### User Opens App
```
1. Browser → Render Frontend (or Vercel)
2. HTML/CSS/JS loads
3. User sees chat interface
```

### User Sends Message
```
1. Browser →─────────────────→ Render Backend API (/api/messages)
2. Backend validates message
3. Backend stores in MongoDB
4. Backend sends to Socket.io
5. Backend ←──────────────────← Browser
6. Other users receive via WebSocket
```

### User Uploads Profile Picture
```
1. Browser → Cloudinary (Upload)
2. Browser → Backend (Save URL to MongoDB)
3. All users see new picture
```

---

## Services & Their Roles

| Service | Role | Free Tier | Location |
|---------|------|-----------|----------|
| **GitHub** | Code Repository | ✅ | github.com |
| **Render** | Web Hosting | ✅ Limited | render.com |
| **Vercel** | Frontend Hosting | ✅ | vercel.com |
| **MongoDB Atlas** | Database | ✅ 512MB | mongodb.com |
| **Cloudinary** | Image Storage | ✅ | cloudinary.com |

---

## Data Flow Summary

```
Frontend (React)
    ↓
Makes API Call (HTTP/WebSocket)
    ↓
Backend (Express.js)
    ↓
├─ Queries Database (MongoDB)
│
├─ Uploads to Cloudinary
│
└─ Sends Response Back
    ↓
Frontend Receives & Updates UI
    ↓
User Sees Changes
```

---

## Environment Variables Flow

```
Your .env files (Local - NOT on GitHub)
    ↓
You set them in Render Dashboard
    ↓
Render injects them into running application
    ↓
Backend code uses: process.env.MONGODB_URI
    ↓
Frontend code uses: import.meta.env.VITE_API_URL
```

---

## Deployment Process

```
1. Write Code
    ↓
2. Commit to GitHub
    ↓
3. Render detects new commit (webhook)
    ↓
4. Render pulls latest code
    ↓
5. Render builds (npm install, npm run build)
    ↓
6. Render runs your start command
    ↓
7. Your app is LIVE! 🎉
    ↓
8. Any code changes → push → auto-redeploy
```

