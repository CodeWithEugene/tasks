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
        
        // More detailed error logging for debugging
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        
        // Check for specific error types and provide more helpful messages
        if (error instanceof Error && error.message?.includes('API_KEY')) {
            throw new Error("Invalid API key. Please check your Gemini API key configuration.");
        } else if (error instanceof Error && error.message?.includes('quota')) {
            throw new Error("API quota exceeded. Please try again later or check your usage limits.");
        } else if (error instanceof Error && error.message?.includes('network')) {
            throw new Error("Network error. Please check your internet connection and try again.");
        } else if (error instanceof SyntaxError) {
            throw new Error("Invalid response format from AI service. Please try again.");
        } else {
            throw new Error("Failed to understand the task. Please try again.");
        }
    }
};

export const rewriteTaskWithAI = async (title: string, description: string): Promise<{title: string, description: string}> => {
    try {
        console.log('API_KEY exists:', !!API_KEY);
        console.log('API_KEY length:', API_KEY?.length || 0);
        console.log('genAI initialized:', !!genAI);
        
        if (!genAI || !API_KEY) {
            // Fallback: return the original text if no API key
            console.log('No genAI instance or API key, returning original text');
            return { title, description };
        }

        // Try multiple models as fallback options
        const modelsToTry = [
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-2.0-flash-lite'
        ];

        for (const modelName of modelsToTry) {
            try {
                console.log(`Trying model: ${modelName}`);
                
                const model = genAI.getGenerativeModel({
                    model: modelName
                });

                const prompt = `Rewrite the following task title and description to be clearer and more concise. Return only a JSON object with "title" and "description" fields.

Original title: "${title}"
Original description: "${description}"

Return format: {"title": "clear task title", "description": "one sentence description"}`;

                console.log('Making API call to Gemini...');
                const result = await model.generateContent(prompt);
                
                console.log('Got API response:', result);
                const response = result.response;
                console.log('Response object:', response);
                const textResponse = response.text().trim();
                console.log('Response text:', textResponse);
                
                // Try to extract JSON from the response
                let parsedObject;
                try {
                    // Look for JSON in the response
                    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        parsedObject = JSON.parse(jsonMatch[0]);
                    } else {
                        parsedObject = JSON.parse(textResponse);
                    }
                } catch (parseError) {
                    console.log('JSON parsing failed, using fallback enhancement');
                    // Enhanced fallback - at least clean up the text
                    return {
                        title: title.trim().charAt(0).toUpperCase() + title.trim().slice(1) || 'Untitled Task',
                        description: description.trim() || 'Task details to be added'
                    };
                }
                
                console.log('Parsed JSON:', parsedObject);
                
                // Validate the response
                if (parsedObject && parsedObject.title && parsedObject.description) {
                    return {
                        title: parsedObject.title,
                        description: parsedObject.description
                    };
                }
                
            } catch (modelError) {
                console.error(`Model ${modelName} failed:`, modelError);
                continue; // Try next model
            }
        }
        
        // If all models fail, return enhanced fallback
        console.log('All AI models failed, using enhanced fallback');
        return {
            title: title.trim().charAt(0).toUpperCase() + title.trim().slice(1) || 'Untitled Task',
            description: description.trim() || 'Task details to be added'
        };
        
        /* TODO: Fix model access issue 
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

        console.log('Making API call to Gemini...');
        const result = await model.generateContent(
            `Rewrite the following task title and description to be clearer and more concise. Make the title specific and actionable, and the description should be exactly one sentence that is short and straight to the point.

            Original title: "${title}"
            Original description: "${description}"

            Please provide:
            - A clear, concise, and specific title
            - A one-sentence description that is short and straight to the point`
        );
        
        console.log('Got API response:', result);
        const response = result.response;
        console.log('Response object:', response);
        const jsonString = response.text().trim();
        console.log('Response text:', jsonString);
        const parsedObject = JSON.parse(jsonString);
        console.log('Parsed JSON:', parsedObject);
        return parsedObject as {title: string, description: string};

    } catch (error) {
        console.error("Error rewriting task with AI:", error);
        
        // More detailed error logging for debugging
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        
        // Check for specific error types and provide more helpful messages
        if (error instanceof Error && error.message?.includes('API_KEY')) {
            throw new Error("Invalid API key. Please check your Gemini API key configuration.");
        } else if (error instanceof Error && error.message?.includes('quota')) {
            throw new Error("API quota exceeded. Please try again later or check your usage limits.");
        } else if (error instanceof Error && error.message?.includes('network')) {
            throw new Error("Network error. Please check your internet connection and try again.");
        } else if (error instanceof SyntaxError) {
            throw new Error("Invalid response format from AI service. Please try again.");
        } else {
            throw new Error("Failed to rewrite the task. Please try again.");
        }
        */
    } catch (error) {
        console.error("Error in rewriteTaskWithAI:", error);
        // Return original values as fallback
        return { title, description };
    }
};
