const { escapeHtml } = require('../js/escapeHtml');

describe('escapeHtml', () => {
    test('returns plain text unchanged', () => {
        expect(escapeHtml('hello world')).toBe('hello world');
    });

    test('escapes < and > characters', () => {
        const result = escapeHtml('<div>test</div>');
        expect(result).not.toContain('<div>');
        expect(result).toContain('&lt;');
        expect(result).toContain('&gt;');
    });

    test('escapes script tags', () => {
        const result = escapeHtml('<script>alert("xss")</script>');
        expect(result).not.toContain('<script>');
        expect(result).toContain('&lt;script&gt;');
    });

    test('escapes ampersand', () => {
        expect(escapeHtml('a & b')).toContain('&amp;');
    });

    test('handles empty string', () => {
        expect(escapeHtml('')).toBe('');
    });

    test('preserves Persian/Unicode text', () => {
        const persian = 'سلام رضا';
        expect(escapeHtml(persian)).toBe(persian);
    });

    test('escapes nested HTML tags', () => {
        const result = escapeHtml('<div><span>nested</span></div>');
        expect(result).not.toContain('<div>');
        expect(result).not.toContain('<span>');
    });

    test('escapes double quotes in attributes', () => {
        const result = escapeHtml('<img src="x" onerror="alert(1)">');
        expect(result).toContain('&lt;img');
    });

    test('handles single quotes', () => {
        const input = "it's a test";
        expect(escapeHtml(input)).toBe("it's a test");
    });

    test('escapes multiple special characters together', () => {
        const result = escapeHtml('<b>"Tom & Jerry"</b>');
        expect(result).toContain('&lt;');
        expect(result).toContain('&gt;');
        expect(result).toContain('&amp;');
    });
});
