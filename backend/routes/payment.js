import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

dotenv.config();

const router = Router();

let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id') {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (err) {
  console.log('⚠️  Razorpay not configured:', err.message);
}

// POST /api/payment/create-order
router.post('/create-order', protect, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        error: 'Payment not configured',
        hint: 'Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env',
      });
    }

    const options = {
      amount: 50000, // 500 INR in paise
      currency: 'INR',
      receipt: `prepmaster_${Date.now()}`,
      notes: { product: 'PrepMaster Lifetime Access' },
    };

    const order = await razorpay.orders.create(options);
    res.json({ order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/verify
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      // Demo mode success
      await User.findByIdAndUpdate(req.user._id, { isPaid: true });
      return res.json({ verified: true, message: 'Payment verified (demo mode)' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      await User.findByIdAndUpdate(req.user._id, { isPaid: true });
      res.json({ verified: true });
    } else {
      res.status(400).json({ verified: false, error: 'Invalid signature' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/upi-verify
router.post('/upi-verify', protect, async (req, res) => {
  try {
    const { transactionId } = req.body;
    if (!transactionId) return res.status(400).json({ error: 'Transaction ID is required' });

    // For this implementation, we auto-approve any transaction ID
    await User.findByIdAndUpdate(req.user._id, { isPaid: true });
    
    res.json({ success: true, message: 'PRO access unlocked!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
