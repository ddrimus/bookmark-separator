// Generate SVG favicon data URI for separator type
function createSVGFavicon(type) {
    const svg = type === 'vert'
        ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><line x1="8" x2="8" y2="16" stroke="#a7a09f"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><line x2="16" y1="8" y2="8" stroke="#a7a09f"/></svg>';

    return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

// Update page favicon for specified separator type
function setPageFavicon(type) {
    document.getElementById('favicon').href = createSVGFavicon(type);
}

// Generate random UUID v4 for unique bookmark URLs
function generateRandomUUID() {
    return typeof crypto.randomUUID !== 'undefined'
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
}

// Initialize favicon based on URL parameter
setPageFavicon(new URLSearchParams(location.search).has('horz') ? 'horz' : 'vert');

// Attach drag handlers to separator elements
document.querySelectorAll('.separator').forEach(elem => {
    const sepType = elem.dataset.type;

    elem.addEventListener('mousedown', e => {
        if (e.button === 0) {
            const uuid = generateRandomUUID();
            const url = `?${sepType}#${uuid}`;
            elem.href = url;

            const currentType = new URLSearchParams(location.search).has('horz') ? 'horz' : 'vert';

            // Preserve previous type URL before switching to ensure icon caching
            if (currentType !== sepType) {
                history.replaceState(null, '', `?${currentType}#${generateRandomUUID()}`);
                setTimeout(() => {
                    setPageFavicon(sepType);
                    history.replaceState(null, '', url);
                }, 10);
            } else {
                setPageFavicon(sepType);
                history.replaceState(null, '', url);
            }
        }
    });

    elem.addEventListener('click', e => e.preventDefault());
});