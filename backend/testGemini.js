import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyAaGIfQAyZudWlO5zVcPrWP1hbMChmWhTA';
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  try {
    console.log(`Testing ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Hi');
    const response = await result.response;
    console.log(`✅ ${modelName} works: ${response.text().substring(0, 20)}...`);
    return true;
  } catch (err) {
    console.error(`❌ ${modelName} failed: ${err.message}`);
    return false;
  }
}

async function runTests() {
  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash', 'gemini-pro'];
  for (const m of models) {
    if (await testModel(m)) break;
  }
}

runTests();
