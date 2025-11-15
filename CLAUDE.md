# Claude Code Context - Markdown Live Previewer

This file provides essential context for Claude Code sessions working on this project.

## Essential Commands

```bash
# Development workflow
npm install              # Install all dependencies
npm run dev             # Start dev server at http://localhost:5173
npm run build           # Build for production (must pass before PR)
npm run lint            # Run ESLint (must pass before PR)
npm run preview         # Preview production build locally

# Quick checks
ls -lh dist/assets/     # Check bundle sizes after build
git status              # Check current branch and changes
git log --oneline -5    # View recent commits
```

## Critical Architecture Knowledge

### Tech Stack
- **React 19** + **TypeScript 5.8** (strict mode)
- **Vite 6** for build/HMR
- **CodeMirror 6** (8 packages) for editor
- **Tailwind CSS 4** for styling
- Client-side only, no backend

### Core File Map

**YOU MUST READ BEFORE EDITING:**
- `src/App.tsx` - Root component, main state/handlers (218 lines)
- `src/components/EditorPane.tsx` - CodeMirror + custom keymaps (162 lines)
- `src/hooks/useScrollSync.ts` - Scroll sync logic (84 lines)
- `vite.config.ts` - Build config with circular dep fix (25 lines)

**Configuration:**
- `package.json` - Dependencies and scripts
- `tsconfig.app.json` - TypeScript strict mode config
- `vercel.json` - Deployment + security headers

## Code Style (IMPORTANT)

### Naming Conventions - MUST FOLLOW
```typescript
// Components: PascalCase
EditorPane, SettingsModal

// Functions/variables: camelCase
handleContentChange, markdownContent

// Constants: UPPER_SNAKE_CASE
DEFAULT_MARKDOWN_CONTENT

// Types: PascalCase
AppSettings, ThemeConfig

// Hooks: use + camelCase
useSettings, useScrollSync
```

### React Patterns - ALWAYS USE
```typescript
// 1. Explicit interfaces for props
interface MyComponentProps {
  content: string;
  onChange: (value: string) => void;
}

// 2. Functional components with React.FC
export const MyComponent: React.FC<MyComponentProps> = ({ ... }) => {}

// 3. Lazy loading for heavy libs
const CodeMirror = lazy(() => import("@uiw/react-codemirror"));
```

### TypeScript Rules - ENFORCE
- Strict mode enabled
- NO `any` type (use `unknown` or proper types)
- Always define interfaces for props
- Null checks before accessing properties

## Critical Warnings ⚠️

### CodeMirror Circular Dependencies
**DO NOT TOUCH `vite.config.ts` manual chunking strategy!**

This configuration prevents "Cannot access before initialization" errors:
```typescript
manualChunks(id) {
  if (id.includes("node_modules")) {
    return id.toString().split("node_modules/")[1].split("/")[0];
  }
}
```

**If you see this error**: It means manual chunking was removed or broken.

### Theme System Architecture
**Pattern: CSS Variables + React Context + Tailwind**

1. Themes defined in `src/themes/index.ts` (objects)
2. Applied via CSS custom properties in `ThemeContext.tsx`
3. Used in components with Tailwind `theme-*` classes

**When adding colors:**
- Add to BOTH `lightTheme` AND `darkTheme`
- Create Tailwind class in `src/index.css`
- Apply in `ThemeContext.tsx` via `setProperty()`

### Clipboard API Restrictions
Only works in secure contexts (HTTPS/localhost). Fallback already implemented:
```typescript
if (navigator.clipboard && window.isSecureContext) {
  await navigator.clipboard.writeText(text)
} else {
  // Textarea fallback for HTTP/older browsers
}
```

## Testing Protocol (NO AUTOMATED TESTS YET)

### Before EVERY Commit - YOU MUST:
1. ✅ Run `npm run lint` (must pass)
2. ✅ Run `npm run build` (must complete)
3. ✅ Test in light AND dark mode
4. ✅ Test keyboard shortcuts (Ctrl+A/C/V/F)
5. ✅ Test on mobile viewport (responsive)
6. ✅ Check bundle size <400KB gzipped

### Manual Feature Testing Checklist
- [ ] Editor accepts input and updates preview
- [ ] Copy/paste operations work
- [ ] Theme switching works
- [ ] Settings persist on reload
- [ ] Export downloads .md file
- [ ] Scroll sync toggles properly

## Common Tasks - Quick Reference

### Adding a Keyboard Shortcut
1. Edit `src/components/EditorPane.tsx`
2. Add to `customKeymap` array
3. Update README.md keyboard table
4. Test for browser conflicts

### Modifying Theme Colors
1. Edit `src/themes/index.ts` (both themes)
2. Edit `src/index.css` (Tailwind class)
3. Edit `src/contexts/ThemeContext.tsx` (apply CSS var)
4. Test in light + dark modes

### Adding a Component
1. Create `src/components/NewComponent.tsx`
2. Define interface for props
3. Export from `src/components/index.ts`
4. Update AGENTS.md if major component

