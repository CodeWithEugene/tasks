import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.VITE_API_KEY || process.env.GEMINI_API_KEY || 'REPLACE_ME';
const MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
  'gemini-2.0-flash-exp',
  'gemini-2.0-pro-exp'
];

(async () => {
  if (!API_KEY || API_KEY === 'REPLACE_ME') {
    console.error('Missing API key in env (VITE_API_KEY or GEMINI_API_KEY).');
    process.exit(1);
  }
  const genAI = new GoogleGenerativeAI(API_KEY);
  const attempted = [];
  for (const m of MODELS) {
    attempted.push(m);
    try {
      console.log(`\n--- Trying model: ${m} ---`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent('Return JSON {"title":"Test","description":"Just a test"}');
      const text = result.response.text();
      console.log('SUCCESS raw text:', text);
      console.log('Used model:', m);
      return; // exit on first success
    } catch (e) {
      console.error(`Error for ${m}:`, e.status || '', e.statusText || '', e.message);
    }
  }
  console.log('\nAll models failed. Attempted:', attempted.join(', '));
})();
