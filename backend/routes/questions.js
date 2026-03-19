import { Router } from 'express';
import multer from 'multer';
import pdf from 'pdf-parse';
import { generateQuestions, generateFromPdf } from '../services/geminiService.js';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/questions/generate
router.post('/generate', protect, async (req, res) => {
  try {
    const { exam, subject, chapter, topic, count, language, difficulty } = req.body;
    console.log(`[questions] Generate request from ${req.user.email || req.user.phone}: ${exam}, topic: ${topic || chapter}`);

    if (!exam) {
      return res.status(400).json({ error: 'exam is required' });
    }

    const questions = await generateQuestions({
      exam, subject, chapter, topic,
      count: Math.min(count || 10, 50),
      language: language || 'en',
      difficulty: difficulty || 'mixed',
    });

    // Update usage count
    await User.findByIdAndUpdate(req.user._id, { $inc: { questionsUsed: 1 } });

    res.json({ questions, count: questions.length });
  } catch (err) {
    console.error(`[questions] Generation error: ${err.message}`);
    res.status(500).json({
      error: 'Failed to generate questions',
      message: err.message,
      hint: err.message.includes('API key') || err.message.includes('API_KEY') ? 'Check GEMINI_API_KEY in backend/.env' : undefined,
    });
  }
});

// POST /api/questions/from-pdf
router.post('/from-pdf', protect, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfData = await pdf(req.file.buffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim().length < 50) {
      return res.status(400).json({ error: 'PDF has insufficient text content' });
    }

    const exam = req.body.exam || 'neet';
    const language = req.body.language || 'en';

    const questions = await generateFromPdf(pdfText, exam, language);
    res.json({ questions, count: questions.length, pagesProcessed: pdfData.numpages });
  } catch (err) {
    console.error('PDF question generation error:', err.message);
    res.status(500).json({
      error: 'Failed to generate questions from PDF',
      message: err.message,
    });
  }
});

export default router;
