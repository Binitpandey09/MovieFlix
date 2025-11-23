# 🎬 TMDB Integration Setup Guide

## Overview
Your MovieFlix system now has **automatic movie import from TMDB** (The Movie Database). This allows you to:
- Auto-fetch upcoming and now-playing movies
- Let admin approve which movies to show
- Automatically categorize movies as "Upcoming" or "Now Showing"
- No manual movie entry needed!

---

## 🔑 Step 1: Get TMDB API Key

1. Go to https://www.themoviedb.org/
2. Create a free account
3. Go to Settings → API
4. Request an API key (choose "Developer" option)
5. Fill out the form (use "Educational" or "Personal" purpose)
6. Copy your API Key (v3 auth)

---

## ⚙️ Step 2: Configure Backend

1. Open `backend/.env`
2. Add your TMDB API key:
   ```env
   TMDB_API_KEY=your_actual_api_key_here
   ENABLE_CRON=true
   AUTO_IMPORT_ON_START=false
   ```

3. **Configuration Options:**
   - `TMDB_API_KEY`: Your TMDB API key (required)
   - `ENABLE_CRON=true`: Enables daily auto-import at 3 AM
   - `AUTO_IMPORT_ON_START=true`: Imports movies when server starts

---

## 🚀 Step 3: Start the System

1. **Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm start
   ```

---

## 📋 Step 4: Import Movies (Admin)

1. Login as admin
2. Go to **Admin Panel**
3. Click **"🎬 TMDB Manager"** tab
4. Click **"📥 Import from TMDB"** button
5. Wait for import to complete (shows count of imported movies)

---

## ✅ Step 5: Enable Movies for Booking

For each movie you want to show on the website:

1. Find the movie in TMDB Manager table
2. Click **"Enable"** button
3. Click **"Manage Shows"** button
4. Add showtimes:
   - Date
   - Time
   - Screen (Screen 1, 2, or 3)
   - Total Seats
   - Price
5. Click **"Add Showtime"**

---

## 🎯 How It Works

### User Side:
- **"Now Showing"** tab: Shows movies that are:
  - Released (releaseDate ≤ today)
  - Enabled by admin
  - Have showtimes added

- **"Coming Soon"** tab: Shows movies that are:
  - Not yet released (releaseDate > today)
  - Enabled by admin

- **"Movies"** tab: Shows all enabled movies

### Admin Side:
- Import movies from TMDB (upcoming + now playing)
- Movies are **disabled by default**
- Admin enables movies and adds showtimes
- Only enabled movies appear on user side

---

## 🔄 Auto-Import Schedule

If `ENABLE_CRON=true`:
- Movies auto-import **daily at 3 AM**
- Updates existing movies
- Adds new releases
- Preserves admin settings (enabled status, showtimes)

---

## 📊 Movie Data Imported

From TMDB, we import:
- Title
- Overview/Description
- Poster image
- Backdrop image
- Release date
- Genres
- Rating (vote average)
- Runtime
- Language

---

## 🛠️ API Endpoints

### Admin Routes (Protected):
- `POST /api/tmdb/fetch` - Import movies from TMDB
- `GET /api/tmdb/all` - Get all TMDB movies
- `PUT /api/tmdb/:movieId/enable` - Enable movie
- `PUT /api/tmdb/:movieId/disable` - Disable movie
- `POST /api/tmdb/:movieId/showtime` - Add showtime
- `DELETE /api/tmdb/:movieId/showtime/:showtimeId` - Remove showtime
- `PUT /api/tmdb/:movieId/price` - Set default price

### User Routes:
- `GET /api/movies?status=now_showing` - Get now showing movies
- `GET /api/movies?status=coming_soon` - Get upcoming movies
- `GET /api/movies` - Get all enabled movies

---

## 🎨 Features

✅ **Automatic movie import from TMDB**
✅ **Admin approval workflow**
✅ **Showtime management**
✅ **Price control per showtime**
✅ **Multiple screens support**
✅ **Auto-categorization (Upcoming/Now Showing)**
✅ **Daily cron job for updates**
✅ **High-quality posters and backdrops**
✅ **TMDB ratings displayed**
✅ **Hybrid system (TMDB + manual movies)**

---

## 🐛 Troubleshooting

### Movies not importing?
- Check TMDB_API_KEY in .env
- Check backend console for errors
- Verify internet connection
- Check TMDB API status

### Movies not showing on frontend?
- Make sure movie is **enabled** in admin panel
- Add at least one **showtime** for "Now Showing"
- Check if release date is correct
- Verify frontend is connected to backend

### Cron job not running?
- Set `ENABLE_CRON=true` in .env
- Restart backend server
- Check server logs at 3 AM

---

## 📝 Notes

- TMDB API has rate limits (check their docs)
- Free tier: 40 requests per 10 seconds
- Import runs once per day to respect limits
- Manual import available anytime via admin panel
- Old manual movies still work alongside TMDB movies

---

## 🎓 Resume-Ready Features

This system demonstrates:
- **Third-party API integration** (TMDB)
- **Cron job scheduling** (node-cron)
- **Hybrid data management** (auto + manual)
- **Admin approval workflow**
- **Real-time data synchronization**
- **RESTful API design**
- **React admin dashboard**
- **MongoDB data modeling**
- **Authentication & authorization**
- **Production-ready architecture**

---

## 🚀 Next Steps

1. Get TMDB API key
2. Add to backend/.env
3. Restart backend
4. Import movies via admin panel
5. Enable movies and add showtimes
6. Test on frontend!

**Enjoy your automated movie booking system! 🎬🍿**
