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
    return `tasks-${Math.abs(hash).toString(36)}`;
};

export const saveTasksToCloud = async (email: string, tasks: Task[]): Promise<boolean> => {
    if (!JSONBIN_API_KEY) {
        console.warn('JSONBin API key not configured. Tasks will only be saved locally.');
        return false;
    }

    try {
        const binId = getUserBinId(email);
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
            throw new Error(`Failed to save tasks: ${response.statusText}`);
        }

        console.log('Tasks saved to cloud successfully');
        return true;
    } catch (error) {
        console.error('Error saving tasks to cloud:', error);
        return false;
    }
};

export const loadTasksFromCloud = async (email: string): Promise<Task[] | null> => {
    if (!JSONBIN_API_KEY) {
        console.warn('JSONBin API key not configured. Loading tasks from local storage only.');
        return null;
    }

    try {
        const binId = getUserBinId(email);
        const response = await fetch(`${JSONBIN_API_URL}/${binId}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });

        if (response.status === 404) {
            // No data exists yet for this user
            return [];
        }

        if (!response.ok) {
            throw new Error(`Failed to load tasks: ${response.statusText}`);
        }

        const result = await response.json();
        const data: CloudTaskData = result.record;
        
        console.log('Tasks loaded from cloud successfully');
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
