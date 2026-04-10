
# RMP Chat Bot

A production-ready AI chatbot system with web widget integration for websites. Built with Node.js and Google Gemini AI.

**Project:** RMP-Chat-Bot  
**Forked by:** Andrew  
**Status:** Production Ready

## Overview

This project provides a complete chatbot solution consisting of:
- Backend API server powered by Google Gemini AI
- Frontend web widget for website integration
- Production deployment on Railway
- Wix website integration support

## Architecture

### Backend (Node.js + Express)
- RESTful API with `/chat` endpoint
- Google Gemini AI integration
- Rate limiting and input validation
- CORS support for cross-origin requests
- Health check endpoint

### Frontend (Vanilla JavaScript)
- Self-contained chat widget
- Auto-detecting server configuration
- Responsive design with mobile support
- Real-time typing indicators
- Professional UI/UX

## Installation

### Prerequisites
- Node.js (version 14.x or higher)
- Google Gemini API key
- Git

### Setup
1. Clone the repository
```bash
git clone <repository-url>
cd RMP-Chat-Bot
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=3000
```

4. Start the server
```bash
npm start
```

The server will start at `http://localhost:3000`

## Deployment

### Railway Deployment
1. Connect your GitHub repository to Railway
2. Add environment variable: `GEMINI_API_KEY`
3. Railway will automatically detect and deploy the Node.js application

### Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `PORT`: Server port (default: 3000, Railway sets automatically)

## Website Integration

### Wix Integration
To add the chatbot to your Wix website:

1. Open Wix website editor
2. Go to **Settings → Custom Code**
3. Add this script to the header:
```html
<script src="https://your-railway-url.com/widget.js"></script>
```

### General Website Integration
Add the script tag to any HTML page:
```html
<script src="https://your-railway-url.com/widget.js"></script>
```

## API Endpoints

### POST /chat
Processes chat messages and returns AI responses.

**Request:**
```json
{
  "message": "Hello, how are you?"
}
```

**Response:**
```json
{
  "reply": "Hello! I'm doing well, thank you for asking. How can I help you today?"
}
```

### GET /health
Returns server health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-08-04T14:04:36.202Z"
}
```

### GET /widget.js
Serves the chat widget JavaScript file for website integration.

## File Structure

```
RMP-Chat-Bot/
├── server/
│   └── server.js          # Main server application
├── client/
│   ├── rmp-chat-widget-production.js  # Production widget
│   └── test-live.html     # Testing interface
├── package.json           # Dependencies and scripts
├── railway.json          # Railway deployment config
├── verify-setup.js       # Setup verification script
└── README.md             # This file
```

## Development

### Local Development
1. Start the server: `npm start`
2. Open `client/test-live.html` in your browser
3. Test the chat functionality

### Widget Configuration
The widget automatically detects the server URL from the script source. For custom configuration:

```javascript
window.initRMPChatWidget({
    chatTitle: 'Your Custom Title',
    welcomeMessage: 'Your custom welcome message',
    primaryColor: '#your-brand-color'
});
```

## Security Features

- Rate limiting (20 requests per minute per IP)
- Input validation and sanitization
- CORS configuration
- Content safety filtering via Google Gemini
- Error handling and logging

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is licensed under the ISC License.

## Support

For technical support or questions, please refer to the codebase documentation or create an issue in the repository.
