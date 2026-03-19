import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    index: true 
  },
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
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
});

const Score = mongoose.model('Score', scoreSchema);
export default Score;
