const { initLikes } = require('../js/likes');

let store;
let toastMessages;

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
});

function setup() {
    const getData = makeGetData(store);
    const setData = makeSetData(store);
    const showToast = (msg) => toastMessages.push(msg);
    return initLikes(getData, setData, showToast);
}

describe('initLikes', () => {
    test('starts with default like count of 89', () => {
        const { likes } = setup();
        expect(likes).toBe(89);
    });

    test('reads existing like count from storage', () => {
        store['reza_likes'] = '200';
        const { likes } = setup();
        expect(likes).toBe(200);
    });
});

describe('handleLikeClick', () => {
    let widgetValueEl;
    let likeCountEl;

    beforeEach(() => {
        document.body.innerHTML = '<div id="widget-value">لایک کن!</div><div id="like-count">89</div>';
        widgetValueEl = document.getElementById('widget-value');
        likeCountEl = document.getElementById('like-count');
    });

    test('first click increments like count', () => {
        const { handleLikeClick } = setup();
        const result = handleLikeClick(widgetValueEl, likeCountEl);
        expect(result.liked).toBe(true);
        expect(result.likes).toBe(90);
    });

    test('first click updates DOM elements', () => {
        const { handleLikeClick } = setup();
        handleLikeClick(widgetValueEl, likeCountEl);
        expect(likeCountEl.textContent).toBe('90');
        expect(widgetValueEl.textContent).toBe('ممنون! 💖');
    });

    test('first click shows success toast', () => {
        const { handleLikeClick } = setup();
        handleLikeClick(widgetValueEl, likeCountEl);
        expect(toastMessages).toHaveLength(1);
        expect(toastMessages[0]).toContain('لایکت ثبت شد');
    });

    test('second click does NOT increment', () => {
        const { handleLikeClick } = setup();
        handleLikeClick(widgetValueEl, likeCountEl);
        const result = handleLikeClick(widgetValueEl, likeCountEl);
        expect(result.liked).toBe(false);
        expect(result.likes).toBe(90);
    });

    test('second click shows already-liked toast', () => {
        const { handleLikeClick } = setup();
        handleLikeClick(widgetValueEl, likeCountEl);
        toastMessages.length = 0;
        handleLikeClick(widgetValueEl, likeCountEl);
        expect(toastMessages[0]).toContain('قبلاً لایک کردی');
    });

    test('persists like state to storage', () => {
        const { handleLikeClick } = setup();
        handleLikeClick(widgetValueEl, likeCountEl);
        expect(JSON.parse(store['reza_has_liked'])).toBe(true);
        expect(JSON.parse(store['reza_likes'])).toBe(90);
    });

    test('previously liked user cannot like again', () => {
        store['reza_has_liked'] = 'true';
        store['reza_likes'] = '100';
        const { handleLikeClick } = setup();
        const result = handleLikeClick(widgetValueEl, likeCountEl);
        expect(result.liked).toBe(false);
        expect(result.likes).toBe(100);
    });
});
