// Application constants

export const APP_NAME = "Markdown Live Previewer";

export const DEFAULT_MARKDOWN_CONTENT = `# Welcome to Markdown Live Previewer

This is a **live preview** of your Markdown content.

## Features

- Real-time preview
- Syntax highlighting
- Export functionality
- And much more!

### Getting Started

Start typing in the editor pane to see your content rendered here.

\`\`\`javascript
// Code blocks are supported too!
console.log('Hello, Markdown!');
\`\`\`

> Blockquotes work as well

- [x] Task lists
- [ ] Are supported
- [ ] Try them out!
`;

export const STORAGE_KEYS = {
  EDITOR_CONTENT: "markdown-editor-content",
  APP_SETTINGS: "markdown-editor-settings",
} as const;

export const PREVIEW_THEMES = {
  GITHUB: "github",
  DARK: "dark",
  MINIMAL: "minimal",
} as const;
