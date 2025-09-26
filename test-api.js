// Test script to check if Gemini API is working
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load from environment (set VITE_API_KEY or GEMINI_API_KEY before running)
const API_KEY = process.env.VITE_API_KEY || process.env.GEMINI_API_KEY;

async function testGeminiAPI() {
    try {
        if (!API_KEY) {
            console.error('❌ Missing API key. Set VITE_API_KEY or GEMINI_API_KEY in your environment.');
            process.exit(1);
        }
        const genAI = new GoogleGenerativeAI(API_KEY);
        
        console.log('Testing Gemini API...');
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash"
        });

        const result = await model.generateContent(
            `Rewrite the following task title and description to be clearer and more concise. Return only a valid JSON object with "title" and "description" fields.

            Original title: "Test task"
            Original description: "This is a test"

            Return format: {"title": "clear task title", "description": "one sentence description"}`
        );
        
        const response = result.response;
        console.log('Raw response:', response);
        
        const jsonString = response.text().trim();
        console.log('Response text:', jsonString);
        
        const parsedObject = JSON.parse(jsonString);
        console.log('Parsed object:', parsedObject);
        
        console.log('✅ API test successful!');
        
    } catch (error) {
        console.error('❌ API test failed:', error);
        
        // Check for specific error types
        if (error.message?.includes('API_KEY')) {
            console.error('🔑 API Key issue - the key might be invalid or missing');
        } else if (error.message?.includes('quota')) {
            console.error('📊 Quota exceeded - you might have hit rate limits');
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
            console.error('🌐 Network issue - check your internet connection');
        } else if (error.name === 'SyntaxError') {
            console.error('📝 JSON parsing issue - the API response format is unexpected');
        } else {
            console.error('❓ Unknown error type');
        }
    }
}

testGeminiAPI();