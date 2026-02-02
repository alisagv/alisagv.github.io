const { getData, setData } = require('../js/storage');

beforeEach(() => {
    localStorage.clear();
});

describe('getData', () => {
    test('returns defaultValue when key does not exist', () => {
        expect(getData('nonexistent', 42)).toBe(42);
    });

    test('returns defaultValue when key does not exist (object)', () => {
        expect(getData('nonexistent', { a: 1 })).toEqual({ a: 1 });
    });

    test('returns parsed number from localStorage', () => {
        localStorage.setItem('count', '10');
        expect(getData('count', 0)).toBe(10);
    });

    test('returns parsed string from localStorage', () => {
        localStorage.setItem('name', '"reza"');
        expect(getData('name', '')).toBe('reza');
    });

    test('returns parsed boolean from localStorage', () => {
        localStorage.setItem('flag', 'true');
        expect(getData('flag', false)).toBe(true);
    });

    test('returns parsed array from localStorage', () => {
        localStorage.setItem('items', '[1,2,3]');
        expect(getData('items', [])).toEqual([1, 2, 3]);
    });

    test('returns parsed object from localStorage', () => {
        localStorage.setItem('obj', '{"a":1,"b":"two"}');
        expect(getData('obj', {})).toEqual({ a: 1, b: 'two' });
    });

    test('returns defaultValue when stored value is malformed JSON', () => {
        localStorage.setItem('broken', '{not valid json}');
        expect(getData('broken', 'fallback')).toBe('fallback');
    });

    test('returns defaultValue when stored value is undefined string', () => {
        localStorage.setItem('undef', 'undefined');
        expect(getData('undef', 99)).toBe(99);
    });

    test('returns defaultValue when stored value is empty string', () => {
        localStorage.setItem('empty', '');
        expect(getData('empty', 'default')).toBe('default');
    });
});

describe('setData', () => {
    test('stores a number', () => {
        setData('num', 42);
        expect(localStorage.getItem('num')).toBe('42');
    });

    test('stores a string', () => {
        setData('str', 'hello');
        expect(localStorage.getItem('str')).toBe('"hello"');
    });

    test('stores a boolean', () => {
        setData('bool', true);
        expect(localStorage.getItem('bool')).toBe('true');
    });

    test('stores an array', () => {
        setData('arr', [1, 2, 3]);
        expect(localStorage.getItem('arr')).toBe('[1,2,3]');
    });

    test('stores an object', () => {
        setData('obj', { a: 1 });
        expect(localStorage.getItem('obj')).toBe('{"a":1}');
    });

    test('overwrites existing value', () => {
        setData('key', 'first');
        setData('key', 'second');
        expect(getData('key', '')).toBe('second');
    });
});

describe('getData and setData integration', () => {
    test('round-trip preserves data types', () => {
        const testCases = [
            42,
            'hello',
            true,
            false,
            null,
            [1, 'two', null],
            { nested: { deep: true } },
        ];

        testCases.forEach((value, i) => {
            const key = `test_${i}`;
            setData(key, value);
            expect(getData(key, 'MISSING')).toEqual(value);
        });
    });
});
