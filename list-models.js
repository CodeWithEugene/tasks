// Script to list available Gemini models
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCNzEoO1jA2vfkmQbQ05Y5bXpw4twz4hGY";

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        
        console.log('Listing available models...');
        
        const models = await genAI.listModels();
        console.log('Available models:');
        
        for (const model of models) {
            console.log('- Model name:', model.name);
            console.log('  Display name:', model.displayName);
            console.log('  Supported generation methods:', model.supportedGenerationMethods);
            console.log('  Version:', model.version);
            console.log('---');
        }
        
    } catch (error) {
        console.error('❌ Error listing models:', error);
        
        if (error.message?.includes('API_KEY')) {
            console.error('🔑 API Key issue - the key might be invalid');
        } else if (error.message?.includes('quota')) {
            console.error('📊 Quota exceeded');
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
            console.error('🌐 Network issue');
        } else {
            console.error('❓ Unknown error');
        }
    }
}

listModels();