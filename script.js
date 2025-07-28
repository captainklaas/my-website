class ClaudeChat {
    constructor() {
        this.apiKey = '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'; // ⚠️ VISIBLE TO USERS
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        
        this.initializeEventListeners();
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
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',  // ← Cheapest option
                    max_tokens: 1000,
                    system: "You are a federal regulations assistant. Only provide information from eCFR.gov (Electronic Code of Federal Regulations). If a question isn't about federal regulations, politely decline and ask for a regulatory question instead. Always cite CFR sections when possible."
                    messages: [{ role: 'user', content: message }]
                })
            });

            const data = await response.json();
            this.addMessage(data.content[0].text, 'assistant');
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('Sorry, I encountered an error.', 'assistant');
        } finally {
            this.setLoading(false);
        }
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

        // Display user message
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.addMessage(data.response, 'assistant');
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
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