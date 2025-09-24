# Cross-Device Task Sync Setup

## The Issue
Cross-device syncing isn't working because the JSONBin.io API key isn't configured.

## Quick Fix
1. **Create a `.env` file** in your project root (`/home/eugenius/tasks/.env`)
2. **Get a free API key** from [jsonbin.io](https://jsonbin.io)
3. **Add this line** to your `.env` file:
   ```
   VITE_JSONBIN_API_KEY=your_actual_api_key_here
   ```

## Step-by-Step Setup

### 1. Get JSONBin.io API Key
- Go to [https://jsonbin.io](https://jsonbin.io)
- Click "Sign Up" (it's free)
- Verify your email
- Go to "API Keys" in your dashboard
- Copy your API key

### 2. Create .env File
Create a file called `.env` in your project root with:
```
VITE_JSONBIN_API_KEY=your_actual_api_key_here
```

### 3. Restart the App
- Stop the dev server (Ctrl+C)
- Run `npm run dev` again
- The app will now sync tasks across devices!

## How to Test
1. Add some tasks on your current device
2. Open the app in another browser/device (or incognito mode)
3. Log in with the same Google account
4. Your tasks should appear automatically!

## Debugging
Open browser console (F12) to see sync status:
- "Loading tasks from cloud for: your@email.com"
- "Saving tasks to cloud for: your@email.com"
- "Loaded tasks from cloud: X tasks"

If you see "JSONBin API key not configured", the .env file isn't set up correctly.
