# 🚀 Super Easy Chatbot Setup Guide

## The Simplest Way to Get Your Chatbot on Wix (100% Free)

This guide will get your chatbot live on your Wix website in about 15 minutes!

## Step 1: Deploy Your Backend (5 minutes)

### Using Railway (Recommended - Forever Free)

1. **Go to [Railway.app](https://railway.app)**
2. **Click "Login" and sign in with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository** (this one)
6. **Railway will automatically detect it's a Node.js app and start building**
7. **Add your environment variable:**
   - Click on your project
   - Go to "Variables" tab
   - Add: `GEMINI_API_KEY` = `your_actual_api_key_here`
8. **Get your URL:**
   - Go to "Settings" tab
   - Click "Generate Domain"
   - Copy the URL (looks like: `https://yourapp-production-1234.up.railway.app`)

**That's it! Your backend is live! 🎉**

## Step 2: Update Widget Configuration (2 minutes)

You need to tell the widget where your server is:

1. **Edit the file:** `RMPbot/client/rmp-chat-widget-production.js`
2. **Find this line** (around line 8):
   ```javascript
   serverUrl: 'https://your-server-domain.com',
   ```
3. **Replace it with your Railway URL:**
   ```javascript
   serverUrl: 'https://yourapp-production-1234.up.railway.app',
   ```
4. **Save the file**

## Step 3: Add to Your Wix Website (8 minutes)

### Method A: HTML Embed (Easiest)

1. **Open your Wix website editor**
2. **Click the "+" button** to add elements
3. **Search for "HTML"** and add "HTML iframe" or "Embed Code"
4. **Place it anywhere on your page** (doesn't matter where - the chat will float)
5. **Click on the HTML element and select "Enter Code"**
6. **Paste this code:**
   ```html
   <script src="https://yourapp-production-1234.up.railway.app/widget.js"></script>
   ```
   (Replace with your actual Railway URL)
7. **Click "Update" and then "Publish" your site**

### Method B: Site-wide (Shows on all pages)

1. **Go to your Wix Dashboard**
2. **Click "Settings" → "Custom Code"**
3. **Click "Add Custom Code"**
4. **Choose "Head" and "All Pages"**
5. **Paste this code:**
   ```html
   <script>
   (function() {
       const script = document.createElement('script');
       script.src = 'https://yourapp-production-1234.up.railway.app/widget.js';
       script.async = true;
       document.head.appendChild(script);
   })();
   </script>
   ```
6. **Save and publish**

## 🎉 You're Done!

Visit your Wix website and you should see:
- A blue chat bubble in the bottom-right corner
- Click it to open the chat window
- Type a message and get AI responses!

## 🛠️ Customization (Optional)

Want to change colors or text? Edit these in `rmp-chat-widget-production.js`:

```javascript
const CONFIG = {
    serverUrl: 'https://your-railway-url.com',
    chatTitle: 'Chat with RMP', // Change this
    welcomeMessage: 'Hello! How can I help you?', // Change this
    primaryColor: '#007bff' // Change this color
};
```

## 🆘 Troubleshooting

**Chat bubble not showing?**
- Check browser console for errors (F12)
- Make sure your Railway URL is correct
- Verify your site is published

**Chat not responding?**
- Check that your GEMINI_API_KEY is set in Railway
- Test your Railway URL by visiting: `https://your-url.com/health`

**Need help?**
- Railway has great documentation
- Your server logs are available in Railway dashboard
- Check browser Network tab for failed requests

## 💰 Cost Breakdown
- **Railway hosting**: FREE (forever)
- **Google Gemini API**: FREE (generous limits)
- **Wix website**: Whatever you're already paying
- **Total additional cost**: $0

Your chatbot is now live and will work 24/7! 🚀