const { createGuestbook } = require('../js/guestbook');
const { escapeHtml } = require('../js/escapeHtml');

let store;
let toastMessages;
let guestbook;

function makeGetData(storage) {
    return (key, defaultValue) => {
        try {
            const data = storage[key];
            if (data === undefined) return defaultValue;
            return JSON.parse(data);
        } catch (e) {
            return defaultValue;
        }
    };
}

function makeSetData(storage) {
    return (key, value) => {
        storage[key] = JSON.stringify(value);
    };
}

beforeEach(() => {
    store = {};
    toastMessages = [];
    const getData = makeGetData(store);
    const setData = makeSetData(store);
    const showToast = (msg) => toastMessages.push(msg);
    guestbook = createGuestbook(getData, setData, escapeHtml, showToast);
});

describe('addMessage', () => {
    test('adds a valid message and returns true', () => {
        const result = guestbook.addMessage('Ali', 'Hello!');
        expect(result).toBe(true);
        expect(guestbook.getMessages()).toHaveLength(1);
        expect(guestbook.getMessages()[0].name).toBe('Ali');
        expect(guestbook.getMessages()[0].text).toBe('Hello!');
    });

    test('rejects empty name', () => {
        expect(guestbook.addMessage('', 'Hello!')).toBe(false);
        expect(guestbook.getMessages()).toHaveLength(0);
    });

    test('rejects empty text', () => {
        expect(guestbook.addMessage('Ali', '')).toBe(false);
        expect(guestbook.getMessages()).toHaveLength(0);
    });

    test('rejects whitespace-only name', () => {
        expect(guestbook.addMessage('   ', 'Hello!')).toBe(false);
        expect(guestbook.getMessages()).toHaveLength(0);
    });

    test('rejects whitespace-only text', () => {
        expect(guestbook.addMessage('Ali', '   ')).toBe(false);
        expect(guestbook.getMessages()).toHaveLength(0);
    });

    test('trims whitespace from name and text', () => {
        guestbook.addMessage('  Ali  ', '  Hello!  ');
        expect(guestbook.getMessages()[0].name).toBe('Ali');
        expect(guestbook.getMessages()[0].text).toBe('Hello!');
    });

    test('stores message with time field', () => {
        guestbook.addMessage('Ali', 'Hello!');
        expect(guestbook.getMessages()[0]).toHaveProperty('time');
        expect(typeof guestbook.getMessages()[0].time).toBe('string');
    });

    test('persists messages to storage', () => {
        guestbook.addMessage('Ali', 'First');
        guestbook.addMessage('Reza', 'Second');
        const stored = JSON.parse(store['reza_messages']);
        expect(stored).toHaveLength(2);
    });

    test('shows toast on successful submission', () => {
        guestbook.addMessage('Ali', 'Hello!');
        expect(toastMessages).toHaveLength(1);
        expect(toastMessages[0]).toContain('پیامت ثبت شد');
    });

    test('does not show toast on failed submission', () => {
        guestbook.addMessage('', '');
        expect(toastMessages).toHaveLength(0);
    });
});

describe('renderMessages', () => {
    let container;
    let countEl;

    beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div><span id="count"></span>';
        container = document.getElementById('container');
        countEl = document.getElementById('count');
    });

    test('shows empty state when no messages', () => {
        guestbook.renderMessages(container, countEl);
        expect(container.innerHTML).toContain('هنوز پیامی نیست');
        expect(countEl.textContent).toBe('0');
    });

    test('renders messages in reverse order (newest first)', () => {
        guestbook.addMessage('First', 'Message 1');
        guestbook.addMessage('Second', 'Message 2');
        guestbook.renderMessages(container, countEl);

        const names = container.querySelectorAll('.message-name');
        expect(names[0].textContent).toBe('Second');
        expect(names[1].textContent).toBe('First');
    });

    test('updates message count', () => {
        guestbook.addMessage('A', 'msg1');
        guestbook.addMessage('B', 'msg2');
        guestbook.addMessage('C', 'msg3');
        guestbook.renderMessages(container, countEl);
        expect(countEl.textContent).toBe('3');
    });

    test('escapes HTML in message names', () => {
        guestbook.addMessage('<script>xss</script>', 'safe text');
        guestbook.renderMessages(container, countEl);
        expect(container.innerHTML).not.toContain('<script>');
        expect(container.innerHTML).toContain('&lt;script&gt;');
    });

    test('escapes HTML in message text', () => {
        guestbook.addMessage('Ali', '<img onerror="alert(1)">');
        guestbook.renderMessages(container, countEl);
        expect(container.innerHTML).not.toContain('<img');
    });
});

describe('getMessages', () => {
    test('returns empty array initially', () => {
        expect(guestbook.getMessages()).toEqual([]);
    });

    test('returns all added messages', () => {
        guestbook.addMessage('A', 'one');
        guestbook.addMessage('B', 'two');
        expect(guestbook.getMessages()).toHaveLength(2);
    });
});
