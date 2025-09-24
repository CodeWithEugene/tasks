import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Task } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  throw new Error("Missing Gemini API Key. Please set the VITE_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateTaskFromPrompt = async (prompt: string): Promise<Partial<Omit<Task, 'id' | 'completed'>>> => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        title: { type: SchemaType.STRING, description: 'The main title of the task.' },
                        description: { type: SchemaType.STRING, description: 'A brief description of the task.' },
                        startDate: { type: SchemaType.STRING, description: 'The start date in YYYY-MM-DD format.' },
                        priority: { type: SchemaType.STRING, description: 'The priority of the task (Low, Medium, or High).' },
                        category: { type: SchemaType.STRING, description: 'The category of the task (Learning, Personal, or Work).' }
                    },
                },
            }
        });

        const result = await model.generateContent(
            `Parse the following user request and extract task details. The current date is ${new Date().toLocaleDateString()}. If the user says "tomorrow", it means one day after the current date. Provide the date in YYYY-MM-DD format. If a detail is not present, omit the key.
            User request: "${prompt}"`
        );
        
        const response = result.response;
        const jsonString = response.text().trim();
        const parsedObject = JSON.parse(jsonString);
        return parsedObject as Partial<Omit<Task, 'id' | 'completed'>>;

    } catch (error) {
        console.error("Error generating task from prompt:", error);
        throw new Error("Failed to understand the task. Please try again.");
    }
};
