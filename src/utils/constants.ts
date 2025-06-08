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

## Enhanced Table Features 📊

### Basic Table with Alignment Examples

| Left Aligned | Center Aligned | Right Aligned | Default |
|:-------------|:--------------:|--------------:|---------|
| Apple        | Orange         | Banana        | Grape   |
| $12.99       | $8.50          | $3.75         | $15.00  |
| Available    | Limited        | Sold Out      | In Stock|

### Performance Metrics Table

| Metric | Q1 2024 | Q2 2024 | Q3 2024 | Change |
|:-------|--------:|--------:|--------:|-------:|
| Revenue| $125,000| $142,500| $158,300| +26.6% |
| Users  | 1,250   | 1,890   | 2,340   | +87.2% |
| Growth | 12.5%   | 13.8%   | 16.2%   | +3.7%  |

### Technology Comparison Table

| Technology |:------:| Pros |:---------------:| Cons |
|:-----------|:------:|:-----|:---------------:|:-----|
| React      | ⭐⭐⭐⭐⭐ | Component-based, Large ecosystem | Learning curve |
| Vue        | ⭐⭐⭐⭐   | Easy to learn, Good docs | Smaller ecosystem |
| Angular    | ⭐⭐⭐    | Full framework, TypeScript | Complex, Heavy |
| Svelte     | ⭐⭐⭐⭐   | Fast, Small bundle | Newer, Limited jobs |

### Data Types & Examples

| Type | Example | Size | Use Case |
|:-----|:-------:|-----:|---------:|
| String | "Hello World" | Variable | Text data |
| Integer | 42 | 4 bytes | Counting |
| Float | 3.14159 | 8 bytes | Calculations |
| Boolean | true/false | 1 bit | Logic |
| Array | [1, 2, 3] | Variable | Collections |

### Project Status Dashboard

| Feature | Status | Priority | Assignee | Due Date |
|:--------|:------:|:--------:|:--------:|---------:|
| User Auth | ✅ Complete | High | Alice | 2024-01-15 |
| Dashboard | 🔄 In Progress | High | Bob | 2024-01-30 |
| Analytics | ⏳ Pending | Medium | Charlie | 2024-02-15 |
| Mobile App | 📋 Planning | Low | Diana | 2024-03-01 |
| API v2 | ❌ Blocked | High | Eve | TBD |

### Mixed Content Table

| Item | Description | Price | Rating | Available |
|:-----|:------------|------:|:------:|:---------:|
| 🍎 Apple | Fresh red apples from local farm | $2.99/lb | ⭐⭐⭐⭐⭐ | ✅ Yes |
| 🥖 Bread | Artisan sourdough bread | $4.50 | ⭐⭐⭐⭐ | ✅ Yes |
| 🧀 Cheese | Aged cheddar cheese | $8.99/lb | ⭐⭐⭐⭐⭐ | ❌ No |
| 🥛 Milk | Organic whole milk | $3.25/gal | ⭐⭐⭐ | ⏳ Limited |

### Complex Nested Table

| Category | Sub-category | Details | Metrics |
|:---------|:-------------|:--------|--------:|
| 📱 Mobile | iOS | iPhone 15 Pro<br/>• 128GB Storage<br/>• 48MP Camera | $999 |
|          | Android | Samsung Galaxy<br/>• 256GB Storage<br/>• 50MP Camera | $899 |
| 💻 Laptop | MacBook | M3 Chip<br/>• 16GB RAM<br/>• 512GB SSD | $1,599 |
|          | Windows | Dell XPS<br/>• Intel i7<br/>• 32GB RAM | $1,299 |

### Large Dataset Example (Test Scrolling)

| ID | Name | Email | Department | Salary | Start Date | Performance | Location |
|---:|:-----|:------|:-----------|-------:|:----------:|:-----------:|:--------:|
| 001 | John Smith | john.smith@company.com | Engineering | $95,000 | 2022-01-15 | Excellent | New York |
| 002 | Jane Doe | jane.doe@company.com | Marketing | $75,000 | 2021-08-20 | Good | Los Angeles |
| 003 | Bob Johnson | bob.johnson@company.com | Sales | $82,000 | 2023-03-10 | Outstanding | Chicago |
| 004 | Alice Brown | alice.brown@company.com | Engineering | $98,000 | 2020-11-05 | Excellent | Seattle |
| 005 | Charlie Davis | charlie.davis@company.com | HR | $68,000 | 2022-07-12 | Good | Austin |
| 006 | Diana Wilson | diana.wilson@company.com | Finance | $88,000 | 2021-04-18 | Excellent | Boston |
| 007 | Frank Miller | frank.miller@company.com | Engineering | $102,000 | 2019-09-22 | Outstanding | San Francisco |
| 008 | Grace Lee | grace.lee@company.com | Design | $78,000 | 2023-01-30 | Good | Portland |

**Table Features to Test:**
- Toggle **Zebra Striping** in Settings to see alternating row colors
- **Column Alignment Indicators** show arrows for left (←), center (↕), and right (→) alignment
- **Responsive Scrolling** on mobile devices and narrow screens
- **Theme Integration** - tables adapt to light/dark mode
- **Accessibility** - tables include proper ARIA labels and keyboard navigation

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
