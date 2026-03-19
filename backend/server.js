import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import questionsRouter from './routes/questions.js';
import scoresRouter from './routes/scores.js';
import paymentRouter from './routes/payment.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/questions', questionsRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected');
    } else {
      console.log('⚠️  MongoDB URI not configured — running without database');
    }
  } catch (err) {
    console.log('⚠️  MongoDB connection failed — running without database:', err.message);
  }
};

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Only listen if not on Vercel
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 PrepMaster API running on http://localhost:${PORT}`);
  });
}

export default app;
