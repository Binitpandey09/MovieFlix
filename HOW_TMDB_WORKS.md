# 🎬 How TMDB Integration Works - Complete Guide

## 📋 Overview

Your MovieFlix system now has **two types of movies**:
1. **Manual Movies** - Movies you added manually (old system)
2. **TMDB Movies** - Movies imported automatically from TMDB (new system)

Both types work together in a **hybrid system**.

---

## 🔄 How It Works: Admin to User

### Step 1: Import Movies (Admin)
**Location:** Admin Panel → 🎬 TMDB Manager

**What happens:**
1. Click "📥 Import from TMDB" button
2. System fetches latest movies from TMDB API:
   - **Now Playing** movies (currently in theaters)
   - **Upcoming** movies (releasing soon)
3. Movies are saved to database with:
   - Title, description, poster, backdrop
   - Release date, genres, rating
   - **Status: DISABLED by default**

**Result:** 33+ movies imported, but **NOT visible to users yet**

---

### Step 2: Enable Movies (Admin)
**Location:** Admin Panel → 🎬 TMDB Manager → Table

**What you see:**
- List of all TMDB movies
- Each movie shows:
  - Poster image
  - Title & genre
  - Release date
  - Status (Enabled/Disabled)
  - Rating
  - Number of showtimes

**Actions:**
- **Enable Button:** Makes movie visible to users
- **Disable Button:** Hides movie from users
- **Manage Shows Button:** Add/remove showtimes

**How Enable Works:**
1. Click "Enable" on any movie
2. Movie status changes to "✓ Enabled"
3. Movie is now **visible on homepage**
4. Users can see it but **cannot book yet** (needs showtimes)

---

### Step 3: Add Showtimes (Admin)
**Location:** Click "Manage Shows" on any enabled movie

**What you do:**
1. Fill showtime form:
   - **Date:** When movie will play (e.g., 2024-12-25)
   - **Time:** Show timing (e.g., 19:00 for 7 PM)
   - **Screen:** Which screen (Screen 1, 2, or 3)
   - **Seats:** Total seats available (e.g., 50)
   - **Price:** Ticket price (e.g., ₹200)
2. Click "Add Showtime"
3. Showtime appears in table below

**Result:** Movie is now **bookable by users**

---

### Step 4: Users See Movies (User Side)

**Homepage Tabs:**

**1. Now Showing Tab:**
- Shows movies where:
  - ✅ Release date ≤ today (already released)
  - ✅ Admin enabled the movie
  - ✅ Has at least one showtime
- Users can click and book tickets

**2. Coming Soon Tab:**
- Shows movies where:
  - ✅ Release date > today (future release)
  - ✅ Admin enabled the movie
- Users can see details but cannot book yet

**3. Movies Tab:**
- Shows all enabled movies
- Mix of now showing and coming soon

---

## 🔍 What Happened to Your Old Movies?

### Your Manual Movies Are Still There!

**Where to find them:**
- Admin Panel → "View Movies & Banners" tab
- These are your **manually added movies**
- They still work exactly as before

**Why you don't see them on homepage:**
- The new movie filtering logic looks for `isEnabled: true`
- Your old movies don't have this field
- They need to be migrated

**Solution:**
You have two options:

**Option 1: Keep Both Systems**
- Old manual movies in "View Movies & Banners"
- New TMDB movies in "TMDB Manager"
- Both work independently

**Option 2: Migrate Old Movies**
- I can update your old movies to work with new system
- Add `isEnabled: true` to existing movies
- They'll appear alongside TMDB movies

---

## 📊 Movie Status Flow

```
TMDB API
   ↓
Import (Admin clicks button)
   ↓
Movies saved to database
   ↓
Status: DISABLED (not visible to users)
   ↓
Admin clicks "Enable"
   ↓
Status: ENABLED (visible on homepage)
   ↓
Admin adds showtimes
   ↓
Users can book tickets
```

---

## 🎯 Key Concepts

### 1. Import
- **What:** Fetches movies from TMDB API
- **When:** Manual (click button) or Auto (daily at 3 AM if enabled)
- **Result:** Movies in database, disabled by default
- **User sees:** Nothing (movies are hidden)

### 2. Enable
- **What:** Makes movie visible to users
- **When:** Admin clicks "Enable" button
- **Result:** Movie appears on homepage
- **User sees:** Movie card on homepage

### 3. Disable
- **What:** Hides movie from users
- **When:** Admin clicks "Disable" button
- **Result:** Movie removed from homepage
- **User sees:** Nothing (movie is hidden)

