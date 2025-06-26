class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.createWidget();
        this.attachEventListeners();
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'rmp-chat-widget';
        widget.innerHTML = `
            <div class="rmp-chat-bubble" id="rmpChatBubble">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            <div class="rmp-chat-window" id="rmpChatWindow">
                <div class="rmp-chat-header">
                    <h3>Chat with us</h3>
                    <button class="rmp-close-btn" id="rmpCloseBtn">×</button>
                </div>
                <div class="rmp-chat-messages" id="rmpChatMessages">
                    <div class="rmp-message rmp-bot-message">
                        Hello! How can I help you today?
                    </div>
                </div>
                <div class="rmp-chat-input">
                    <input type="text" id="rmpUserInput" placeholder="Type your message...">
                    <button id="rmpSendBtn">Send</button>
                </div>
            </div>
        `;

        const styles = document.createElement('style');
        styles.textContent = `
            .rmp-chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: Arial, sans-serif;
            }

            .rmp-chat-bubble {
                width: 60px;
                height: 60px;
                background-color: #007bff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                color: white;
                transition: transform 0.2s;
            }

            .rmp-chat-bubble:hover {
                transform: scale(1.1);
            }

            .rmp-chat-window {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            .rmp-chat-header {
                padding: 15px;
                background: #007bff;
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .rmp-chat-header h3 {
                margin: 0;
                font-size: 16px;
            }

            .rmp-close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
            }

            .rmp-chat-messages {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
            }

            .rmp-message {
                margin-bottom: 10px;
                padding: 10px;
                border-radius: 10px;
                max-width: 80%;
            }

            .rmp-bot-message {
                background: #ffffff;
                color: #333333;
                margin-right: auto;
                border: 1px solid #e1e8ed;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }

            .rmp-user-message {
                background: #007bff;
                color: white;
                margin-left: auto;
            }

            .rmp-typing span {
                display: inline-block;
                animation: typing 1.4s infinite;
                font-size: 18px;
            }

            .rmp-typing span:nth-child(2) {
                animation-delay: 0.2s;
            }

            .rmp-typing span:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typing {
                0%, 60%, 100% {
                    opacity: 0.3;
                }
                30% {
                    opacity: 1;
                }
            }

            .rmp-chat-input {
                padding: 15px;
                border-top: 1px solid #eee;
                display: flex;
                gap: 10px;
            }

            .rmp-chat-input input {
                flex: 1;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                outline: none;
            }

            .rmp-chat-input button {
                padding: 10px 20px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }

            .rmp-chat-input button:hover {
                background: #0056b3;
            }

            @media (max-width: 480px) {
                .rmp-chat-window {
                    width: 100%;
                    height: 100%;
                    bottom: 0;
                    right: 0;
                    border-radius: 0;
                }
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(widget);
    }

    attachEventListeners() {
        const bubble = document.getElementById('rmpChatBubble');
        const closeBtn = document.getElementById('rmpCloseBtn');
        const chatWindow = document.getElementById('rmpChatWindow');
        const sendBtn = document.getElementById('rmpSendBtn');
        const userInput = document.getElementById('rmpUserInput');

        bubble.addEventListener('click', () => {
            this.isOpen = true;
            chatWindow.style.display = 'flex';
            bubble.style.display = 'none';
        });

        closeBtn.addEventListener('click', () => {
            this.isOpen = false;
            chatWindow.style.display = 'none';
            bubble.style.display = 'flex';
        });

        const sendMessage = async () => {
            const message = userInput.value.trim();
            if (message) {
                this.addMessage(message, 'user');
                userInput.value = '';
                
                // Show typing indicator
                this.showTypingIndicator();
                
                try {
                    // Send message to your chatbot backend
                    const response = await fetch('http://localhost:3000/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message: message })
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    
                    // Remove typing indicator and add bot response
                    this.removeTypingIndicator();
                    this.addMessage(data.reply, 'bot');
                    
                } catch (error) {
                    console.error('Error sending message:', error);
                    this.removeTypingIndicator();
                    this.addMessage('Sorry, I\'m having trouble connecting right now. Please try again.', 'bot');
                }
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('rmpChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `rmp-message rmp-${sender}-message`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('rmpChatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'rmp-typing-indicator';
        typingDiv.className = 'rmp-message rmp-bot-message rmp-typing';
        typingDiv.innerHTML = '<span>•</span><span>•</span><span>•</span>';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('rmp-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

window.addEventListener('load', () => {
    new ChatWidget();
}); 