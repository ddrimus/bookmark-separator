# Bookmark Separator

A minimal tool for creating drag-and-drop bookmark separators with visual icons. Generate vertical (|) and horizontal (—) separators that maintain distinct favicons across all browsers.

## Features

**🎯 Core**: Pure vanilla JavaScript, SVG favicons, zero dependencies, self-hostable.

**🔄 Smart URLs**: Unique URL generation prevents browser caching conflicts, supports multiple separators.

**🎨 Visual**: Distinct vertical and horizontal icons, persistent favicons, minimalist design.

## Quick Start

### Option 1: Use Hosted Version

Visit the live demo and drag separators to your bookmarks bar:

**[https://ddrimus.github.io/bookmark-separator/](https://ddrimus.github.io/bookmark-separator/)**

### Option 2: Self-Host on GitHub Pages

Fork and deploy your own instance:

1. Fork this repository.
2. Go to **Settings** → **Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` branch - deploys automatically.

Access at `https://<username>.github.io/bookmark-separator/`.

### Option 3: Run Locally

Clone and open in your browser:

```bash
git clone https://github.com/ddrimus/bookmark-separator.git
cd bookmark-separator/src
```

Open `index.html` in any browser. No server required.

## How It Works

Each separator uses a unique URL with query parameters (`?vert` or `?horz`) and hash fragments. When dragged, a random UUID is generated and the favicon updates to match the separator type. Your browser caches the favicon per URL, allowing multiple bookmarks with distinct icons.

## Deployment

The repository includes a GitHub Actions workflow that automatically:
- Minifies HTML, CSS, and JavaScript on push to `main`.
- Deploys optimized version to GitHub Pages.
- Keeps source code clean and readable in the repository.

## Contributing

If you have any improvements, additional information, or notice any issues with the tool, we'd love to hear from you! Feel free to open a pull request with your suggestions or details.

If you encounter any problems or believe something isn't working as expected, please provide all relevant information in an issue.