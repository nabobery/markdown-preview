// Application constants

export const APP_NAME = "Markdown Live Previewer";

export const DEFAULT_MARKDOWN_CONTENT = `# Welcome to Markdown Live Previewer

This is a **live preview** of your Markdown content with **LaTeX Math Support**!

## Features

- Real-time preview
- **LaTeX Math Rendering** 🧮
- **Mermaid Diagrams** 📊
- Syntax highlighting
- Export functionality
- And much more!

## Math Examples

### Inline Math
Einstein's famous equation: $E = mc^2$

The quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

### Block Math
The fundamental theorem of calculus:

$$\\int_{a}^{b} f'(x) \\, dx = f(b) - f(a)$$

A beautiful integral:

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

### Matrix Example

$$
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
\\begin{pmatrix}
x \\\\
y
\\end{pmatrix}
=
\\begin{pmatrix}
ax + by \\\\
cx + dy
\\end{pmatrix}
$$

## Diagram Examples

### Flowchart

\`\`\`mermaid
graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]
\`\`\`

### Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: Great!
    Alice-)Bob: See you later!
\`\`\`

## Getting Started

Start typing in the editor pane to see your content rendered here.

\`\`\`javascript
// Code blocks are supported too!
console.log('Hello, Markdown with Math and Diagrams!');
\`\`\`

> Blockquotes work as well

- [x] Task lists
- [x] LaTeX Math Support
- [x] Mermaid Diagrams
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
