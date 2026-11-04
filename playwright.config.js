// Behaviour tests against the real Google Chrome, the main target and preinstalled on the GitHub runner, so no browser download is needed
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: 'tests',
    forbidOnly: !!process.env.CI,
    reporter: process.env.CI ? 'github' : 'list',
    use: {
        baseURL: 'http://127.0.0.1:8080',
        channel: 'chrome'
    },
    // Serve src/ over HTTP like GitHub Pages does, since file:// handles URL rewriting differently
    webServer: {
        command: 'python3 -m http.server 8080 --bind 127.0.0.1 --directory src',
        url: 'http://127.0.0.1:8080',
        reuseExistingServer: !process.env.CI,
        // The server logs every request to stderr, too noisy for the test output
        stderr: 'ignore'
    }
});
