const { updateClock } = require('../js/clock');

beforeEach(() => {
    document.body.innerHTML = '<div id="currentTime">--:--</div>';
});

describe('updateClock', () => {
    test('updates the DOM element with time format HH:MM', () => {
        updateClock();
        const text = document.getElementById('currentTime').textContent;
        expect(text).toMatch(/^\d{2}:\d{2}$/);
    });

    test('hours are zero-padded', () => {
        jest.spyOn(Date.prototype, 'toLocaleString').mockReturnValue('1/1/2025, 3:05:00 AM');
        updateClock();
        const text = document.getElementById('currentTime').textContent;
        expect(text).toBe('03:05');
        jest.restoreAllMocks();
    });

    test('minutes are zero-padded', () => {
        jest.spyOn(Date.prototype, 'toLocaleString').mockReturnValue('1/1/2025, 12:07:00 PM');
        updateClock();
        const text = document.getElementById('currentTime').textContent;
        expect(text).toBe('12:07');
        jest.restoreAllMocks();
    });

    test('replaces placeholder text', () => {
        expect(document.getElementById('currentTime').textContent).toBe('--:--');
        updateClock();
        expect(document.getElementById('currentTime').textContent).not.toBe('--:--');
    });
});
