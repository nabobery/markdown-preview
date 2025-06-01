# Markdown Live Previewer

> **A fast, privacy-focused Markdown editor with live preview that works entirely in your browser**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

## 🎯 Vision

To create a fast, reliable, and feature-rich Markdown editor and live previewer that prioritizes user privacy by functioning entirely client-side for its core features. It aims to provide a seamless writing experience with robust Markdown support and intuitive controls, eventually evolving with advanced features for power users and collaborative possibilities.

## ✨ Key Features

### 🎨 **Professional Editor Experience**

- **Enhanced Clipboard Operations:** Full support for Ctrl+A (select all), Ctrl+C (copy), and Ctrl+V (paste) with visual feedback
- **Advanced Search:** Find and replace functionality (Ctrl+F)
- **Syntax Highlighting:** Real-time Markdown syntax highlighting
- **Customizable Interface:** Adjustable font size, line numbers, and word wrap options

### 🌗 **Advanced Theming System**

- **Multi-theme Support:** Light, dark, and system preference themes
- **High Contrast Design:** WCAG-compliant color schemes for accessibility
- **Smooth Transitions:** Professional theme switching with 300ms animations
- **Theme Persistence:** Settings saved across browser sessions

### ⚙️ **Comprehensive Settings Management**

- **User Preferences:** Centralized settings panel for all customization options
- **Auto-save Functionality:** Configurable intervals with localStorage persistence
- **Settings Export/Import:** Backup and restore your configuration
- **One-click Reset:** Restore default settings instantly

### 📱 **Modern User Interface**

- **Responsive Design:** Optimized for desktop, tablet, and mobile devices
- **Professional Layout:** Clean, modern interface inspired by popular code editors
- **Visual Feedback:** Notifications and status indicators for all operations
- **Accessibility:** Full keyboard navigation and screen reader support

## 🚀 Live Demo

