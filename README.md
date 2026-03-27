# Smart Expense Tracker with AI Insights

## Tech Stack
- **Frontend**: React.js, Tailwind CSS (v4), Recharts, Vite
- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Email/Password & Google)

## Setup Guide

### 1. Prerequisites
- Node.js installed
- Firebase project created (Firestore + Authentication needed)

### 2. Firebase Configuration
1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Once created, go to **Authentication** and enable:
   - Email/Password Provider
   - Google Provider
4. Go to **Firestore Database** and create a database (Start in Test Mode for development).
5. Add a Web App to your project and copy the configuration settings.

### 3. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Configure Firebase Admin SDK:
   - Go to Firebase Console -> Project Settings -> Service Accounts
   - Generate a new private key
   - You can either set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to point to this downloaded JSON file, or download the json file and reference it directly in `backend/config/firebase.js`.
   
   Example in `.env`:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/firebase-adminsdk.json
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 4. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your Firebase configuration from step 2.5:
   ```bash
   cp .env.example .env.local
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

## API Endpoints List

### Transactions
- **GET** `/api/transactions/dashboard` - Get aggregated stats, charts, and recent info.
- **GET** `/api/transactions/` - Get all user transactions.
- **POST** `/api/transactions/` - Add a new transaction (Requires `title`, `amount`, `category`, `type`, `date`).
- **DELETE** `/api/transactions/:id` - Delete a transaction by ID.

### Insights
- **GET** `/api/insights/` - Generate AI or rule-based insights based on recent spending.

## Features implemented
- Fully functional Firebase authentication
- Fully responsive Dashboard showing charts and spending summaries
- Expense/Income tracking system with Categories
- Intelligent alerts for high-spending patterns
- Tailwind CSS styling for a modern dashboard feel
