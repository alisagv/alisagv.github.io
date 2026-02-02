function initVisitors(getData, setData) {
    let visitors = getData('reza_visitors', 142);
    const hasVisited = getData('reza_has_visited', false);
    if (!hasVisited) {
        visitors++;
        setData('reza_visitors', visitors);
        setData('reza_has_visited', true);
    }
    return visitors;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initVisitors };
}
