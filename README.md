# Bookmark Separator

A minimal web tool to add visual separators to the bookmarks bar in Chrome, Edge and Brave. Easily added by drag and drop, without installing any browser extension.

<p>
  <a href="https://github.com/ddrimus/bookmark-separator/actions/workflows/javascript-test-suite.yml"><img src="https://img.shields.io/github/actions/workflow/status/ddrimus/bookmark-separator/javascript-test-suite.yml?branch=main&label=Test%20Suite&labelColor=404951" alt="Test Suite"></a>
  <a href="https://github.com/ddrimus/bookmark-separator/actions/workflows/github-pages-build-deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/ddrimus/bookmark-separator/github-pages-build-deploy.yml?branch=main&label=Site%20Build&labelColor=404951" alt="Site Build"></a>
</p>

## Features

- Five separator styles: vertical, horizontal, double, dot and blank.
- Unlimited separators, each with its own icon.
- Restore a missing icon by clicking the separator.
- Static page, easy to host yourself.

## Browser Support

Works in Chrome, Edge and Brave, which don't have built-in separators. Firefox and Vivaldi already support them from the bookmarks bar context menu. Safari isn't supported because it doesn't show icons in the Favorites bar.

## Installation

### Hosted Version

1. Open **[ddrimus.github.io/bookmark-separator](https://ddrimus.github.io/bookmark-separator/)**.
2. Show the bookmarks bar with `Ctrl` + `Shift` + `B` (`⌘` + `Shift` + `B` on macOS).
3. Drag a separator onto the bar.
4. If a name shows up next to the icon, right-click the bookmark, choose **Edit** and clear the name.

### Self-Host

1. Fork this repository.
2. Go to **Settings** → **Pages** and set **Source** to **GitHub Actions**.
3. Update the `og:url` and `og:image` addresses in `src/index.html` to your copy.
4. Push to the `main` branch, the site deploys automatically.

## How It Works

Each separator is a link to the page with its style and a random ID, for example `?dot#<uuid>`. When you drag it, the page updates its favicon to match the style and the browser saves that icon for the bookmark.

## Contributing

If you have any improvements, additional information, or notice any issues with the Bookmark Separator, we'd love to hear from you! Feel free to open a pull request with your suggestions or details.

To run lint and tests locally (requires Google Chrome and Python 3):

```bash
npm ci
npm run lint
npm test
```

If you encounter any problems with the tool or believe something isn’t working as expected, please provide all relevant information in an [issue](https://github.com/ddrimus/bookmark-separator/issues), including your browser and its version. Your contributions, suggestions, and feedback are always welcome and appreciated!
