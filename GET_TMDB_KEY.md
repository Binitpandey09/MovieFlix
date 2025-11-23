# 🔑 How to Get Your TMDB API Key (Step-by-Step)

## 📋 Instructions:

### 1. Go to TMDB Website
Open your browser and go to: **https://www.themoviedb.org/signup**

### 2. Create Account
- Click "Sign Up"
- Fill in:
  - Username
  - Password
  - Email
- Click "Sign Up"
- **Check your email** and verify your account

### 3. Request API Key
- Login to TMDB
- Click on your **profile icon** (top right)
- Click **"Settings"**
- In the left sidebar, click **"API"**
- Click **"Request an API Key"**

### 4. Choose API Type
- Select **"Developer"**
- Click "Accept" on the terms

### 5. Fill Application Form
Fill out the form with these details:

**Type of Use:** Website

**Application Name:** MovieFlix

**Application URL:** http://localhost:3000

**Application Summary:**
```
Educational movie booking system built with MERN stack. 
Integrates TMDB API to automatically fetch and display 
upcoming and now-playing movies for a cinema booking platform.
```

Click **"Submit"**

### 6. Copy Your API Key
- You'll see your **API Key (v3 auth)**
- It looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
- **Copy this key**

### 7. Add to Your Project
Open `backend/.env` and replace:
```env
TMDB_API_KEY=your_tmdb_api_key_here
```

With your actual key:
```env
TMDB_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### 8. Test the Connection
Run this command in your terminal:
```bash
cd backend
node scripts/testTMDB.js
```

If successful, you'll see:
```
✅ Success! Found 20 now playing movies
✅ Success! Found 20 upcoming movies
🎉 All tests passed!
```

### 9. Restart Backend
After adding the key, restart your backend server.

### 10. Import Movies
1. Go to http://localhost:3000
2. Login as admin
3. Go to Admin Panel
4. Click "🎬 TMDB Manager"
5. Click "📥 Import from TMDB"
6. Wait 10-20 seconds
7. Movies will appear in the table!

---

## 🎯 Quick Links:

- **TMDB Signup:** https://www.themoviedb.org/signup
- **API Settings:** https://www.themoviedb.org/settings/api
- **TMDB API Docs:** https://developers.themoviedb.org/3

---

## ⚠️ Important Notes:

- API key is **FREE** forever
- No credit card required
- Rate limit: 40 requests per 10 seconds (plenty for our use)
- Keep your API key **private** (don't commit to GitHub)

---

## 🐛 Troubleshooting:

**"Invalid API key"**
- Make sure you copied the full key
- No extra spaces before/after the key
- Use API Key (v3 auth), not v4

**"Account not verified"**
- Check your email for verification link
- Click the link to verify
- Then request API key

**"Application rejected"**
- Make sure you filled all fields
- Use the sample text provided above
- Try again with more details

---

## ✅ Once You Have the Key:

1. Add it to `backend/.env`
2. Run `node scripts/testTMDB.js` to test
3. Restart backend
4. Import movies via Admin Panel
5. Enable movies and add showtimes
6. Check frontend - movies appear automatically!

**That's it! You're ready to go! 🚀**
