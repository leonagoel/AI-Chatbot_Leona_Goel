// DOM Elements
const chatForm = document.getElementById('chat-form');
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const typingTemplate = document.getElementById('typing-template');
const themeToggle = document.getElementById('theme-toggle');
const darkModeSwitch = document.getElementById('dark-mode');
const typingSwitch = document.getElementById('typing-indicator');
const soundSwitch = document.getElementById('sound-effects');
const messageCountLabel = document.getElementById('message-count');
const attachBtn = document.getElementById('attach-btn');
const voiceBtn = document.getElementById('voice-btn');
const emojiBtn = document.getElementById('emoji-btn');

// State Management
const state = {
    messageCount: 1,
    theme: localStorage.getItem('theme') || 'light',
    typingIndicatorEnabled: true,
    soundEnabled: true,
    isRecording: false
};

// Notification Sound (Web Audio API)
const playSound = () => {
    if (!state.soundEnabled) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
};

function init() {
    setTheme(state.theme);
    setupEventListeners();
}

function setupEventListeners() {
    // Theme & Toggles
    themeToggle.addEventListener('click', () => setTheme(state.theme === 'light' ? 'dark' : 'light'));
    darkModeSwitch.addEventListener('change', (e) => setTheme(e.target.checked ? 'dark' : 'light'));
    typingSwitch.addEventListener('change', (e) => state.typingIndicatorEnabled = e.target.checked);
    soundSwitch.addEventListener('change', (e) => state.soundEnabled = e.target.checked);

    // Chat Logic
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSendMessage();
    });

    // Action Buttons
    attachBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => appendMessage('user', `📎 Attached file: ${e.target.files[0].name}`);
        input.click();
    });

    voiceBtn.addEventListener('click', () => {
        state.isRecording = !state.isRecording;
        if (state.isRecording) {
            voiceBtn.classList.add('pulse-red');
            userInput.placeholder = "Listening...";
        } else {
            voiceBtn.classList.remove('pulse-red');
            userInput.placeholder = "Ask NeuraChat anything...";
            userInput.value = "Tell me about AI design.";
        }
    });

    emojiBtn.addEventListener('click', () => {
        const emojis = ['😊', '🤖', '✨', '🚀'];
        userInput.value += emojis[Math.floor(Math.random() * emojis.length)];
        userInput.focus();
    });
}

function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    darkModeSwitch.checked = (theme === 'dark');
    themeToggle.querySelector('i').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function handleSendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    userInput.value = '';
    
    let indicator = null;
    if (state.typingIndicatorEnabled) {
        indicator = document.createElement('div');
        indicator.appendChild(typingTemplate.content.cloneNode(true));
        chatWindow.appendChild(indicator);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    setTimeout(() => {
        if (indicator) chatWindow.removeChild(indicator);
        appendMessage('bot', "That's a great question! I am now fully functional with your new UI updates.");
        playSound();
        state.messageCount += 2;
        messageCountLabel.innerText = state.messageCount;
    }, 1500);
}

function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.innerHTML = `
        <div class="message-header">
            <span class="sender">${sender === 'user' ? 'You' : 'NeuraChat AI'}</span>
            <span class="timestamp">Just now</span>
        </div>
        <div class="message-content">${text}</div>
    `;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

init();