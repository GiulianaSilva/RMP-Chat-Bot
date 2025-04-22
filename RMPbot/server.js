const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { GoogleGenAI, HarmBlockThreshold, HarmCategory } = require('@google/genai');

const app = express();
const port = process.env.PORT || 3000;  // Use the Railway port or fallback to 3000 for local

// Middleware
app.use(cors());
app.use(bodyParser.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  console.log('Received message:', userMessage);

  try {
    const config = {
      temperature: 0.7, // Adjust this based on your preferences
      responseModalities: ['text'],
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    };

    const model = 'gemini-2.0-flash-exp'; // Make sure this model name is correct
    const response = await ai.models.generateContent({
      model,
      config,
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    });

    const reply = response.candidates && response.candidates[0].content
      ? response.candidates[0].content.parts[0].text
      : 'Sorry, I did not understand that.';

    console.log('Bot reply:', reply);
    res.json({ reply });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ reply: 'Oops! Something went wrong.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

