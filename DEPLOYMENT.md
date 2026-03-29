# Complete Deployment Guide for Smart Expense Tracker

Since your application consists of a **Node.js/Express Backend** and a **React (Vite) Frontend**, the best approach for a free and permanent hosting solution is to use **Render** for the backend and **Vercel** for the frontend. Your Database and Authentication are already hosted on **Firebase**, meaning they don't need to be moved.

## Step 1: Prepare Your Code for Deployment

### 1. Update Backend CORS
Your backend needs to accept requests from your future frontend URL. In your `backend/server.js` (or `index.js`), ensure `cors` is configured correctly.
```javascript
const cors = require('cors');

// Allow requests from any origin (easiest for deployment testing)
// Or replace '*' with your deployed frontend URL on Vercel
app.use(cors({
  origin: '*' 
}));
```

### 2. Update Frontend API URLs
Instead of hardcoding `http://localhost:5000` in your frontend, use environment variables. In your `frontend/.env.local`, define:
```env
VITE_API_BASE_URL=http://localhost:5000
```
Then, wherever you use `axios` or `fetch`, replace the base URL like this:
```javascript
const API_URL = import.meta.env.VITE_API_BASE_URL || "YOUR_DEPLOYED_BACKEND_URL";
```

### 3. Push to GitHub
Ensure all your project files (both `frontend` and `backend` in the same repo, or separate) are pushed to a public or private GitHub repository.

---

## Step 2: Deploy the Backend (Render.com)

Render provides a completely free tier for Node.js backends.

1. Go to **[Render.com](https://render.com/)** and sign up with your GitHub account.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository containing the Smart Expense Tracker.
4. Fill in the deployment details:
   - **Name**: `smart-expense-backend` (or whatever you like)
   - **Root Directory**: `backend` (Important since this is a monorepo)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables**: Scroll down and add all the variables from your local `backend/.env` file. Pay special attention to your `GOOGLE_APPLICATION_CREDENTIALS` (Firebase Admin SDK).
   *Note: If your Firebase setup requires a physical JSON file, you might need to convert that JSON into an environment string in your code, or paste the raw JSON string into a Render env variable.*
6. Click **Create Web Service**.
7. Keep an eye on the deployment logs. Once complete, Render will give you a public URL (e.g., `https://smart-expense-backend.onrender.com`). **Save this URL.**

> [!NOTE] 
> Render's free tier automatically spins down your backend if it hasn't received traffic for 15 minutes. It will take ~50 seconds to boot up upon the next request.

---

## Step 3: Deploy the Frontend (Vercel)

Vercel is the creator of Next.js and has the best-in-class support for React/Vite applications, and is permanently free for personal projects.

1. Go to **[Vercel.com](https://vercel.com/)** and sign in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select your `frontend` folder.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**: Add all your frontend env variables here.
   - Important: Add `VITE_API_BASE_URL` and set its value to the **Render URL** you got from Step 2 (e.g., `https://smart-expense-backend.onrender.com`).
   - Add all your Firebase config variables (`VITE_FIREBASE_API_KEY`, etc.).
6. Click **Deploy**.
7. Once finished, Vercel will give you a live, permanent URL (e.g., `https://smart-expense-tracker.vercel.app`).

---

## Step 4: Final Touches

1. **Update Firebase Authorized Domains**: 
   Go to your Firebase Console -> Authentication -> Settings -> **Authorized domains**. Add your new Vercel frontend URL so Google Sign-in works in production!
2. Validate that the frontend UI can make API calls, create transactions, and show data!

You are now fully set up with a permanently hosted, modern web application.
