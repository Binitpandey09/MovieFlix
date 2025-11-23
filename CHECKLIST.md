# ✅ TMDB Integration Checklist

## What's Already Done ✅

- [x] Backend Movie model updated with TMDB fields
- [x] TMDB service created (fetch movies from API)
- [x] TMDB controller created (enable/disable/showtimes)
- [x] TMDB routes added to server
- [x] Cron job support added
- [x] Frontend TMDB Manager component created
- [x] Admin Panel integration complete
- [x] Movie filtering logic updated
- [x] Test script created
- [x] Documentation written

## What YOU Need to Do 🎯

### 1. Get TMDB API Key (5 minutes)
- [ ] Go to https://www.themoviedb.org/signup
- [ ] Create account
- [ ] Verify email
- [ ] Go to Settings → API → Request API Key
- [ ] Choose "Developer"
- [ ] Fill form with:
  - App Name: MovieFlix
  - URL: http://localhost:3000
  - Summary: Educational movie booking system
- [ ] Copy your API Key (v3 auth)

### 2. Add API Key to Project (1 minute)
- [ ] Open `backend/.env`
- [ ] Find line: `TMDB_API_KEY=your_tmdb_api_key_here`
- [ ] Replace with: `TMDB_API_KEY=your_actual_key`
- [ ] Save file

### 3. Test Connection (1 minute)
- [ ] Open terminal
- [ ] Run: `cd backend`
- [ ] Run: `node scripts/testTMDB.js`
- [ ] Should see: "✅ All tests passed!"

### 4. Restart Backend (30 seconds)
- [ ] Stop current backend (Ctrl+C)
- [ ] Run: `npm start`
- [ ] Should see: "Server is running on port 5001"

### 5. Import Movies (2 minutes)
- [ ] Go to http://localhost:3000
- [ ] Login as admin
- [ ] Click "Admin Panel"
- [ ] Click "🎬 TMDB Manager" tab
- [ ] Click "📥 Import from TMDB" button
- [ ] Wait 10-20 seconds
- [ ] Should see movies in table!

### 6. Enable a Movie (2 minutes)
- [ ] Find any movie in the table
- [ ] Click "Enable" button
- [ ] Click "Manage Shows" button
- [ ] Fill showtime form:
  - Date: Tomorrow
  - Time: 19:00 (7 PM)
  - Screen: Screen 1
  - Seats: 50
  - Price: 200
- [ ] Click "Add Showtime"

### 7. Test Frontend (1 minute)
- [ ] Go to homepage (http://localhost:3000)
- [ ] Click "Now Showing" tab
- [ ] Should see your enabled movie!
- [ ] Click "Coming Soon" tab
- [ ] Should see upcoming movies!

## 🎉 Success Criteria

You'll know it's working when:
- ✅ Test script passes
- ✅ Movies import successfully
- ✅ Movies appear in TMDB Manager table
- ✅ Can enable/disable movies
- ✅ Can add showtimes
- ✅ Movies appear on homepage
- ✅ Tabs filter correctly (Now Showing / Coming Soon)

## 📚 Documentation Files

- `GET_TMDB_KEY.md` - Detailed guide to get API key
- `TMDB_SETUP.md` - Complete setup documentation
- `TMDB_QUICK_START.md` - Quick reference guide
- `CHECKLIST.md` - This file

## 🆘 Need Help?

If something doesn't work:
1. Check `GET_TMDB_KEY.md` for API key issues
2. Run test script: `node scripts/testTMDB.js`
3. Check backend console for errors
4. Check frontend console (F12) for errors
5. Verify .env file has correct API key

## 🚀 Total Time: ~15 minutes

Once you have the API key, the rest is quick and easy!

---

**Ready? Let's do this! 🎬**

Start with Step 1: Get your TMDB API key from https://www.themoviedb.org/signup
