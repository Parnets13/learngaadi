# Render Deployment Guide

## Steps to Deploy on Render

1. **Push your code to GitHub** (make sure serviceAccountKey.json is NOT pushed)

2. **Create a new Web Service on Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure the service:**
   - Name: `learngaadi-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free or Starter

4. **Add Environment Variables:**
   Go to Environment tab and add:
   - `DB_STR` = Your MongoDB connection string
   - `PORT` = 8781 (or leave empty to use Render's default)
   - `admin_secret_key` = Your admin secret key
   - `vendor_secret_key` = Your vendor secret key
   - `customer_secret_key` = Your customer secret key
   - `NODE_ENV` = production

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

## Important Notes

- Firebase Admin SDK has been removed as it's not being used
- The serviceAccountKey.json file is not needed for deployment
- All sensitive data should be in environment variables, not in code
- The backend will be accessible at: `https://your-service-name.onrender.com`

## After Deployment

Update your React Native app's API configuration:
```javascript
// In learngaadiuserApp/utils/api.js
const API_CONFIG = {
  production: 'https://your-service-name.onrender.com/api',
  // ... rest of config
};
```

## Troubleshooting

If deployment fails:
1. Check the build logs on Render dashboard
2. Ensure all environment variables are set correctly
3. Verify MongoDB connection string is correct
4. Make sure package.json has all required dependencies
