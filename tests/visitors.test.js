const { initVisitors } = require('../js/visitors');

let store;

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
});

describe('initVisitors', () => {
    test('first visit increments from default (142 -> 143)', () => {
        const getData = makeGetData(store);
        const setData = makeSetData(store);
        const count = initVisitors(getData, setData);
        expect(count).toBe(143);
    });

    test('first visit persists new count and visited flag', () => {
        const getData = makeGetData(store);
        const setData = makeSetData(store);
        initVisitors(getData, setData);
        expect(JSON.parse(store['reza_visitors'])).toBe(143);
        expect(JSON.parse(store['reza_has_visited'])).toBe(true);
    });

    test('subsequent visit does not increment', () => {
        store['reza_has_visited'] = 'true';
        store['reza_visitors'] = '200';
        const getData = makeGetData(store);
        const setData = makeSetData(store);
        const count = initVisitors(getData, setData);
        expect(count).toBe(200);
    });

    test('subsequent visit does not write to storage', () => {
        store['reza_has_visited'] = 'true';
        store['reza_visitors'] = '200';
        const getData = makeGetData(store);
        const setData = jest.fn();
        initVisitors(getData, setData);
        expect(setData).not.toHaveBeenCalled();
    });

    test('cleared localStorage simulates a new visitor', () => {
        // First visit
        let getData = makeGetData(store);
        let setData = makeSetData(store);
        initVisitors(getData, setData);
        expect(JSON.parse(store['reza_visitors'])).toBe(143);

        // Clear localStorage (simulate new browser)
        delete store['reza_has_visited'];

        // Second visit with cleared flag but existing count
        getData = makeGetData(store);
        setData = makeSetData(store);
        const count = initVisitors(getData, setData);
        expect(count).toBe(144);
    });
});
