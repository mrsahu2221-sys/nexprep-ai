# 🎯 PrepMaster — NEET & JEE Exam Preparation App

AI-powered exam preparation platform for **NEET UG**, **JEE Mains**, and **JEE Advanced** aspirants.

## Features

- **Full Mock Test Mode** — Timed tests with OMR-style interface
- **Chapter Practice** — Select chapter and get exam-style questions
- **PDF Upload** — Upload notes and get questions generated from content
- **Topic Type** — Type any topic for instant questions
- **AI Explanations** — Why correct + why wrong + shortcuts + NCERT refs
- **Performance Dashboard** — Charts, accuracy tracking, rank prediction
- **8 Languages** — EN, Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, Gujarati
- **Paywall System** — Free demo (10 questions) → ₹500 lifetime access

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| AI | Claude API (Anthropic) |
| Database | MongoDB |
| Payments | Razorpay |

## Setup

### Prerequisites
- Node.js 18+
- npm

### 1. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Environment

Edit `backend/.env` with your API keys:

```env
CLAUDE_API_KEY=your_claude_api_key_here
MONGODB_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open http://localhost:5173

> **Note:** The app works without API keys — it shows sample questions. Connect Claude API for real AI-generated questions.

## Deployment

- **Frontend**: Deploy to Vercel (`npm run build` → deploy `dist/`)
- **Backend**: Deploy to Railway or Render
