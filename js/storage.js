function getData(key, defaultValue) {
    try {
        const data = localStorage.getItem(key);
        if (data === null) return defaultValue;
        return JSON.parse(data);
    } catch (e) {
        return defaultValue;
    }
}

function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getData, setData };
}
