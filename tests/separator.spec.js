import { test, expect } from '@playwright/test';

// Same shape the page generates, the hash of every separator URL
const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';

// A distinctive piece of each style's favicon SVG, enough to tell them apart
const ICON_MARKERS = {
    vert: '<line x1="8" x2="8" y2="16"',
    horz: '<line x2="16" y1="8" y2="8"',
    double: '<line x1="6" x2="6" y2="16"',
    dot: '<circle',
    blank: 'viewBox="0 0 16 16"></svg>'
};

// Decoded favicon SVG currently set on the page
async function faviconSvg(page) {
    const href = await page.locator('#favicon').getAttribute('href');
    return decodeURIComponent(href.replace('data:image/svg+xml,', ''));
}

// Path, query and hash of the current page URL, the part the page rewrites
function relativeUrl(page) {
    const url = new URL(page.url());
    return url.search + url.hash;
}

// Start of a drag on a separator; pointerdown with the primary button is what the page listens for
async function pressSeparator(page, type) {
    await page.locator(`.separator[data-type="${type}"]`).dispatchEvent('pointerdown', { button: 0 });
}

test.describe('separator links', () => {
    for (const type of Object.keys(ICON_MARKERS)) {
        // Test that every press gives a fresh URL, otherwise two separators would share one favicon
        test(`${type} gets a new unique URL on every press`, async ({ page }) => {
            await page.goto(`/?${type}`);
            const link = page.locator(`.separator[data-type="${type}"]`);

            await pressSeparator(page, type);
            const first = await link.getAttribute('href');
            await pressSeparator(page, type);
            const second = await link.getAttribute('href');

            expect(first).toMatch(new RegExp(`^\\?${type}#${UUID}$`));
            expect(second).toMatch(new RegExp(`^\\?${type}#${UUID}$`));
            expect(second).not.toBe(first);
        });

        // Test that the page URL and favicon match the dragged link, that pair is what the browser stores for the bookmark
        test(`${type} sets the page URL and the ${type} favicon`, async ({ page }) => {
            await page.goto(`/?${type}`);
            await pressSeparator(page, type);

            const href = await page.locator(`.separator[data-type="${type}"]`).getAttribute('href');
            expect(relativeUrl(page)).toBe(href);
            expect(await faviconSvg(page)).toContain(ICON_MARKERS[type]);
        });
    }

    // Test that a click doesn't navigate away, separators are only meant to be dragged; the switch from vert takes a moment, hence the poll
    test('clicking a separator does not navigate', async ({ page }) => {
        await page.goto('/');
        await page.locator('.separator[data-type="dot"]').click();

        await expect.poll(() => relativeUrl(page)).toMatch(new RegExp(`^\\?dot#${UUID}$`));
        expect(new URL(page.url()).pathname).toBe('/');
        await expect(page.locator('#restored')).toBeHidden();
    });

    // Test that a right-click leaves the URL alone, only the primary button starts a drag
    test('non-primary buttons are ignored', async ({ page }) => {
        await page.goto('/');
        await page.locator('.separator[data-type="horz"]').dispatchEvent('pointerdown', { button: 2 });

        expect(relativeUrl(page)).toBe('');
        expect(await faviconSvg(page)).toContain(ICON_MARKERS.vert);
    });
});

test.describe('switching styles', () => {
    // Test that the old style gets a fresh URL before the favicon changes, so the last bookmark of that style keeps its icon
    test('moves to a fresh URL for the previous style before switching', async ({ page }) => {
        await page.goto('/');
        await pressSeparator(page, 'vert');
        const vertBookmark = relativeUrl(page);

        await pressSeparator(page, 'horz');
        const intermediate = relativeUrl(page);
        expect(intermediate).toMatch(new RegExp(`^\\?vert#${UUID}$`));
        expect(intermediate).not.toBe(vertBookmark);
        expect(await faviconSvg(page)).toContain(ICON_MARKERS.vert);

        const horzBookmark = await page.locator('.separator[data-type="horz"]').getAttribute('href');
        await expect.poll(() => relativeUrl(page)).toBe(horzBookmark);
        expect(await faviconSvg(page)).toContain(ICON_MARKERS.horz);
    });

    // Test that going back to the current style cancels the pending switch, or its late timer would apply the stale style
    test('a rapid press back to the current style cancels the pending switch', async ({ page }) => {
        await page.goto('/');
        await pressSeparator(page, 'horz');
        await pressSeparator(page, 'vert');

        const vertBookmark = await page.locator('.separator[data-type="vert"]').getAttribute('href');
        await page.waitForTimeout(200);
        expect(relativeUrl(page)).toBe(vertBookmark);
        expect(await faviconSvg(page)).toContain(ICON_MARKERS.vert);
    });
});

test.describe('opening a separator bookmark', () => {
    const bookmark = '/?dot#3f2b8c1e-9a4d-4e7f-8b2a-1c5d6e7f8a9b';

    // Test that opening a bookmark shows the notice and its favicon, the visit is what restores a lost icon
    test('shows the restored notice and the matching favicon', async ({ page }) => {
        await page.goto(bookmark);

        await expect(page.locator('#restored')).toBeVisible();
        expect(await faviconSvg(page)).toContain(ICON_MARKERS.dot);
    });

    // Test that a reload hides the notice, after a drag the URL has a UUID too
    test('hides the notice on reload', async ({ page }) => {
        await page.goto(bookmark);
        await page.reload();

        await expect(page.locator('#restored')).toBeHidden();
    });

    // Test that the plain page and hashes that aren't separator UUIDs never show the notice
    for (const url of ['/', '/?dot', '/?dot#not-a-uuid', '/?unknown#3f2b8c1e-9a4d-4e7f-8b2a-1c5d6e7f8a9b']) {
        test(`hides the notice for ${url}`, async ({ page }) => {
            await page.goto(url);
            await expect(page.locator('#restored')).toBeHidden();
        });
    }
});
