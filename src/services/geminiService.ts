import { GoogleGenerativeAI } from "@google/generative-ai";
import { Task } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;

// Lazily construct client only if key present
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Central list of model candidates. Order goes from cheaper/faster to more capable.
const MODEL_CANDIDATES = [
    // Current public (v1beta) names commonly available via API keys from AI Studio
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    // Pro / higher capability
    "gemini-1.5-pro",
    // Newer generation (some accounts have these; keep last so we don't 404 early)
    "gemini-2.0-flash-exp",
    "gemini-2.0-pro-exp"
];

interface AIRewriteResult {
    title: string;
    description: string;
    _aiMeta?: {
        modelTried: string[];         // models attempted
        modelUsed?: string;           // model that succeeded
        errorChain?: string[];        // per-model error summaries
        usedFallback: boolean;        // whether we fell back
        parsingFailed?: boolean;      // JSON parsing issue
    };
}

export function getAIStatus() {
    if (!API_KEY) {
        return { available: false, reason: 'Missing API key (VITE_API_KEY)' };
    }
    return { available: true };
}

function enhanceFallbackTitle(raw: string): string {
    if (!raw) return 'Untitled Task';
    const trimmed = raw.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function basicDescription(desc: string): string {
    return (desc && desc.trim()) || 'Task description';
}

function extractJsonObject(text: string): any | null {
    if (!text) return null;
    // Attempt to find first JSON object block
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
        return JSON.parse(match[0]);
    } catch {
        return null;
    }
}

export const generateTaskFromPrompt = async (prompt: string): Promise<Partial<Omit<Task, 'id' | 'completed'>>> => {
    try {
        if (!genAI || !API_KEY) {
            return { title: enhanceFallbackTitle(prompt) };
        }

        // For now simply shape a task; real generation can be enabled once model access confirmed.
        return {
            title: enhanceFallbackTitle(prompt),
            description: 'AI-generated task details (placeholder until model access fixed)'
        };
    } catch (error) {
        console.error('Error generating task from prompt:', error);
        return { title: enhanceFallbackTitle(prompt) };
    }
};

export const rewriteTaskWithAI = async (title: string, description: string): Promise<AIRewriteResult> => {
    const attempted: string[] = [];
    const errorChain: string[] = [];
    let parsingFailed = false;

    if (!genAI || !API_KEY) {
        return {
            title: enhanceFallbackTitle(title),
            description: basicDescription(description),
            _aiMeta: { modelTried: [], usedFallback: true }
        };
    }

    for (const candidate of MODEL_CANDIDATES) {
        attempted.push(candidate);
        try {
            const model = genAI.getGenerativeModel({ model: candidate });
            const prompt = `You are an assistant that rewrites task items succinctly.
Return ONLY a JSON object with keys: title, description.
Constraints:
- Title <= 60 chars, imperative style.
- Description: one concise sentence.

Original Title: ${title}\nOriginal Description: ${description}`;

            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            const obj = extractJsonObject(text);
            if (!obj || typeof obj !== 'object') {
                parsingFailed = true;
                throw new Error('No JSON object parsed');
            }
            if (!obj.title || !obj.description) {
                parsingFailed = true;
                throw new Error('JSON missing required fields');
            }
            // Success
            return {
                title: enhanceFallbackTitle(String(obj.title)),
                description: basicDescription(String(obj.description)),
                _aiMeta: { modelTried: attempted, modelUsed: candidate, usedFallback: false, errorChain, parsingFailed: false }
            };
        } catch (err: any) {
            const short = err?.status ? `${candidate}: ${err.status} ${err.statusText || ''}`.trim() : `${candidate}: ${err?.message || err}`;
            errorChain.push(short);
            // If error is 404 (model not found/access) continue to next; else for rate/quota maybe still try others.
            // We simply continue; after loop fallback used.
            continue;
        }
    }

    // Fallback after all attempts
    return {
        title: enhanceFallbackTitle(title),
        description: basicDescription(description || 'Complete this task'),
        _aiMeta: { modelTried: attempted, usedFallback: true, errorChain, parsingFailed }
    };
};