// Simple API key validation test
const API_KEY = "AIzaSyCNzEoO1jA2vfkmQbQ05Y5bXpw4twz4hGY";

async function validateAPIKey() {
    try {
        // Test basic API access without using the SDK
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`);
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            return;
        }
        
        const data = await response.json();
        console.log('Available models:', data);
        
    } catch (error) {
        console.error('Network error:', error);
    }
}

validateAPIKey();