# LMS App - Fullstack Learning Management System

## Overview
This is a fullstack application with a strict sequential learning path. 

**Stack:**
- **Frontend**: Next.js 14, App Router, Tailwind CSS, Zustand, Axios
- **Backend**: Node.js, Express, MySQL (Aiven)
- **Features**: YouTube playback with auto-resume, sequential progress locks, and JWT auth.

## Setup Instructions

### 1. Database Setup (Aiven / Local MySQL)
1. Ensure you have a MySQL database running (e.g., Aiven or local `mysql`).
2. Run the SQL script located at `backend/schema.sql` against your database to create all tables and insert dummy data.

### 2. Backend Setup
1. Open terminal and navigate to: `backend/`
2. Update the `.env` file with your MySQL credentials (DB_HOST, DB_USER, DB_PASSWORD, etc.).
3. Run the following commands:
   ```bash
   npm install
   npm run build # (if any transpiler, else ignore)
   npm start # or node server.js
   ```
   *The backend runs on `http://localhost:5000` by default.*

### 3. Frontend Setup
1. Open another terminal and navigate to: `frontend/`
2. Run the following commands:
   ```bash
   npm install
   npm run dev
   ```
   *The frontend runs on `http://localhost:3000` by default.*

## Key Features Implemented:
- **Sequential Learning**: Users cannot view lessons unless the previous lesson has been completed.
- **Progress Auto-Sync**: Video progress is synced every 5 seconds and resumes seamlessly on reload.
- **Glassmorphism Design**: Minimalistic UI using TailwindCSS.
- **JWT Refresh System**: Transparent HTTP-Only cookie token refresh via Axios interceptors.