## Performance Budget - DO NOT EXCEED

- Total bundle: **<400KB gzipped**
- Lighthouse Performance: **>90**
- Load time on 3G: **<2 seconds**

**Before adding dependencies:**
1. Check bundle impact: `npm run build`
2. Look for lighter alternatives
3. Consider lazy loading

## Git Workflow

### Branch Strategy
- Main branch: `main` (or current development branch)
- Feature branches: `feature/description`
- Bug fixes: `fix/description`

### Commit Messages (Follow Conventional Commits)
```
feat: add syntax highlighting for code blocks
fix: resolve theme flashing on initial load
refactor: extract scroll sync logic to custom hook
docs: update keyboard shortcuts in README
perf: lazy load CodeMirror to reduce initial bundle
```

Types: `feat`, `fix`, `refactor`, `style`, `docs`, `perf`, `test`, `chore`

### PR Requirements
✅ Lint passing
✅ Build successful
✅ Manual testing completed
✅ Bundle size within budget
✅ Documentation updated
✅ Descriptive commit messages

## Security Context

### Headers (Configured in vercel.json)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

### Best Practices
- Client-side only (no server)
- React Markdown sanitizes HTML
- Never use `dangerouslySetInnerHTML` without sanitization
- User data stays in browser (privacy-focused)

## Project-Specific Behaviors

### LocalStorage Schema
```typescript
{
  "markdownContent": string,
  "settings": {
    "theme": "light" | "dark" | "system",
    "fontSize": number,        // 12-20
    "lineNumbers": boolean,
    "wordWrap": boolean,
    "autoSaveInterval": number // 1-30 seconds
  }
}
```

**IMPORTANT**: Always merge with defaults for backward compatibility when loading.

### Scroll Synchronization
Percentage-based bidirectional:
```typescript
const percentage = scrollTop / (scrollHeight - clientHeight)
targetRef.current.scrollTop = percentage * targetMaxScroll
```

**Always null-check refs before accessing scroll properties!**

### Component Hierarchy
```
App (root state + handlers)
├── Layout (header + toolbar wrapper)
│   ├── EditorPane (CodeMirror editor)
│   └── PreviewPane (Markdown renderer - MEMOIZED)
└── SettingsModal (settings dialog)
```

## Known Issues to Avoid

1. **CodeMirror Circular Deps**: Don't modify manual chunking in vite.config.ts
2. **Clipboard in HTTP**: Only works in HTTPS (fallback implemented)
3. **Theme Flash**: Handled by localStorage persistence
4. **Mobile Keyboard**: Careful with vh units, test on real devices
5. **LocalStorage Quota**: 5MB limit (not yet handled)

## File Organization Rules

- One component per file (.tsx)
- One hook per file (.ts)
- Barrel exports in index.ts files
- All types in `src/types/index.ts`
- Constants in `src/utils/constants.ts`

## Dependencies to Know

### CodeMirror Ecosystem (8 packages)
```
@codemirror/commands       - Editor commands
@codemirror/lang-markdown  - Syntax highlighting
@codemirror/search         - Find & replace
@codemirror/state          - State management
@codemirror/view           - View rendering
@codemirror/theme-one-dark - Dark theme
@uiw/react-codemirror      - React wrapper
@uiw/codemirror-extensions-events - Scroll events
```

**DO NOT**: Mix up these packages or add CodeMirror to `optimizeDeps.exclude`

### Markdown Rendering
```
react-markdown  - Main renderer
remark-gfm      - GitHub Flavored Markdown support
```

## Useful Shortcuts While Developing

```bash
# Quick status check
npm run dev && open http://localhost:5173

# Build and check size
npm run build && ls -lh dist/assets/

# Full pre-commit check
npm run lint && npm run build && npm run preview
```

## Questions to Ask Before Making Changes

- **Breaking changes?** → Ask user first
- **New dependencies?** → Discuss bundle impact
- **UI/UX changes?** → Get user approval
- **Architecture changes?** → Check with user
- **Unsure about approach?** → Ask for clarification

## Current Project Status

- **Phase 1**: ✅ COMPLETED (Core functionality)
- **Phase 2**: ✅ COMPLETED (Deployment & optimization)
- **Production**: ✅ READY
- **Testing**: ⚠️ Manual only (no test framework yet)

## Helpful Context

### Bundle Optimization Strategy
1. Manual chunking for each npm package
2. Lazy loading for CodeMirror and Markdown
3. Tailwind purging unused utilities
4. React.memo for PreviewPane
5. Gzip compression (67% reduction)

### Deployment
- **Platform**: Vercel (auto-deploy from main)
- **Build**: `npm run build`
- **Output**: `dist/` directory
- **Environment**: Node.js 18+

---

**REMEMBER**: Always read files before editing. Test thoroughly. Keep bundle size in check. Follow the style guide.

**Last Updated**: 2025-11-15
