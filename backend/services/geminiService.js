import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyAaGIfQAyZudWlO5zVcPrWP1hbMChmWhTA';
console.log(`[gemini] Initializing with key ending in ...${apiKey.slice(-5)}`);
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

const EXAM_PROMPTS = {
  neet: `You are an expert NEET UG exam question generator. Generate questions that match the EXACT difficulty and style of real NEET UG exam.
Rules:
- Questions must be NCERT-based
- Include assertion-reason, matching type, diagram description, and exception-based questions
- Physics: numerical traps in laws of motion, electrostatics, optics, modern physics
- Chemistry: organic reactions, periodic trends, equilibrium, IUPAC naming
- Biology: exact NCERT lines, diagram-based, exception questions ("which is NOT correct")
- Wrong options must be realistic traps, NOT obviously wrong
- Marking: +4 correct, -1 wrong
- Difficulty split: 30% easy, 50% medium, 20% hard`,

  jee_mains: `You are an expert JEE Mains exam question generator. Generate questions at EXACT JEE Mains difficulty.
Rules:
- Conceptual + formula application questions
- Multi-step problems, calculation heavy
- Physics: mechanics, electrostatics, optics, waves
- Chemistry: organic reactions, physical chemistry calculations, inorganic concepts
- Mathematics: calculus, coordinate geometry, probability, matrices, complex numbers
- Wrong options must be common calculation mistakes (trap options)
- Include both MCQ (+4/-1) and Numerical answer types (+4/-1)
- Difficulty split: 30% easy, 50% medium, 20% hard`,

  jee_advanced: `You are an expert JEE Advanced exam question generator. Generate the HARDEST conceptual questions.
Rules:
- Questions requiring 2-3 concept combination, no shortcut possible
- Types: Single correct MCQ (+3/-1), Multiple correct MCQ (+4, partial marking, -2), Numerical (no negative), Match the list
- No direct formula questions — must require deep understanding
- Conceptual traps and multi-concept integration
- This is the HIGHEST difficulty level — only the top 2% of students should get these right
- Wrong options must be extremely close to correct answer`,
};

export async function generateQuestions({ exam, subject, chapter, topic, count, language, difficulty }) {
  const examPrompt = EXAM_PROMPTS[exam] || EXAM_PROMPTS.neet;
  const langInstruction = language !== 'en'
    ? `\n\nIMPORTANT: Generate ALL questions, options, and explanations in ${getLanguageName(language)} language.`
    : '';

  const contextStr = chapter ? `Chapter: ${chapter}` : topic ? `Topic: ${topic}` : `Subject: ${subject}`;

  const prompt = `${examPrompt}${langInstruction}

Generate exactly ${count} questions for:
${contextStr}
${subject ? `Subject: ${subject}` : ''}
Exam: ${exam.toUpperCase().replace('_', ' ')}

Return a JSON array of questions. Each question object must have:
{
  "question": "the question text",
  "options": ["A", "B", "C", "D"],
  "correct": 0,  // 0-indexed correct option
  "difficulty": "easy|medium|hard",
  "explanation": {
    "correct": "why the correct answer is right",
    "wrong": {"0": "why A is wrong", "1": "why B is wrong", ...},
    "trick": "short trick or shortcut to remember",
    "ncert": "NCERT chapter/page reference if applicable"
  }
}

Difficulty distribution: ~30% easy, ~50% medium, ~20% hard.
Wrong options MUST be realistic traps — never obviously wrong.

Return ONLY the JSON array, no other text. Start with [ and end with ].`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();

  // Extract JSON array from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Invalid response format');

  const questions = JSON.parse(jsonMatch[0]);
  return questions;
}

export async function generateFromPdf(pdfText, exam, language) {
  const examPrompt = EXAM_PROMPTS[exam] || EXAM_PROMPTS.neet;
  const langInstruction = language !== 'en'
    ? `\nGenerate ALL content in ${getLanguageName(language)} language.`
    : '';

  const truncated = pdfText.substring(0, 30000); // Gemini has large context, but let's be reasonable

  const prompt = `${examPrompt}${langInstruction}

Based on the following study material, generate 10 exam-style questions.

STUDY MATERIAL:
"""
${truncated}
"""

Return a JSON array of questions. Each question object:
{
  "question": "text",
  "options": ["A", "B", "C", "D"],
  "correct": 0,
  "difficulty": "easy|medium|hard",
  "explanation": { "correct": "why", "wrong": {}, "trick": "shortcut", "ncert": "reference" }
}

Return ONLY the JSON array.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();
  
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Invalid response format');

  return JSON.parse(jsonMatch[0]);
}

function getLanguageName(code) {
  const names = { hi: 'Hindi', ta: 'Tamil', te: 'Telugu', kn: 'Kannada', bn: 'Bengali', mr: 'Marathi', gu: 'Gujarati' };
  return names[code] || 'English';
}
