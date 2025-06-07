// Application constants

export const APP_NAME = "Markdown Live Previewer";

export const DEFAULT_MARKDOWN_CONTENT = `# Welcome to Markdown Live Previewer

This is a **live preview** of your Markdown content with **LaTeX Math Support**!

## Features

- Real-time preview
- **LaTeX Math Rendering** 🧮
- **Mermaid Diagrams** 📊
- **Enhanced Syntax Highlighting** 🎨
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

### Flowchart with Emojis :rocket:

### Sequence Diagram with Emojis :speech_balloon:

\`\`\`mermaid
sequenceDiagram
    participant Alice :woman:
    participant Bob :man:
    Alice->>Bob: Hello Bob! :wave: How are you?
    Bob-->>Alice: Great! :thumbsup: Thanks for asking :smile:
    Alice-)Bob: See you later! :wave:
\`\`\`

### Project Timeline :calendar:

\`\`\`mermaid
gantt
    title Project Development :construction:
    dateFormat  YYYY-MM-DD
    section Planning :memo:
    Research        :done, des1, 2024-01-01, 2024-01-15
    Design          :done, des2, after des1, 15d
    section Development :computer:
    Backend         :active, dev1, 2024-02-01, 30d
    Frontend        :dev2, after dev1, 25d
    section Testing :test_tube:
    Unit Tests      :test1, after dev2, 10d
    Integration     :test2, after test1, 5d
    section Deploy :rocket:
    Production      :deploy, after test2, 3d
\`\`\`

## Code Highlighting Examples

### JavaScript

\`\`\`javascript
// Enhanced syntax highlighting with line numbers
const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

console.log('Fibonacci sequence:', fibonacci(10));
\`\`\`

### Python

\`\`\`python
# Data science example
import numpy as np
import pandas as pd

def analyze_data(data):
    """Analyze dataset with basic statistics"""
    return {
        'mean': np.mean(data),
        'std': np.std(data),
        'count': len(data)
    }

# Generate sample data
sample = np.random.normal(0, 1, 1000)
stats = analyze_data(sample)
print(f"Statistics: {stats}")
\`\`\`

### TypeScript

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  private users: User[] = [];

  async fetchUser(id: number): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  addUser(user: Omit<User, 'id'>): User {
    const newUser = { ...user, id: Date.now() };
    this.users.push(newUser);
    return newUser;
  }
}
\`\`\`

## Getting Started

Start typing in the editor pane to see your content rendered here with beautiful syntax highlighting!

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
