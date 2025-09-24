
import { GoogleGenAI, Type } from "@google/genai";
import { Task, Priority, Category } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this environment, we assume API_KEY is set.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = 'gemini-2.5-flash';

export const generateTaskFromPrompt = async (prompt: string): Promise<Partial<Omit<Task, 'id' | 'completed'>>> => {
    try {
        const result = await ai.models.generateContent({
            model: model,
            contents: `Parse the following user request and extract task details. The current date is ${new Date().toLocaleDateString()}. If the user says "tomorrow", it means one day after the current date. Provide the date in YYYY-MM-DD format. If a detail is not present, omit the key.
            User request: "${prompt}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: 'The main title of the task.' },
                        description: { type: Type.STRING, description: 'A brief description of the task.' },
                        startDate: { type: Type.STRING, description: 'The start date in YYYY-MM-DD format.' },
                        priority: { type: Type.STRING, enum: [Priority.LOW, Priority.MEDIUM, Priority.HIGH], description: 'The priority of the task.' },
                        category: { type: Type.STRING, enum: [Category.LEARNING, Category.PERSONAL, Category.WORK], description: 'The category of the task.' }
                    },
                },
            }
        });
        
        const jsonString = result.text.trim();
        const parsedObject = JSON.parse(jsonString);
        return parsedObject as Partial<Omit<Task, 'id' | 'completed'>>;

    } catch (error) {
        console.error("Error generating task from prompt:", error);
        throw new Error("Failed to understand the task. Please try again.");
    }
};
