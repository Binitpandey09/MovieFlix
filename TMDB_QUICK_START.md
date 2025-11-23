# 🚀 Quick Start: TMDB Integration

## What You Need to Do NOW:

### 1️⃣ Get TMDB API Key (5 minutes)
1. Go to https://www.themoviedb.org/signup
2. Create account
3. Go to Settings → API → Request API Key
4. Choose "Developer" → Fill form → Get API Key

### 2️⃣ Add API Key to Backend
Open `backend/.env` and replace:
```env
TMDB_API_KEY=your_tmdb_api_key_here
```

With your actual key:
```env
TMDB_API_KEY=abc123xyz456...
ENABLE_CRON=false
AUTO_IMPORT_ON_START=false
```

### 3️⃣ Restart Backend
The backend is already running. Just restart it to load the new API key.

### 4️⃣ Test the System
1. Go to http://localhost:3000
2. Login as admin
3. Click "Admin Panel"
4. Click "🎬 TMDB Manager" (first tab)
5. Click "📥 Import from TMDB"
6. Wait 10-20 seconds
7. You'll see movies imported!

### 5️⃣ Enable a Movie
1. Find any movie in the table
2. Click "Enable" button
3. Click "Manage Shows"
4. Add a showtime:
   - Date: Tomorrow's date
   - Time: 7:00 PM
   - Screen: Screen 1
   - Seats: 50
   - Price: 200
5. Click "Add Showtime"

### 6️⃣ Check Frontend
1. Go to homepage
2. Click "Now Showing" or "Coming Soon" tabs
3. You should see your enabled movie!

---

## 🎯 What's Been Built:

✅ **Backend:**
- TMDB service to fetch movies
- Auto-import functionality
- Admin routes for movie management
- Updated Movie model with TMDB fields
- Cron job support (optional)

✅ **Frontend:**
- TMDB Movie Manager component
- Enable/Disable movies
- Showtime management
- Admin dashboard integration

✅ **Features:**
- Auto-fetch from TMDB
- Admin approval workflow
- Showtime & price management
- Auto-categorization (Upcoming/Now Showing)
- High-quality posters from TMDB

---

## 📝 Important Notes:

- Movies are **disabled by default** after import
- Admin must **enable** and **add showtimes**
- Only enabled movies show on user side
- "Now Showing" requires showtimes
- "Coming Soon" shows future releases
- Cron job is **disabled** by default (set ENABLE_CRON=true to enable)

---

## 🎬 That's It!

Your hybrid TMDB movie system is ready. No more manual movie entry! 🎉
