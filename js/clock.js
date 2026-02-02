function updateClock() {
    const now = new Date();
    const iranTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tehran" }));
    const hours = String(iranTime.getHours()).padStart(2, '0');
    const minutes = String(iranTime.getMinutes()).padStart(2, '0');
    document.getElementById('currentTime').textContent = `${hours}:${minutes}`;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { updateClock };
}
