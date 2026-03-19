import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyAaGIfQAyZudWlO5zVcPrWP1hbMChmWhTA';

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    fs.writeFileSync('models_list.json', JSON.stringify(data, null, 2));
    console.log('Saved models to models_list.json');
    
    const flashModels = (data.models || []).filter(m => m.name.toLowerCase().includes('flash'));
    console.log('Flash models found:', flashModels.map(m => m.name));
  } catch (err) {
    console.error(err);
  }
}

listModels();
