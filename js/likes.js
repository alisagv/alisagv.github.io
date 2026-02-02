function initLikes(getData, setData, showToast) {
    let likes = getData('reza_likes', 89);

    function handleLikeClick(widgetValueEl, likeCountEl) {
        const hasLiked = getData('reza_has_liked', false);
        if (!hasLiked) {
            likes++;
            setData('reza_likes', likes);
            setData('reza_has_liked', true);
            likeCountEl.textContent = likes;
            widgetValueEl.textContent = 'ممنون! 💖';
            showToast('لایکت ثبت شد! ❤️');
            return { liked: true, likes };
        } else {
            showToast('قبلاً لایک کردی! 😊');
            return { liked: false, likes };
        }
    }

    return { likes, handleLikeClick };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initLikes };
}
