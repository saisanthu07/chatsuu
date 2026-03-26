# chatsuu — Enhanced Edition

A real-time, private-first chat platform built with React, Node.js, MongoDB, and Socket.io.

---

## ✨ What's New in This Version

### 🔐 Improved Authentication
- **Username field** added to signup — unique, lowercase, 3-30 chars
- **Login with email OR username** — flexible sign-in
- Separate, redesigned **Sign In** and **Sign Up** pages
- Back-to-home navigation on auth pages

### 🏠 Public Landing Page (`/`)
- Marketing-style home page with platform features
- How-it-works section (3 steps)
- Theme preview strip
- Testimonials
- Clear CTA buttons to Sign In / Sign Up
- Shown only to logged-out visitors

### 👥 Friend System (Friends-Only Messaging)
- **No usernames are shown globally** — users must search to find each other
- Search by name or @username (only shows non-friends / no pending)
- Send, receive, accept, or decline friend requests
- Real-time friend request notifications via Socket.io
- Sent requests tab to track pending outgoing requests
- Remove friends from chat header or friends page
- Only **accepted friends** appear in the chat sidebar
- Only **accepted friends** can message each other (enforced on backend)

### 🎨 Dedicated Themes Page (`/themes`)
- All 32 DaisyUI themes organized into categories:
  - Dark Modes, Light & Bright, Unique Vibes, Special
- Live mini chat preview per theme card
- Current theme highlighted with a checkmark
- Color swatches for each theme

### ⚙️ Settings Page (Refactored)
- Links to Themes page and Profile page
- Quick dark/light toggle
- Privacy status indicator

### 💬 Chat Improvements
- **Typing indicators** — animated dots when friend is typing
- **Message deletion** — delete your own messages (shows "deleted" state to both users)
- **Date separators** — date dividers between message groups
- **Emoji picker** — quick emoji insertion
- **Image validation** — file type and 5MB size check
- First-message empty state per conversation
- Sidebar search bar to filter friends by name/username
- Online-only filter in sidebar
- Remove friend option from chat header dropdown

### 👤 Profile Page (Enhanced)
- Inline edit mode for Full Name and Bio
- Bio field (160 chars max) displayed in profile and friends list
- Member since formatted nicely
- Shows username and email (non-editable)

---

## 🛠 Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Environment Variables

Create `backend/.env`:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### Install & Run

```bash
# From root
npm install

# Start backend (port 5001)
cd backend && npm run dev

# Start frontend (port 5173)
cd frontend && npm run dev
```

Or from root if scripts are configured:
```bash
npm run dev
```

### Build for Production
```bash
cd frontend && npm run build
cd backend && npm start
```

---

## 📁 Project Structure

```
chatsuu/
├── backend/
│   └── src/
│       ├── controllers/
│       │   ├── auth.controller.js      # signup/login/logout/updateProfile
│       │   ├── message.controller.js   # friends-only messaging + delete
│       │   └── friend.controller.js    # search/request/accept/remove
│       ├── models/
│       │   ├── user.model.js           # + username, bio, lastSeen
│       │   ├── message.model.js        # + deleted, reactions
│       │   └── friendRequest.model.js  # NEW — pending/accepted/rejected
│       ├── routes/
│       │   ├── auth.route.js
│       │   ├── message.route.js
│       │   └── friend.route.js         # NEW
│       ├── lib/
│       │   └── socket.js               # + typing events
│       └── middleware/
│           └── auth.middleware.js
└── frontend/
    └── src/
        ├── pages/
        │   ├── LandingPage.jsx         # NEW — public home
        │   ├── LoginPage.jsx           # redesigned
        │   ├── SignUpPage.jsx          # + username field
        │   ├── HomePage.jsx            # chat app shell
        │   ├── FriendsPage.jsx         # NEW — full friend management
        │   ├── ThemesPage.jsx          # NEW — categorised theme picker
        │   ├── SettingsPage.jsx        # refactored
        │   └── ProfilePage.jsx         # + bio, edit mode
        ├── components/
        │   ├── Navbar.jsx              # + friends badge, themes link
        │   ├── Sidebar.jsx             # friends-only + search
        │   ├── ChatContainer.jsx       # + typing, delete, date separators
        │   ├── ChatHeader.jsx          # + remove friend menu
        │   └── MessageInput.jsx        # + typing events, emoji, validation
        └── store/
            ├── useAuthStore.js
            ├── useChatStore.js         # + delete, typing
            ├── useFriendStore.js       # NEW
            └── useThemeStore.js
```

---

## 🔌 API Endpoints

### Auth (`/api/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/signup` | Register (fullName, username, email, password) |
| POST | `/login` | Login (identifier = email or username, password) |
| POST | `/logout` | Logout |
| PUT | `/update-profile` | Update profilePic, fullName, bio |
| GET | `/check` | Check auth session |

### Messages (`/api/messages`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | Get friend list for sidebar |
| GET | `/:id` | Get messages with a friend |
| POST | `/send/:id` | Send message to a friend |
| DELETE | `/:messageId` | Delete own message |

### Friends (`/api/friends`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/search?query=` | Search users (excludes friends + pending) |
| GET | `/` | Get all accepted friends |
| GET | `/pending` | Get incoming pending requests |
| GET | `/sent` | Get outgoing pending requests |
| POST | `/request/:receiverId` | Send a friend request |
| PUT | `/request/:requestId` | Accept or reject a request |
| DELETE | `/:friendId` | Remove a friend |

---

## 🌐 Socket Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `getOnlineUsers` | server → all | `[userId, ...]` |
| `newMessage` | server → receiver | message object |
| `messageDeleted` | server → receiver | messageId |
| `typing` | client → server | `{ receiverId }` |
| `stopTyping` | client → server | `{ receiverId }` |
| `userTyping` | server → receiver | `{ senderId }` |
| `userStopTyping` | server → receiver | `{ senderId }` |
| `newFriendRequest` | server → receiver | `{ request, sender }` |
| `friendRequestResponse` | server → sender | `{ requestId, action }` |
