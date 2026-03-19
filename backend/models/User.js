import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  displayName: String,
  photoURL: String,
  lastSessionId: {
    type: String,
    default: null
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  questionsUsed: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// For extra safety, ensure we have indexes created
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

const User = mongoose.model('User', userSchema);
export default User;
