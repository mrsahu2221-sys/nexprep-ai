import { Router } from 'express';
import admin from 'firebase-admin';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token is required' });

    // 1. Verify Firebase Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, phone_number, name, picture } = decodedToken;

    // 2. Check if user already exists by firebaseId
    let user = await User.findOne({ firebaseId: uid });

    if (!user) {
      // 3. New Registration - Check Unique Constraints
      if (email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({ 
            error: 'This email is already registered',
            code: 'EMAIL_EXISTS'
          });
        }
      }

      if (phone_number) {
        const existingPhone = await User.findOne({ phone: phone_number });
        if (existingPhone) {
          return res.status(400).json({ 
            error: 'This number is already registered',
            code: 'PHONE_EXISTS'
          });
        }
      }

      // 4. Create New User
      user = await User.create({
        firebaseId: uid,
        email: email || null,
        phone: phone_number || null,
        displayName: name || 'Aspirant',
        photoURL: picture || null,
      });
      console.log('✨ New User Registered:', user.email || user.phone);
    }

    // 5. Generate New Session ID (Strict Single Session)
    const newSessionId = uuidv4();
    user.lastSessionId = newSessionId;
    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        phone: user.phone,
        photoURL: user.photoURL,
        isPaid: user.isPaid,
        questionsUsed: user.questionsUsed,
      },
      sessionId: newSessionId
    });

  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// GET /api/auth/me (Get current user with session check)
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      displayName: req.user.displayName,
      email: req.user.email,
      phone: req.user.phone,
      photoURL: req.user.photoURL,
      isPaid: req.user.isPaid,
      questionsUsed: req.user.questionsUsed,
    }
  });
});

export default router;
