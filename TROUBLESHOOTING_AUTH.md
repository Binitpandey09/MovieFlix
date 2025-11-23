# 🔧 Troubleshooting: Authentication Issues Fixed

## ✅ What Was Fixed:

The TMDB Manager was getting "No token" or "Unauthorized" errors because the API calls weren't sending the authentication token.

**Fixed:**
- ✅ Added `Authorization: Bearer <token>` header to all TMDB API calls
- ✅ Token retrieved from localStorage
- ✅ All routes now properly authenticated

---

## 🚀 How to Test Now:

### Step 1: Refresh Browser
- Press **Ctrl + F5** (hard refresh)
- Or close and reopen browser

### Step 2: Login as Admin
- Email: **binitpandey950@gmail.com**
- Use your admin password
- Make sure login is successful

### Step 3: Verify Login
Open browser console (F12) and type:
```javascript
JSON.parse(localStorage.getItem('userInfo'))
```

You should see:
```json
{
  "name": "Binit kumar Pandey",
  "email": "binitpandey950@gmail.com",
  "isAdmin": true,
  "token": "eyJhbGc..."
}
```

### Step 4: Go to TMDB Manager
1. Click "Admin Panel" in navbar
2. Click "🎬 TMDB Manager" tab
3. Click "📥 Import from TMDB" button
4. Wait 10-20 seconds
5. Should see success message!

---

## 🐛 If Still Getting Errors:

### Error: "Failed to fetch TMDB movies"

**Check:**
1. Are you logged in as admin?
2. Does localStorage have userInfo with token?
3. Is backend running on port 5001?

**Fix:**
```bash
# Check backend is running
curl http://localhost:5001

# Should return: {"message": "MovieFlix Backend API is running!"}
```

### Error: "No token" or "Unauthorized"

**Check:**
1. Open browser console (F12)
2. Go to Application tab → Local Storage
3. Find "userInfo"
4. Verify it has a token field

**Fix:**
- Logout and login again
- Token will be refreshed

### Error: "Network Error"

**Check:**
1. Backend running? Check terminal
2. Frontend running? Check http://localhost:3000
3. CORS enabled? Should be automatic

**Fix:**
```bash
# Restart backend
cd backend
npm start

# Restart frontend
cd frontend
npm start
```

---

## 🔍 Debug Steps:

### 1. Check Backend Logs
Look at backend terminal for errors:
```
GET /api/tmdb/all - should see this when loading TMDB Manager
POST /api/tmdb/fetch - should see this when importing
```

### 2. Check Frontend Console
Open browser console (F12):
- Look for red errors
- Check Network tab for failed requests
- Verify API calls include Authorization header

### 3. Test API Manually
```bash
# Get your token from localStorage first
# Then test the API:

curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:5001/api/tmdb/all
```

---

## ✅ Success Indicators:

You'll know it's working when:
- ✅ No "unauthorized" errors
- ✅ TMDB Manager loads without errors
- ✅ Import button works
- ✅ Movies appear in table after import
- ✅ Can enable/disable movies
- ✅ Can add showtimes

---

## 🆘 Still Not Working?

### Reset Admin Password:
```bash
cd backend
node scripts/resetAdminPassword.js
```

### Create New Admin:
```bash
cd backend
node scripts/createAdminUser.js
```

### Check Admin Status:
```bash
cd backend
node scripts/checkAdminUser.js
```

---

## 📝 What Changed in Code:

**Before:**
```javascript
const { data } = await api.get('/api/tmdb/all');
```

**After:**
```javascript
const getAuthConfig = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo?.token}`
        }
    };
};

const { data } = await api.get('/api/tmdb/all', getAuthConfig());
```

---

## 🎯 Quick Checklist:

- [ ] Backend running on port 5001
- [ ] Frontend running on port 3000
- [ ] Logged in as admin
- [ ] localStorage has userInfo with token
- [ ] Browser refreshed (Ctrl+F5)
- [ ] Admin Panel accessible
- [ ] TMDB Manager tab visible

---

## 🚀 Ready to Import!

Once all checks pass:
1. Go to Admin Panel
2. Click "🎬 TMDB Manager"
3. Click "📥 Import from TMDB"
4. Wait for success message
5. Enable movies and add showtimes!

**Your TMDB integration is ready! 🎬**
