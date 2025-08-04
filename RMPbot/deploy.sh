#!/bin/bash

echo "🚀 RMP Chatbot Deployment Helper"
echo "================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial chatbot setup"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository found"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Push your code to GitHub:"
echo "   - Create a new repository on GitHub"
echo "   - git remote add origin https://github.com/yourusername/your-repo.git"
echo "   - git push -u origin main"
echo ""
echo "2. Deploy on Railway:"
echo "   - Go to https://railway.app"
echo "   - Sign in with GitHub"
echo "   - Click 'New Project' → 'Deploy from GitHub'"
echo "   - Select your repository"
echo "   - Add environment variable: GEMINI_API_KEY"
echo ""
echo "3. Get your Railway URL and test it:"
echo "   - Visit: https://your-app.railway.app/health"
echo "   - Should return: {\"status\":\"OK\"}"
echo ""
echo "4. Add to Wix:"
echo "   - Add HTML embed with: <script src=\"https://your-app.railway.app/widget.js\"></script>"
echo ""
echo "5. Test everything:"
echo "   - Open test-live.html in your browser"
echo "   - Enter your Railway URL"
echo "   - Test the chatbot"
echo ""
echo "🎉 That's it! Your chatbot will be live!"