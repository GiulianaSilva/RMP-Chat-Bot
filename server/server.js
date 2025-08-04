const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const { GoogleGenAI, HarmBlockThreshold, HarmCategory } = require('@google/genai');

const app = express();
const port = process.env.PORT || 3000;


const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; 
const MAX_REQUESTS_PER_WINDOW = 20; 

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin === 'null') {
      callback(null, true);
    } else {
      callback(null, true); 
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 
app.use(bodyParser.json({ limit: '10mb' }));

app.use('/widget', express.static(path.join(__dirname, '../client')));

app.get('/widget.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, '../client/rmp-chat-widget-production.js'));
}); 

function rateLimitMiddleware(req, res, next) {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  if (!rateLimitMap.has(clientIP)) {
    rateLimitMap.set(clientIP, { requests: 1, windowStart: now });
    return next();
  }
  
  const clientData = rateLimitMap.get(clientIP);
  

  if (now - clientData.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(clientIP, { requests: 1, windowStart: now });
    return next();
  }
  

  if (clientData.requests >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded. Please wait a moment before sending another message.',
      retryAfter: Math.ceil((RATE_LIMIT_WINDOW - (now - clientData.windowStart)) / 1000)
    });
  }
  
  clientData.requests++;
  rateLimitMap.set(clientIP, clientData);
  next();
}

function validateInput(req, res, next) {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  if (typeof message !== 'string') {
    return res.status(400).json({ error: 'Message must be a string' });
  }
  
  if (message.trim().length === 0) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }
  
  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message is too long. Maximum length is 2000 characters.' });
  }
  
  next();
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.windowStart > RATE_LIMIT_WINDOW * 2) {
      rateLimitMap.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Root route for Railway domain
app.get('/', (req, res) => {
  res.json({ 
    message: 'RMP ChatBot API is running!',
    endpoints: {
      health: '/health',
      chat: '/chat',
      widget: '/widget.js'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/chat', rateLimitMiddleware, validateInput, async (req, res) => {
  const userMessage = req.body.message.trim();
  console.log(`[${new Date().toISOString()}] Received message:`, userMessage.substring(0, 100) + (userMessage.length > 100 ? '...' : ''));

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error. Please contact administrator.' 
      });
    }

    const config = {
      temperature: 0.7,
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

    const model = 'gemini-2.0-flash-exp';
    
    const response = await ai.models.generateContent({
      model,
      config,
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    });

    if (!response || !response.candidates || response.candidates.length === 0) {
      throw new Error('No response candidates received from AI model');
    }

    const candidate = response.candidates[0];
    
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error('No content in AI response');
    }

    const reply = candidate.content.parts[0].text;

    if (!reply || reply.trim().length === 0) {
      throw new Error('Empty response from AI model');
    }

    console.log(`[${new Date().toISOString()}] Bot reply length:`, reply.length);
    res.json({ reply: reply.trim() });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error:`, error.message);
    
    // Provide different error messages based on error type
    let errorMessage = 'Sorry, I\'m having trouble right now. Please try again in a moment.';
    
    if (error.message.includes('API key')) {
      errorMessage = 'There\'s a configuration issue. Please contact support.';
    } else if (error.message.includes('rate limit') || error.message.includes('quota')) {
      errorMessage = 'I\'m getting too many requests right now. Please wait a moment and try again.';
    } else if (error.message.includes('safety') || error.message.includes('blocked')) {
      errorMessage = 'I can\'t respond to that type of message. Please try rephrasing your question.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

app.use((error, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Unhandled error:`, error);
  res.status(500).json({ 
    error: 'An unexpected error occurred. Please try again.',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(`\n🚀 RMP ChatBot Server Started`);
  console.log(`📍 Server running at: http://localhost:${port}`);
  console.log(`🔗 Health check: http://localhost:${port}/health`);
  console.log(`📧 Chat endpoint: http://localhost:${port}/chat`);
  console.log(`⏰ Started at: ${new Date().toISOString()}\n`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

