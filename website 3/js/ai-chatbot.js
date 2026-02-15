/* ========================================
   AI CHATBOT - Premium Feature
   Yuki Izakaya Intelligent Assistant
   ======================================== */

class AIChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [
            {
                type: 'bot',
                text: '🍱 Welcome to Yuki Izakaya! How can I help you today?'
            },
            {
                type: 'user',
                text: 'Do you have gluten-free options?'
            },
            {
                type: 'bot',
                text: 'Yes! We have several gluten-free dishes including our signature sashimi platters, grilled fish, and vegetable tempura made with rice flour. Would you like to see our full gluten-free menu?',
                typing: true
            }
        ];
        this.currentMessageIndex = 0;
        this.init();
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
        setTimeout(() => this.showWidget(), 2000);
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'ai-chatbot';
        widget.innerHTML = `
            <div class="chatbot-trigger">
                <div class="chatbot-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <div class="chatbot-pulse"></div>
            </div>
            <div class="chatbot-window">
                <div class="chatbot-header">
                    <div class="chatbot-header-content">
                        <div class="chatbot-status">
                            <span class="status-dot"></span>
                            <span>AI Assistant</span>
                        </div>
                        <button class="chatbot-close" aria-label="Close chat">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 5L5 15M5 5l10 10"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="chatbot-messages" id="chatbot-messages"></div>
                <div class="chatbot-demo-label">
                    <span>✨ AI Demo - Intelligent Assistant</span>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
        this.widget = widget;
    }

    attachEventListeners() {
        const trigger = this.widget.querySelector('.chatbot-trigger');
        const closeBtn = this.widget.querySelector('.chatbot-close');

        trigger.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
    }

    showWidget() {
        this.widget.classList.add('chatbot-visible');
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.widget.classList.add('chatbot-open');
        this.startDemoConversation();
    }

    closeChat() {
        this.isOpen = false;
        this.widget.classList.remove('chatbot-open');
    }

    startDemoConversation() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.innerHTML = '';
        this.currentMessageIndex = 0;
        this.showNextMessage();
    }

    showNextMessage() {
        if (this.currentMessageIndex >= this.messages.length) return;

        const message = this.messages[this.currentMessageIndex];

        if (message.typing) {
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage(message);
                this.currentMessageIndex++;
                setTimeout(() => this.showNextMessage(), 1000);
            }, 1500);
        } else {
            this.addMessage(message);
            this.currentMessageIndex++;
            setTimeout(() => this.showNextMessage(), message.type === 'user' ? 800 : 1200);
        }
    }

    addMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `chatbot-message ${message.type}`;
        messageEl.innerHTML = `
            <div class="message-bubble">
                ${message.text}
            </div>
        `;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typing = document.createElement('div');
        typing.className = 'chatbot-message bot typing-indicator';
        typing.innerHTML = `
            <div class="message-bubble">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) indicator.remove();
    }
}

// Initialize AI Chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AIChatbot();
});
