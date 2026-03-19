import { Router } from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Score schema (inline — will use if MongoDB is connected)
let Score;
try {
  Score = mongoose.model('Score');
} catch {
  const scoreSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    exam: String,
    score: Number,
    total: Number,
    correct: Number,
    wrong: Number,
    unattempted: Number,
    totalQuestions: Number,
    chapter: String,
    topic: String,
    subjects: Object,
    timestamp: { type: Date, default: Date.now },
  });
  Score = mongoose.model('Score', scoreSchema);
}

// POST /api/scores/submit
router.post('/submit', protect, async (req, res) => {
  try {
    const { exam, score, total, correct, wrong, unattempted, totalQuestions, chapter, topic } = req.body;

    if (mongoose.connection.readyState === 1) {
      const doc = await Score.create({
        userId: req.user._id,
        exam, score, total, correct, wrong, unattempted, totalQuestions, chapter, topic,
      });
      return res.json({ success: true, id: doc._id });
    }

    // No DB — just acknowledge
    res.json({ success: true, stored: 'client-side' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/scores/history (Get current user's history)
router.get('/history', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ history: [], message: 'Database not connected — use client-side storage' });
    }
    const history = await Score.find({ userId: req.user._id })
      .sort({ timestamp: -1 }).limit(50).lean();
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/scores/dashboard (Get current user's dashboard stats)
router.get('/dashboard', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ message: 'Database not connected — use client-side storage' });
    }

    const scores = await Score.find({ userId: req.user._id }).sort({ timestamp: -1 }).lean();

    const totalCorrect = scores.reduce((s, sc) => s + (sc.correct || 0), 0);
    const totalQ = scores.reduce((s, sc) => s + (sc.totalQuestions || 0), 0);
    const accuracy = totalQ > 0 ? (totalCorrect / totalQ * 100).toFixed(1) : 0;

    res.json({
      testsCount: scores.length,
      overallAccuracy: accuracy,
      history: scores.slice(0, 20),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
