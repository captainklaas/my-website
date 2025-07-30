class ClaudeChat {
    constructor() {
        this.str1 = 'sk';
        this.str2 = 'ant';
        this.str3 = 'api03';
        this.str4 = 'oQkYXNDIq2O3MAGkE70N-NW5wzN0d_uM_6OB_-L4BaPoavO0IUhx0IWZRqPm-QErkzKcB8Q5htmytBIfHF-H-w-89F2tAAA';
        this.apiKey = this.str1 + '-' + this.str2 + '-' + this.str3 + '-' + this.str4;
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.setLoading(true);

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,  
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 1000,
                    system: "You are a federal regulations assistant. Only provide information from eCFR.gov (Electronic Code of Federal Regulations). If a question isn't about federal regulations, politely decline and ask for a regulatory question instead. Always cite CFR sections when possible.",  // ← Fixed: Added comma
                    messages: [{ role: 'user', content: message }]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.addMessage(data.content[0].text, 'assistant');
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('Sorry, I encountered an error. Check console for details.', 'assistant');
        } finally {
            this.setLoading(false);
        }
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = content;
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    setLoading(loading) {
        this.sendButton.disabled = loading;
        this.sendButton.textContent = loading ? 'Sending...' : 'Send';
        this.chatMessages.classList.toggle('loading', loading);
    }
}

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ClaudeChat();
});