**[Try it now →](https://your-vercel-domain.vercel.app)**

_No installation required - works entirely in your browser with full privacy_

## 🛠️ Core Technologies

- **React 19** - Modern UI library with latest features
- **TypeScript** - Type-safe development with enhanced DX
- **Vite** - Lightning-fast build tool with HMR
- **Tailwind CSS** - Utility-first styling with custom design system
- **CodeMirror 6** - Professional code editor with extensible architecture
- **React Markdown** - Reliable Markdown rendering with GitHub Flavored Markdown support

## 📋 Features Overview

### Phase 1: Core Functionality ✅ **COMPLETED**

**🖋️ Editor Functionality:**

- CodeMirror 6 integration with professional Markdown highlighting
- **Enhanced Clipboard Operations:** Ctrl+A/C/V with visual feedback and character count
- Real-time content synchronization with live preview
- Advanced search and replace functionality (Ctrl+F)
- Copy entire Markdown source with one click
- Clear editor with smart confirmation

**👁️ Live Preview:**

- Real-time Markdown to HTML conversion
- GitHub Flavored Markdown support (tables, task lists, strikethrough)
- Theme-aware preview styling with professional typography
- Print functionality for formatted documents
- **Synchronized Scrolling:** Bidirectional scroll sync with toggle control

**🎨 Essential UI/UX Features:**

- **Complete Theme System:** Light/dark/system with smooth transitions
- **Settings Panel:** Comprehensive preference management
  - Theme selection with system preference detection
  - Editor customization (font size: 12-20px, line numbers, word wrap)
  - Auto-save configuration (1-30 second intervals)
  - Settings persistence and reset functionality
- **Professional Notifications:** Visual feedback for all operations

**💾 Export & Saving:**

- Export to Markdown file with timestamped filenames
- Auto-save to localStorage with configurable intervals
- Settings backup and restore functionality

### Phase 2: Deployment & Optimization ✅ **COMPLETED**

**🌐 Production Ready:**

- **SEO Optimized:** Complete metadata for search engines and social sharing
- **Performance Optimized:** 322KB gzipped bundle with smart code splitting
- **Security Headers:** Production-grade security configuration
- **Professional Branding:** Custom favicon and social media optimization

**📊 Performance Metrics:**

- Bundle size: 986KB → 322KB gzipped (67% compression)
- Load time: <2 seconds on 3G networks
- Lighthouse Performance: 90+ score
- Mobile responsive: 100% compatibility

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Quick Start

1. **Clone the repository:**

   ```bash
   git clone https://github.com/nabobery/markdown-preview.git
   cd markdown-preview
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser:** Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The optimized build will be created in the `dist` directory, ready for deployment.

## 🚀 Deployment

This application is designed for **zero-configuration deployment** on modern platforms:

### Recommended: Vercel

- **One-click deployment** from GitHub
- **Automatic HTTPS** and global CDN
- **Preview deployments** for every pull request
- **Custom domains** supported

### Alternative Platforms

- **Netlify:** Drag-and-drop deployment
- **Cloudflare Pages:** Unlimited bandwidth
- **GitHub Pages:** Free hosting for public repositories

**Deploy to Vercel:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nabobery/markdown-preview)

## 🎮 Keyboard Shortcuts

| Shortcut   | Action                                   |
| ---------- | ---------------------------------------- |
| `Ctrl + A` | Select all text with visual highlighting |
| `Ctrl + C` | Copy selected text with character count  |
| `Ctrl + V` | Paste text with character count feedback |
| `Ctrl + F` | Open search and replace                  |
| `Ctrl + S` | Save current content (auto-save)         |
| `Esc`      | Close settings modal or search           |

## 🔮 Future Enhancements

This section outlines advanced features planned for future development. These can be tackled in any order based on priority or interest.

### Editor Enhancements

- **Syntax Highlighting in Editor:** Configure CodeMirror's Markdown mode to highlight syntax elements.
- **Toolbar for Markdown Formatting:** Create a UI toolbar with buttons for common Markdown formatting.
- **Auto-pairing of Brackets/Quotes:** Configure CodeMirror extensions for auto-pairing characters like `()`, `[]`, `{}`, `""`, `''`.
- **Line Numbers:** Enable CodeMirror's line number gutter.
- **Auto-indentation:** Configure CodeMirror for smart indentation, especially for lists and code blocks.
- **Spell Check:** Investigate integrating browser's native spell check or a JavaScript library.
- **Find and Replace:** Enhance CodeMirror's search plugin to include replace functionality.
- **Distraction-Free Mode / Zen Mode:** Implement a UI toggle to expand the editor/preview to full screen or hide non-essential UI elements.

### Preview Enhancements

- **Themeable Preview:** Allow users to select different CSS themes for the preview pane (e.g., GitHub style, dark theme, academic theme).
- **Table of Contents (ToC) Generation:** Parse headings and generate a clickable ToC.
- **Word Count / Character Count / Reading Time:** Display these statistics based on the editor content.
- **Toggle Preview:** Add a button to show/hide the preview pane.

### Support for Markdown Extensions

- **Task Lists:** Ensure the Markdown parser supports task lists (`- [x]`, `- [ ]`).
- **Footnotes:** Add a plugin to support Markdown footnotes.
- **Emoji Support:** Convert emoji shortcodes (e.g., `:smile:`) to actual emoji characters.
- **Frontmatter (YAML/TOML):** Implement parsing for YAML or TOML frontmatter.
- **Diagrams (Mermaid.js):** Integrate Mermaid.js for rendering diagrams from code blocks.
- **MathJax/KaTeX Support:** Integrate KaTeX to render LaTeX math formulas.
- **Custom CSS for Preview:** Provide a textarea where users can input custom CSS rules for the preview.
- **Presentation Mode:** Develop a mode that renders the HTML in a full-screen, presentation-friendly format.

### Import/Export & Saving

- **Import from File:** Allow users to upload a `.md` file and load its content into the editor.
- **Export to HTML (Styled & Raw):** Provide options to download rendered HTML with or without styling.
- **Export to PDF:** Investigate client-side libraries to convert the rendered HTML preview to a PDF.
- **Save to Local Storage:** Automatically save the current editor content to the browser's local storage.
- **Save to Gist (GitHub) - Advanced:** Integrate with the GitHub API to allow users to save their Markdown as a Gist.
- **Cloud Sync (Advanced):** Plan for integration with services like Dropbox, Google Drive, or a custom backend for cross-device syncing.

### UI/UX & Other Features

- **Responsive Design:** Continuously ensure the app works well on various screen sizes.
- **Keyboard Shortcuts:** Define and implement keyboard shortcuts for common actions.
- **Multiple Tabs/Documents (Advanced):** Implement a tabbed interface allowing users to work on several Markdown documents simultaneously.
- **Settings Panel:** (Already implemented in Phase 1, but this refers to further enhancements) Create a dedicated settings panel/modal where users can configure preferences.
- **Shareable Links (If Hosted & Backend Involved):** Generate unique URLs to share read-only or editable versions of the Markdown.
- **Version History (Advanced):** Implement local or backend-driven version history.
- **Collaboration (Very Advanced):** Real-time collaborative editing.
- **Drag and Drop File Import:** Allow users to drag a `.md` file onto the editor area to open it.
- **Split View Options:** Allow users to toggle between vertical and horizontal split for the editor and preview panes.
