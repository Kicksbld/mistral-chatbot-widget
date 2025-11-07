(function() {
  'use strict';

  window.ChatbotWidget = {
    config: null,
    isOpen: false,
    conversationId: null,
    sessionId: null,
    messages: [],

    init: function(config) {
      this.config = config;
      this.sessionId = this.generateSessionId();
      this.render();
      this.attachEventListeners();
    },

    generateSessionId: function() {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    render: function() {
      const position = this.config.position || 'bottom-right';
      const positionClass = position === 'bottom-left' ? 'chatbot-widget-left' : 'chatbot-widget-right';

      const widgetHTML = `
        <div id="chatbot-widget-container" class="chatbot-widget-container ${positionClass}">
          <!-- Chat Button -->
          <button id="chatbot-toggle-btn" class="chatbot-toggle-btn" style="background-color: ${this.config.primaryColor}">
            <svg class="chatbot-icon-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <svg class="chatbot-icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Chat Window -->
          <div id="chatbot-window" class="chatbot-window">
            <!-- Header -->
            <div class="chatbot-header" style="background-color: ${this.config.primaryColor}">
              <div class="chatbot-header-info">
                <div class="chatbot-header-title">${this.config.agentName}</div>
                <div class="chatbot-header-subtitle">${this.config.agentRole}</div>
              </div>
              <button id="chatbot-close-btn" class="chatbot-close-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Messages -->
            <div id="chatbot-messages" class="chatbot-messages">
              ${this.config.greetingMessage ? `
                <div class="chatbot-message chatbot-message-assistant">
                  <div class="chatbot-message-content">${this.config.greetingMessage}</div>
                </div>
              ` : ''}
            </div>

            <!-- Input -->
            <div class="chatbot-input-container">
              <form id="chatbot-form" class="chatbot-form">
                <input
                  id="chatbot-input"
                  type="text"
                  class="chatbot-input"
                  placeholder="Écrivez votre message..."
                  autocomplete="off"
                />
                <button type="submit" class="chatbot-send-btn" style="background-color: ${this.config.primaryColor}">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>
            </div>

            <!-- Typing Indicator -->
            <div id="chatbot-typing" class="chatbot-typing" style="display: none;">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', widgetHTML);
    },

    attachEventListeners: function() {
      const toggleBtn = document.getElementById('chatbot-toggle-btn');
      const closeBtn = document.getElementById('chatbot-close-btn');
      const form = document.getElementById('chatbot-form');

      toggleBtn.addEventListener('click', () => this.toggleChat());
      closeBtn.addEventListener('click', () => this.closeChat());
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    toggleChat: function() {
      this.isOpen = !this.isOpen;
      const window = document.getElementById('chatbot-window');
      const container = document.getElementById('chatbot-widget-container');

      if (this.isOpen) {
        container.classList.add('chatbot-widget-open');
        window.style.display = 'flex';
        document.getElementById('chatbot-input').focus();
      } else {
        this.closeChat();
      }
    },

    closeChat: function() {
      this.isOpen = false;
      const window = document.getElementById('chatbot-window');
      const container = document.getElementById('chatbot-widget-container');
      container.classList.remove('chatbot-widget-open');
      window.style.display = 'none';
    },

    handleSubmit: async function(e) {
      e.preventDefault();

      const input = document.getElementById('chatbot-input');
      const message = input.value.trim();

      if (!message) return;

      // Clear input
      input.value = '';

      // Add user message to UI
      this.addMessage('user', message);

      // Show typing indicator
      this.showTyping(true);

      try {
        const response = await fetch(this.config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-agent-api-key': this.config.apiKey,
          },
          body: JSON.stringify({
            message: message,
            sessionId: this.sessionId,
            conversationId: this.conversationId,
            metadata: {
              url: window.location.href,
              userAgent: navigator.userAgent,
            },
          }),
        });

        const data = await response.json();
        console.log('API Response:', data);
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to send message');
        }

        // Check if we have a message
        if (!data.message) {
          console.error('No message in response:', data);
          throw new Error('No message received from server');
        }

        console.log('Message to display:', data.message);

        // Store conversation ID
        if (data.conversationId) {
          this.conversationId = data.conversationId;
          console.log('Conversation ID stored:', this.conversationId);
        }

        // Add assistant message to UI
        console.log('Adding message to UI...');
        this.addMessage('assistant', data.message);
        console.log('Message added successfully');
      } catch (error) {
        console.error('Chat error:', error);
        this.addMessage('assistant', 'Désolé, une erreur s\'est produite. Veuillez réessayer.');
      } finally {
        this.showTyping(false);
      }
    },

    addMessage: function(role, content) {
      const messagesContainer = document.getElementById('chatbot-messages');
      const messageClass = role === 'user' ? 'chatbot-message-user' : 'chatbot-message-assistant';

      const messageHTML = `
        <div class="chatbot-message ${messageClass}">
          <div class="chatbot-message-content">${this.escapeHtml(content)}</div>
        </div>
      `;

      messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    showTyping: function(show) {
      const typing = document.getElementById('chatbot-typing');
      typing.style.display = show ? 'flex' : 'none';

      if (show) {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    },

    escapeHtml: function(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },
  };
})();
