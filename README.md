<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Ro6qO65YFrXWErSDy_qxW4AiM9t9fV-z

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a `.env` file in the root directory and add your Gemini API key:
   ```
   VITE_API_KEY=your_gemini_api_key_here
   ```
   Get your API key from: https://makersuite.google.com/app/apikey
3. Run the app:
   `npm run dev`

## AI Features

The app now includes AI-powered task enhancement:
- **Enhanced Icon**: The "Add with AI" button now features a beautiful sparkles icon
- **AI Task Rewriting**: When you click "Enhance with AI", the app uses Gemini AI to rewrite your task title and description to be clearer, more concise, and more detailed
- **Smart Enhancement**: The AI analyzes your input and provides better, more actionable task descriptions with clear context and steps
