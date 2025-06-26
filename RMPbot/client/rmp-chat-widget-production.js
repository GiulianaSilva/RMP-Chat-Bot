// RMP Chat Widget - Production Version
(function() {
    'use strict';
    
    // Configuration - You can change this URL to your hosted server
    const CONFIG = {
        serverUrl: 'https://your-server-domain.com', // When finalized change it here
        chatTitle: 'Chat with us',
        welcomeMessage: 'Hello! How can I help you today?',
        primaryColor: '#007bff'
    };

    class RMPChatWidget {
        constructor(config = {}) {
            this.config = { ...CONFIG, ...config };
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
                        <h3>${this.config.chatTitle}</h3>
                        <button class="rmp-close-btn" id="rmpCloseBtn">×</button>
                    </div>
                    <div class="rmp-chat-messages" id="rmpChatMessages">
                        <div class="rmp-message rmp-bot-message">
                            ${this.config.welcomeMessage}
                        </div>
                    </div>
                    <div class="rmp-chat-input">
                        <input type="text" id="rmpUserInput" placeholder="Type your message...">
                        <button id="rmpSendBtn">Send</button>
                    </div>
                </div>
            `;

            // Add styles
            const styles = document.createElement('style');
            styles.textContent = `
                .rmp-chat-widget {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .rmp-chat-bubble {
                    width: 60px;
                    height: 60px;
                    background-color: ${this.config.primaryColor};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    color: white;
                    transition: all 0.3s ease;
                }

                .rmp-chat-bubble:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
                }

                .rmp-chat-window {
                    position: fixed;
                    bottom: 90px;
                    right: 20px;
                    width: 350px;
                    height: 500px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    animation: slideUp 0.3s ease-out;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .rmp-chat-header {
                    padding: 16px;
                    background: ${this.config.primaryColor};
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .rmp-chat-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .rmp-close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background-color 0.2s;
                }

                .rmp-close-btn:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }

                .rmp-chat-messages {
                    flex: 1;
                    padding: 16px;
                    overflow-y: auto;
                    background: #f8f9fa;
                }

                .rmp-chat-messages::-webkit-scrollbar {
                    width: 4px;
                }

                .rmp-chat-messages::-webkit-scrollbar-track {
                    background: transparent;
                }

                .rmp-chat-messages::-webkit-scrollbar-thumb {
                    background: #ccc;
                    border-radius: 2px;
                }

                .rmp-message {
                    margin-bottom: 12px;
                    padding: 12px 16px;
                    border-radius: 18px;
                    max-width: 80%;
                    word-wrap: break-word;
                    line-height: 1.4;
                }

                .rmp-bot-message {
                    background: #ffffff;
                    color: #333333;
                    margin-right: auto;
                    border: 1px solid #e1e8ed;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
                }

                .rmp-user-message {
                    background: ${this.config.primaryColor};
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
                    padding: 16px;
                    border-top: 1px solid #e9ecef;
                    display: flex;
                    gap: 12px;
                    background: white;
                }

                .rmp-chat-input input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid #dee2e6;
                    border-radius: 24px;
                    outline: none;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }

                .rmp-chat-input input:focus {
                    border-color: ${this.config.primaryColor};
                }

                .rmp-chat-input button {
                    padding: 12px 20px;
                    background: ${this.config.primaryColor};
                    color: white;
                    border: none;
                    border-radius: 24px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.2s;
                    white-space: nowrap;
                }

                .rmp-chat-input button:hover {
                    background: ${this.adjustBrightness(this.config.primaryColor, -20)};
                }

                .rmp-chat-input button:disabled {
                    background: #6c757d;
                    cursor: not-allowed;
                }

                @media (max-width: 480px) {
                    .rmp-chat-window {
                        width: calc(100vw - 20px);
                        height: calc(100vh - 100px);
                        bottom: 90px;
                        right: 10px;
                        left: 10px;
                    }
                }

                @media (max-width: 360px) {
                    .rmp-chat-window {
                        width: 100vw;
                        height: 100vh;
                        bottom: 0;
                        right: 0;
                        left: 0;
                        border-radius: 0;
                    }
                }
            `;

            document.head.appendChild(styles);
            document.body.appendChild(widget);
        }

        adjustBrightness(hex, percent) {
            // Simple color adjustment function
            const num = parseInt(hex.replace("#", ""), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) + amt;
            const G = (num >> 8 & 0x00FF) + amt;
            const B = (num & 0x0000FF) + amt;
            return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
        }

        attachEventListeners() {
            const bubble = document.getElementById('rmpChatBubble');
            const closeBtn = document.getElementById('rmpCloseBtn');
            const chatWindow = document.getElementById('rmpChatWindow');
            const sendBtn = document.getElementById('rmpSendBtn');
            const userInput = document.getElementById('rmpUserInput');

            bubble.addEventListener('click', () => {
                this.openChat();
            });

            closeBtn.addEventListener('click', () => {
                this.closeChat();
            });

            const sendMessage = async () => {
                const message = userInput.value.trim();
                if (message && !sendBtn.disabled) {
                    this.addMessage(message, 'user');
                    userInput.value = '';
                    sendBtn.disabled = true;
                    
                    this.showTypingIndicator();
                    
                    try {
                        const response = await fetch(`${this.config.serverUrl}/chat`, {
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
                        
                        this.removeTypingIndicator();
                        this.addMessage(data.reply || data.error, 'bot');
                        
                    } catch (error) {
                        console.error('RMP Chat Widget Error:', error);
                        this.removeTypingIndicator();
                        this.addMessage('Sorry, I\'m having trouble connecting right now. Please try again.', 'bot');
                    } finally {
                        sendBtn.disabled = false;
                    }
                }
            };

            sendBtn.addEventListener('click', sendMessage);
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }

        openChat() {
            this.isOpen = true;
            const chatWindow = document.getElementById('rmpChatWindow');
            const bubble = document.getElementById('rmpChatBubble');
            chatWindow.style.display = 'flex';
            bubble.style.display = 'none';
            
            // Focus on input
            setTimeout(() => {
                document.getElementById('rmpUserInput').focus();
            }, 300);
        }

        closeChat() {
            this.isOpen = false;
            const chatWindow = document.getElementById('rmpChatWindow');
            const bubble = document.getElementById('rmpChatBubble');
            chatWindow.style.display = 'none';
            bubble.style.display = 'flex';
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

    // Initialize the chat widget when DOM is ready
    function initRMPChatWidget(config) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new RMPChatWidget(config);
            });
        } else {
            new RMPChatWidget(config);
        }
    }

    // Make it available globally
    window.RMPChatWidget = RMPChatWidget;
    window.initRMPChatWidget = initRMPChatWidget;

    // Auto-initialize if no custom config needed
    initRMPChatWidget();
})(); 