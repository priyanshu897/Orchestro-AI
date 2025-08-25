# Troubleshooting Guide - UI Not Showing Changes

## 🚨 Problem Description
The workflow thread changes are not being displayed in the frontend UI, even though the backend API is working correctly.

## 🔍 Diagnosis Steps

### 1. Check Backend Status
```bash
# Verify backend is running
netstat -an | findstr :8000

# Test API directly
curl http://localhost:8000/api/threads
```

### 2. Check Frontend Status
```bash
# Verify frontend is running
netstat -an | findstr :3000

# Check browser console for errors
# Press F12 → Console tab
```

### 3. Test API from Browser
Open `http://localhost:8000/api/threads` in your browser to verify the API works.

## 🛠️ Solutions

### Solution 1: Force Refresh Threads
1. Navigate to `/workflows` in the frontend
2. Click the **"Refresh"** button (blue button with refresh icon)
3. Check browser console for debug logs

### Solution 2: Check CORS Configuration
Ensure the backend CORS settings allow the frontend domain:

```python
# In backend/app/main.py
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Solution 3: Debug Panel
1. Look for the red 🐛 button in the bottom-right corner
2. Click it to open the debug panel
3. Check the logs for connection errors

### Solution 4: Manual API Test
Open the test HTML file in your browser:
```bash
# Navigate to backend folder
cd backend

# Open test_api.html in browser
# This will test the API directly
```

## 🔧 Common Issues & Fixes

### Issue 1: CORS Errors
**Symptoms**: Browser console shows CORS errors
**Fix**: Restart backend server, verify CORS origins

### Issue 2: Network Errors
**Symptoms**: "Failed to fetch" errors in console
**Fix**: Check if backend is running on port 8000

### Issue 3: JSON Parsing Errors
**Symptoms**: "Unexpected token" errors
**Fix**: Check backend response format

### Issue 4: Frontend Not Syncing
**Symptoms**: No threads visible, empty sidebar
**Fix**: Click refresh button, check debug panel

## 📋 Testing Checklist

- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 3000
- [ ] API endpoint `/api/threads` returns data
- [ ] Browser console shows no errors
- [ ] Debug panel shows successful connection
- [ ] Refresh button works
- [ ] Threads appear in sidebar

## 🚀 Quick Fix Commands

```bash
# Restart backend
cd backend
uvicorn app.main:app --reload --port 8000

# Restart frontend (in new terminal)
cd Frontend
npm start

# Test API
curl http://localhost:8000/api/threads
```

## 📊 Expected Behavior

1. **Backend**: Should return 3 demo threads
2. **Frontend**: Should display threads in sidebar
3. **Auto-refresh**: Should update every 5 seconds
4. **Manual refresh**: Should work immediately
5. **Debug panel**: Should show connection status

## 🆘 Still Not Working?

If the issue persists:

1. **Check all console logs** (both backend and frontend)
2. **Verify network requests** in browser dev tools
3. **Test API endpoints** individually
4. **Restart both services**
5. **Clear browser cache**

## 📞 Debug Information

When reporting issues, include:
- Backend console output
- Frontend console output
- Network tab requests
- Debug panel logs
- Browser and OS information

---

**Remember**: The debug panel (🐛) is your friend! Use it to see what's happening with the API calls.
