const { showToast } = require('../js/toast');

beforeEach(() => {
    document.body.innerHTML = '<div class="toast" id="toast"></div>';
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

describe('showToast', () => {
    test('sets text content of toast element', () => {
        showToast('Hello!');
        expect(document.getElementById('toast').textContent).toBe('Hello!');
    });

    test('adds the show class', () => {
        showToast('Test');
        expect(document.getElementById('toast').classList.contains('show')).toBe(true);
    });

    test('removes the show class after 3 seconds', () => {
        showToast('Test');
        expect(document.getElementById('toast').classList.contains('show')).toBe(true);
        jest.advanceTimersByTime(3000);
        expect(document.getElementById('toast').classList.contains('show')).toBe(false);
    });

    test('does not remove show class before 3 seconds', () => {
        showToast('Test');
        jest.advanceTimersByTime(2999);
        expect(document.getElementById('toast').classList.contains('show')).toBe(true);
    });

    test('handles Persian text', () => {
        showToast('پیامت ثبت شد! 🎉');
        expect(document.getElementById('toast').textContent).toBe('پیامت ثبت شد! 🎉');
    });
});