### 4. Showtimes
- **What:** Specific date/time when movie plays
- **When:** Admin adds via "Manage Shows"
- **Result:** Users can book tickets
- **User sees:** Available time slots for booking

---

## 🔄 Hybrid System Explained

### Two Movie Types:

**1. Manual Movies (Old System)**
- Location: "View Movies & Banners" tab
- Added manually by admin
- Fields: title, description, genre, rating, image, cities
- Status: Always visible (no enable/disable)

**2. TMDB Movies (New System)**
- Location: "TMDB Manager" tab
- Imported from TMDB API
- Fields: title, description, poster, backdrop, genres, rating, tmdbId
- Status: Disabled by default, admin enables

### Why Hybrid?
- **Flexibility:** Use TMDB for most movies
- **Control:** Add manual movies if not on TMDB
- **Backward Compatible:** Old movies still work

---

## 📝 Example Workflow

### Scenario: Adding "Deadpool 3" for booking

**Step 1: Import**
- Go to TMDB Manager
- Click "Import from TMDB"
- "Deadpool 3" appears in table (disabled)

**Step 2: Enable**
- Find "Deadpool 3" in table
- Click "Enable" button
- Status changes to "✓ Enabled"

**Step 3: Add Showtimes**
- Click "Manage Shows"
- Add showtime:
  - Date: 2024-12-25
  - Time: 19:00
  - Screen: Screen 1
  - Seats: 50
  - Price: ₹200
- Click "Add Showtime"

**Step 4: User Books**
- User goes to homepage
- Sees "Deadpool 3" in "Now Showing"
- Clicks movie → Selects date/time → Books tickets

---

## 🎬 Admin Panel Sections

### 1. 🎬 TMDB Manager (New)
- **Purpose:** Manage TMDB imported movies
- **Features:**
  - Import movies from TMDB
  - Enable/disable movies
  - Add/remove showtimes
  - View movie details
- **Movies:** Only TMDB imported movies

### 2. View Movies & Banners (Old)
- **Purpose:** Manage manually added movies
- **Features:**
  - Add movie manually
  - Edit movie details
  - Delete movie
  - Manage showtimes
- **Movies:** Only manually added movies

### 3. Add Movie (Old)
- **Purpose:** Add movies manually
- **When to use:** Movie not available on TMDB
- **Result:** Movie added to "View Movies & Banners"

---

## ❓ Common Questions

### Q: Why don't I see my old movies on homepage?
**A:** Old movies don't have `isEnabled` field. They need migration or use old system.

### Q: Can I delete TMDB movies?
**A:** Yes, but better to just "Disable" them. They won't show to users.

### Q: What happens if I import again?
**A:** Existing movies are updated, new movies are added. Your enabled status and showtimes are preserved.

### Q: Can I edit TMDB movie details?
**A:** Currently no. TMDB movies use official data. You can add manual movies for custom details.

### Q: How often should I import?
**A:** Weekly or monthly to get new releases. Or enable daily auto-import.

### Q: Do users see disabled movies?
**A:** No. Only enabled movies appear on homepage.

---

## 🚀 Best Practices

### For Admin:

1. **Import regularly** - Get latest movies
2. **Enable selectively** - Only movies you want to show
3. **Add showtimes promptly** - Users can't book without them
4. **Disable old movies** - Keep homepage fresh
5. **Check "Now Showing"** - Ensure movies have showtimes

### For System:

1. **TMDB for most movies** - Automatic, high-quality data
2. **Manual for special cases** - Local movies, events
3. **Enable daily auto-import** - Set `ENABLE_CRON=true`
4. **Monitor enabled movies** - Don't enable too many at once

---

## 🎯 Summary

**TMDB Integration = Automation + Control**

- **Automation:** Movies import automatically from TMDB
- **Control:** Admin decides which movies to show
- **Flexibility:** Can still add manual movies
- **User Experience:** Always fresh, high-quality movie data

**Flow:**
```
Import → Enable → Add Showtimes → Users Book
```

**Your old movies are safe!** They're in "View Movies & Banners" tab.

---

## 🆘 Need Help?

- **Import not working?** Run: `node backend/scripts/testImport.js`
- **Movies not showing?** Check if enabled and has showtimes
- **Old movies missing?** Check "View Movies & Banners" tab
- **Want to migrate?** Ask me to update old movies with `isEnabled` field

---

**Your TMDB integration is working perfectly! 🎬**
