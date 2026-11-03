// Gives every dragged separator a unique link and switches the page favicon to its style, so each bookmark keeps its own icon

// Wait before switching the favicon to another style, so the browser stores the old icon for the fresh URL first
const FAVICON_SWITCH_DELAY_MS = 50;

// Favicon shape for each separator style, keyed by the query parameter used in its URL; blank is a transparent icon used as a spacer
const SEPARATOR_ICONS = {
    vert: '<line x1="8" x2="8" y2="16" stroke="#a7a09f"/>',
    horz: '<line x2="16" y1="8" y2="8" stroke="#a7a09f"/>',
    double: '<line x1="6" x2="6" y2="16" stroke="#a7a09f"/><line x1="10" x2="10" y2="16" stroke="#a7a09f"/>',
    dot: '<circle cx="8" cy="8" r="2" fill="#a7a09f"/>',
    blank: ''
};

// Style used when the URL names none, matching the original vertical-only page
const DEFAULT_TYPE = 'vert';

// A UUID v4 in the hash means the page was opened from a separator bookmark, not from the plain page URL
const UUID_HASH_RE = /^#[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Generate SVG favicon data URI for separator style
function createSVGFavicon(type) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">${SEPARATOR_ICONS[type]}</svg>`;

    return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

// Update page favicon for specified separator style
function setPageFavicon(type) {
    document.getElementById('favicon').href = createSVGFavicon(type);
}

// Read the separator style from the current page URL, the default style when none is set
function getCurrentType() {
    const params = new URLSearchParams(location.search);
    return Object.keys(SEPARATOR_ICONS).find(type => params.has(type)) || DEFAULT_TYPE;
}

// Generate random UUID v4 for unique bookmark URLs; falls back to Math.random where crypto.randomUUID is missing
function generateRandomUUID() {
    return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
}

// Show the macOS modifier key in the guide; userAgentData first, navigator.platform where it is missing
function isMac() {
    const platform = navigator.userAgentData?.platform || navigator.platform || '';
    return /mac/i.test(platform);
}

// Tell visitors who opened a separator that its icon is back; skipped on reload, since after a drag the URL has a UUID too
function showRestoredNotice() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation?.type === 'reload' || !UUID_HASH_RE.test(location.hash)) return;

    const params = new URLSearchParams(location.search);
    if (Object.keys(SEPARATOR_ICONS).some(type => params.has(type))) {
        document.getElementById('restored').hidden = false;
    }
}

// Initialize favicon based on URL parameter; for a separator bookmark this is what restores its icon
setPageFavicon(getCurrentType());
showRestoredNotice();

// Swap Ctrl for ⌘ in the shortcut keys on macOS
if (isMac()) {
    document.querySelectorAll('.mod-key').forEach(key => {
        key.textContent = '⌘';
    });
}

// Pending favicon switch, cancelled on the next press so a rapid double press never applies a stale one
let pendingSwitch = null;

// Attach drag handlers to separator elements
document.querySelectorAll('.separator').forEach(elem => {
    const sepType = elem.dataset.type;

    // Pointer events cover mouse, pen and touch; only the primary button starts a drag
    elem.addEventListener('pointerdown', e => {
        if (e.button !== 0) return;

        clearTimeout(pendingSwitch);

        const url = `?${sepType}#${generateRandomUUID()}`;
        elem.href = url;

        const currentType = getCurrentType();

        // Move the page to a fresh URL for the previous style first, so bookmarks already made keep their icon
        if (currentType !== sepType) {
            history.replaceState(null, '', `?${currentType}#${generateRandomUUID()}`);
            pendingSwitch = setTimeout(() => {
                setPageFavicon(sepType);
                history.replaceState(null, '', url);
            }, FAVICON_SWITCH_DELAY_MS);
        } else {
            setPageFavicon(sepType);
            history.replaceState(null, '', url);
        }
    });

    // Separators are only meant to be dragged, a click should not navigate
    elem.addEventListener('click', e => e.preventDefault());
});
