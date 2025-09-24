import { Task } from '../types';

// Using JSONBin.io free tier for simple JSON storage
const JSONBIN_API_URL = 'https://api.jsonbin.io/v3/b';
const JSONBIN_API_KEY = import.meta.env.VITE_JSONBIN_API_KEY || '';

interface CloudTaskData {
    tasks: Task[];
    lastUpdated: string;
}

// Generate a unique bin ID based on user email
const getUserBinId = (email: string): string => {
    // Create a simple hash of the email for consistent bin IDs
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        const char = email.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    // Use a more compatible format for JSONBin.io
    return `tasks-${Math.abs(hash).toString(36)}-${email.split('@')[0]}`;
};

export const saveTasksToCloud = async (email: string, tasks: Task[]): Promise<boolean> => {
    if (!JSONBIN_API_KEY || JSONBIN_API_KEY === 'your_jsonbin_api_key_here') {
        console.warn('JSONBin API key not configured. Tasks will only be saved locally.');
        console.log('To enable cross-device sync:');
        console.log('1. Go to https://jsonbin.io and create a free account');
        console.log('2. Get your API key from the dashboard');
        console.log('3. Create a .env file with: VITE_JSONBIN_API_KEY=your_actual_api_key');
        return false;
    }

    try {
        const binId = getUserBinId(email);
        console.log('Saving to bin ID:', binId);
        const data: CloudTaskData = {
            tasks,
            lastUpdated: new Date().toISOString()
        };

        const response = await fetch(`${JSONBIN_API_URL}/${binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY,
                'X-Bin-Name': `Tasks for ${email}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            throw new Error(`Failed to save tasks: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Tasks saved to cloud successfully:', result);
        return true;
    } catch (error) {
        console.error('Error saving tasks to cloud:', error);
        return false;
    }
};

export const loadTasksFromCloud = async (email: string): Promise<Task[] | null> => {
    if (!JSONBIN_API_KEY || JSONBIN_API_KEY === 'your_jsonbin_api_key_here') {
        console.warn('JSONBin API key not configured. Loading tasks from local storage only.');
        return null;
    }

    try {
        const binId = getUserBinId(email);
        console.log('Loading from bin ID:', binId);
        const response = await fetch(`${JSONBIN_API_URL}/${binId}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });

        if (response.status === 404) {
            console.log('No data exists yet for this user, creating new bin');
            // Try to create a new bin first
            const createResponse = await fetch(JSONBIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_API_KEY,
                    'X-Bin-Name': `Tasks for ${email}`
                },
                body: JSON.stringify({ tasks: [], lastUpdated: new Date().toISOString() })
            });
            
            if (createResponse.ok) {
                console.log('Created new bin for user');
                return [];
            }
            return [];
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            throw new Error(`Failed to load tasks: ${response.statusText}`);
        }

        const result = await response.json();
        const data: CloudTaskData = result.record;
        
        console.log('Tasks loaded from cloud successfully:', data.tasks?.length || 0, 'tasks');
        return data.tasks || [];
    } catch (error) {
        console.error('Error loading tasks from cloud:', error);
        return null;
    }
};

export const createUserBin = async (email: string): Promise<boolean> => {
    if (!JSONBIN_API_KEY) {
        return false;
    }

    try {
        const data: CloudTaskData = {
            tasks: [],
            lastUpdated: new Date().toISOString()
        };

        const response = await fetch(JSONBIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY,
                'X-Bin-Name': `Tasks for ${email}`
            },
            body: JSON.stringify(data)
        });

        return response.ok;
    } catch (error) {
        console.error('Error creating user bin:', error);
        return false;
    }
};
