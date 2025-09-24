import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Task } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;

// Make AI usage optional so the app doesn't crash without a key
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const generateTaskFromPrompt = async (prompt: string): Promise<Partial<Omit<Task, 'id' | 'completed'>>> => {
    try {
        if (!genAI) {
            // Fallback: return a minimal task using the prompt as title
            return { title: prompt };
        }
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

export const rewriteTaskWithAI = async (title: string, description: string): Promise<{title: string, description: string}> => {
    try {
        if (!genAI) {
            // Fallback: return the original text if no API key
            return { title, description };
        }
        
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        title: { type: SchemaType.STRING, description: 'A clear, concise, and well-formatted task title.' },
                        description: { type: SchemaType.STRING, description: 'A detailed, clear, and actionable task description.' }
                    },
                },
            }
        });

        const result = await model.generateContent(
            `Rewrite the following task title and description to be clearer and more concise. Make the title specific and actionable, and the description should be exactly one sentence that is short and straight to the point.

            Original title: "${title}"
            Original description: "${description}"

            Please provide:
            - A clear, concise, and specific title
            - A one-sentence description that is short and straight to the point`
        );
        
        const response = result.response;
        const jsonString = response.text().trim();
        const parsedObject = JSON.parse(jsonString);
        return parsedObject as {title: string, description: string};

    } catch (error) {
        console.error("Error rewriting task with AI:", error);
        throw new Error("Failed to rewrite the task. Please try again.");
    }
};
