function createGuestbook(getData, setData, escapeHtml, showToast) {
    let messages = getData('reza_messages', []);

    function renderMessages(containerEl, messageCountEl) {
        messageCountEl.textContent = messages.length;

        if (messages.length === 0) {
            containerEl.innerHTML = '<div class="no-messages">هنوز پیامی نیست. اولین نفر باش! 💫</div>';
            return;
        }

        containerEl.innerHTML = messages.slice().reverse().map(msg => `
            <div class="message">
                <div class="message-header">
                    <span class="message-name">${escapeHtml(msg.name)}</span>
                    <span class="message-time">${msg.time}</span>
                </div>
                <div class="message-text">${escapeHtml(msg.text)}</div>
            </div>
        `).join('');
    }

    function addMessage(name, text) {
        name = name.trim();
        text = text.trim();

        if (!name || !text) return false;

        const now = new Date();
        const time = now.toLocaleDateString('fa-IR');

        messages.push({ name, text, time });
        setData('reza_messages', messages);
        showToast('پیامت ثبت شد! 🎉');
        return true;
    }

    function getMessages() {
        return messages;
    }

    return { renderMessages, addMessage, getMessages };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createGuestbook };
}
