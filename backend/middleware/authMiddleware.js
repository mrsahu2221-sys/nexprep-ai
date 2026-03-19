import admin from 'firebase-admin';
import User from '../models/User.js';

// Initialize Firebase Admin (Assumes serviceAccountKey is provided or handled via env)
if (!admin.apps.length) {
  try {
    // If we have a service account in env, use it. Otherwise, use default.
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      admin.initializeApp();
    }
    console.log('✅ Firebase Admin Initialized');
  } catch (err) {
    console.error('⚠️  Firebase Admin Init Failed:', err.message);
  }
}

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    // 1. Verify Firebase Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid } = decodedToken;

    // 2. Find User in DB
    const user = await User.findOne({ firebaseId: uid });
    if (!user) {
      return res.status(401).json({ error: 'User not found in system' });
    }

    // 3. Strict Single-Session Enforcement
    const sessionId = req.headers['x-session-id'];
    if (!sessionId || user.lastSessionId !== sessionId) {
      return res.status(401).json({ 
        error: 'Session expired', 
        code: 'SESSION_EXPIRED',
        message: 'Logged in from another device' 
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Error:', err.message);
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};
