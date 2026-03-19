// UI Translations - English and Hindi (primary languages)
// Other languages have key translations; Claude API generates questions in selected language

const en = {
  appName: 'NexPrep AI', tagline: 'NEET & JEE Exam Preparation',
  selectLanguage: 'Select Your Language', startPractice: 'Start Practice',
  home: 'Home', mockTest: 'Mock Test', chapterPractice: 'Chapter Practice',
  pdfUpload: 'PDF Upload', topicType: 'Topic Type', dashboard: 'Dashboard',
  settings: 'Settings', socialProof: '1,00,000+ NEET/JEE aspirants ki pasand',
  selectExam: 'Select Exam', selectSubject: 'Select Subject',
  selectChapter: 'Select Chapter', numQuestions: 'Number of Questions',
  startTest: 'Start Test', submitTest: 'Submit Test',
  nextQuestion: 'Next', prevQuestion: 'Previous',
  markReview: 'Mark for Review', clearResponse: 'Clear',
  timeLeft: 'Time Left', question: 'Question', of: 'of',
  yourScore: 'Your Score', totalMarks: 'Total Marks',
  correct: 'Correct', incorrect: 'Incorrect', unattempted: 'Unattempted',
  accuracy: 'Accuracy', predictedRank: 'Predicted Rank',
  viewExplanations: 'View Explanations', whyCorrect: 'Why this is correct',
  whyWrong: 'Why this is wrong', shortTrick: 'Short Trick',
  ncertRef: 'NCERT Reference', overallAccuracy: 'Overall Accuracy',
  weakAreas: 'Weak Areas', scoreHistory: 'Score History',
  improveSuggestions: 'Improve These Chapters',
  uploadPdf: 'Upload PDF or Notes',
  dragDrop: 'Drag & drop your PDF here, or click to browse',
  generating: 'Generating questions...', enterTopic: 'Enter any topic...',
  generateQuestions: 'Generate Questions', fullTest: 'Full Test',
  questions: 'Questions', minutes: 'Minutes', marks: 'Marks',
  easy: 'Easy', medium: 'Medium', hard: 'Hard',
  physics: 'Physics', chemistry: 'Chemistry', biology: 'Biology',
  botany: 'Botany', zoology: 'Zoology', maths: 'Mathematics',
  paper1: 'Paper 1', paper2: 'Paper 2', backHome: 'Back to Home',
  reviewAnswers: 'Review Answers',
  autoSubmitWarning: 'Test will be auto-submitted when timer ends',
  neetUG: 'NEET UG', jeeMains: 'JEE Mains', jeeAdvanced: 'JEE Advanced',
  unlockNow: 'Unlock Now',
  paywallTitle: 'Aapka result aa gaya!',
  paywallDesc: 'Poora analysis dekhne ke liye Lifetime Access unlock karo',
  paywallPrice: 'sirf ₹500', offerEnds: 'Offer ends in',
  demoOver: 'Free demo session complete!',
  payNow: 'Pay ₹500 — Lifetime Access',
  loadingQuestions: 'AI is generating exam-style questions...',
  noData: 'No data yet. Take a test to see your analytics!',
  mcq: 'MCQ', numerical: 'Numerical',
};

const hi = {
  ...en,
  tagline: 'NEET & JEE परीक्षा तैयारी',
  selectLanguage: 'अपनी भाषा चुनें', startPractice: 'अभ्यास शुरू करें',
  home: 'होम', mockTest: 'मॉक टेस्ट', chapterPractice: 'अध्याय अभ्यास',
  pdfUpload: 'PDF अपलोड', topicType: 'टॉपिक टाइप', dashboard: 'डैशबोर्ड',
  settings: 'सेटिंग्स', socialProof: '1,00,000+ NEET/JEE छात्रों की पसंद',
  selectExam: 'परीक्षा चुनें', selectSubject: 'विषय चुनें',
  selectChapter: 'अध्याय चुनें', numQuestions: 'प्रश्नों की संख्या',
  startTest: 'टेस्ट शुरू करें', submitTest: 'टेस्ट सबमिट करें',
  nextQuestion: 'अगला', prevQuestion: 'पिछला',
  markReview: 'रिव्यू के लिए मार्क करें', clearResponse: 'साफ करें',
  timeLeft: 'शेष समय', question: 'प्रश्न', of: 'का',
  yourScore: 'आपका स्कोर', totalMarks: 'कुल अंक',
  correct: 'सही', incorrect: 'गलत', unattempted: 'छोड़े गए',
  accuracy: 'सटीकता', predictedRank: 'अनुमानित रैंक',
  physics: 'भौतिकी', chemistry: 'रसायन', biology: 'जीवविज्ञान',
  botany: 'वनस्पति विज्ञान', zoology: 'जंतु विज्ञान', maths: 'गणित',
  paywallTitle: 'आपका रिजल्ट आ गया!',
  paywallDesc: 'पूरा analysis देखने के लिए Lifetime Access unlock करो',
  loadingQuestions: 'AI परीक्षा-स्तरीय प्रश्न तैयार कर रहा है...',
};

const ta = { ...en, tagline: 'NEET & JEE தேர்வு தயாரிப்பு', selectLanguage: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்', home: 'முகப்பு', mockTest: 'மாதிரி தேர்வு', physics: 'இயற்பியல்', chemistry: 'வேதியியல்', biology: 'உயிரியல்', maths: 'கணிதம்' };
const te = { ...en, tagline: 'NEET & JEE పరీక్ష సన్నద్ధత', selectLanguage: 'మీ భాషను ఎంచుకోండి', home: 'హోమ్', mockTest: 'మాక్ టెస్ట్', physics: 'భౌతికశాస్త్రం', chemistry: 'రసాయనశాస్త్రం', biology: 'జీవశాస్త్రం', maths: 'గణితం' };
const kn = { ...en, tagline: 'NEET & JEE ಪರೀಕ್ಷಾ ತಯಾರಿ', selectLanguage: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', home: 'ಮುಖಪುಟ', mockTest: 'ಮಾಕ್ ಟೆಸ್ಟ್', physics: 'ಭೌತಶಾಸ್ತ್ರ', chemistry: 'ರಸಾಯನಶಾಸ್ತ್ರ', biology: 'ಜೀವಶಾಸ್ತ್ರ', maths: 'ಗಣಿತ' };
const bn = { ...en, tagline: 'NEET & JEE পরীক্ষা প্রস্তুতি', selectLanguage: 'আপনার ভাষা নির্বাচন করুন', home: 'হোম', mockTest: 'মক টেস্ট', physics: 'পদার্থবিদ্যা', chemistry: 'রসায়ন', biology: 'জীববিদ্যা', maths: 'গণিত' };
const mr = { ...en, tagline: 'NEET & JEE परीक्षा तयारी', selectLanguage: 'तुमची भाषा निवडा', home: 'मुख्यपृष्ठ', mockTest: 'मॉक टेस्ट', physics: 'भौतिकशास्त्र', chemistry: 'रसायनशास्त्र', biology: 'जीवशास्त्र', maths: 'गणित' };
const gu = { ...en, tagline: 'NEET & JEE પરીક્ષા તૈયારી', selectLanguage: 'તમારી ભાષા પસંદ કરો', home: 'હોમ', mockTest: 'મોક ટેસ્ટ', physics: 'ભૌતિકશાસ્ત્ર', chemistry: 'રસાયણશાસ્ત્ર', biology: 'જીવવિજ્ઞાન', maths: 'ગણિત' };

const translations = { en, hi, ta, te, kn, bn, mr, gu };
export default translations;
