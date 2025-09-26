// Direct REST API test for Gemini
const API_KEY = "AIzaSyCNzEoO1jA2vfkmQbQ05Y5bXpw4twz4hGY";

async function testDirectAPI() {
    try {
        console.log('Testing direct REST API...');
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "Rewrite this task title and description to be clearer. Return only JSON format: {\"title\": \"new title\", \"description\": \"new description\"}. Original title: \"Test task\", Original description: \"This is a test\""
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            return;
        }
        
        const data = await response.json();
        console.log('Success! Response:', JSON.stringify(data, null, 2));
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            console.log('Generated text:', text);
            
            try {
                const parsed = JSON.parse(text);
                console.log('Parsed JSON:', parsed);
            } catch (e) {
                console.log('Text is not valid JSON, but generation worked');
            }
        }
        
    } catch (error) {
        console.error('❌ Direct API test failed:', error);
    }
}

testDirectAPI();