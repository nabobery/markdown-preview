# Markdown Live Previewer - AI Agent Guide

This file provides instructions and context for AI coding agents working on this project.

## Project Overview

A fast, privacy-focused Markdown editor with live preview built with React 19, TypeScript, and Vite. The application runs entirely client-side with no backend dependencies.

**Tech Stack:**
- React 19.1.0 with TypeScript 5.8.3
- Vite 6.3.5 for bundling and HMR
- CodeMirror 6 for the editor
- React Markdown with GFM support for preview
- Tailwind CSS 4.1.8 for styling
- Vercel for deployment

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure

```
src/
├── components/          # React UI components
│   ├── Layout.tsx      # Main layout wrapper with header/toolbar
│   ├── EditorPane.tsx  # CodeMirror editor with clipboard support
│   ├── PreviewPane.tsx # Markdown preview renderer
│   ├── SettingsModal.tsx # Settings dialog
│   └── ThemeToggle.tsx # Theme switcher
├── contexts/           # React Context providers
│   └── ThemeContext.tsx # Theme state management
├── hooks/              # Custom React hooks
│   ├── useTheme.ts    # Theme context consumer
│   ├── useSettings.ts # Settings persistence
│   └── useScrollSync.ts # Scroll synchronization
├── types/              # TypeScript definitions
│   └── index.ts       # All app interfaces
├── themes/             # Theme configurations
│   └── index.ts       # Light/Dark theme configs
├── utils/              # Utility functions
│   ├── index.ts       # Helpers (clipboard, download, notifications)
│   └── constants.ts   # App constants
└── App.tsx            # Root component
```

## Development Environment Tips

### Before Making Changes

1. **Read the Component First**: Always use the Read tool to view files before editing
2. **Check Dependencies**: CodeMirror has 8+ packages - ensure you're using the right one
3. **Test Both Themes**: Always test changes in light and dark modes
4. **Check Mobile**: Test responsive behavior on mobile viewports

### Key Files to Know

- `src/App.tsx` - Root component with main state and handlers
- `src/components/EditorPane.tsx` - CodeMirror integration and custom keymaps
- `src/hooks/useScrollSync.ts` - Bidirectional scroll synchronization logic
- `vite.config.ts` - Build configuration with manual chunking strategy
- `vercel.json` - Deployment and security headers

### Common Development Patterns

**Component Pattern:**
```typescript
// All components use explicit interfaces
interface MyComponentProps {
  content: string;
  onChange: (value: string) => void;
  settings: AppSettings;
}

export const MyComponent: React.FC<MyComponentProps> = ({ ... }) => {}
```

**Custom Hook Pattern:**
```typescript
// Hooks should encapsulate logic and handle persistence
export const useCustomHook = () => {
  const [state, setState] = useState(initial);

  useEffect(() => {
    // Persist to localStorage or setup listeners
  }, [dependencies]);

  return { state, handlers };
};
```

**Theme Usage:**
```typescript
// Use Tailwind theme-* classes for theme-aware styling
<div className="theme-background theme-text theme-border">
```

## Testing Instructions

### Manual Testing Checklist

Since there's no automated testing framework currently configured, always test manually:

- [ ] Editor loads and accepts input
- [ ] Preview updates in real-time
- [ ] Keyboard shortcuts work (Ctrl+A/C/V/F/S)
- [ ] Copy/Paste operations with fallbacks
- [ ] Theme switching (Light/Dark/System)
- [ ] Settings persist across page reloads
- [ ] Export to Markdown downloads correctly
- [ ] Print preview works
- [ ] Scroll synchronization toggles properly
- [ ] Mobile responsive layout works
- [ ] Auto-save functionality works

### Build Testing

```bash
# Always test production build before committing
npm run build
npm run preview

# Check bundle size (should be ~322KB gzipped)
ls -lh dist/assets/
```

### Browser Testing

Test in at least:
- Chrome/Edge (Chromium)
- Firefox
- Safari (if available)

## Code Style & Conventions

### Naming Conventions

- **Components**: PascalCase (`EditorPane`, `SettingsModal`)
- **Functions/Variables**: camelCase (`handleContentChange`, `copyToClipboard`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_MARKDOWN_CONTENT`)
- **Types/Interfaces**: PascalCase (`AppSettings`, `ThemeConfig`)
- **Custom Hooks**: camelCase with 'use' prefix (`useSettings`, `useScrollSync`)

### File Organization

- One component per file (.tsx)
- One hook per file (.ts)
- Use barrel exports in index.ts files
- Centralize types in types/index.ts
- Keep constants in utils/constants.ts

### TypeScript Standards

- **Strict Mode**: Enabled - all code must pass strict type checks
- **Explicit Types**: Always define interfaces for component props
- **No Any**: Avoid `any` type - use `unknown` or proper types
- **Null Safety**: Check for null/undefined before accessing properties

### React Best Practices

- Use functional components only (no class components)
- Use React.memo for heavy components (PreviewPane is already memoized)
- Lazy load heavy libraries (CodeMirror and Markdown are lazy-loaded)
- Clean up effects with return cleanup functions
- Use proper dependency arrays in useEffect

## Important Implementation Details

### CodeMirror Integration

**CRITICAL**: CodeMirror has circular dependency issues. The current solution:

```typescript
// vite.config.ts - Manual chunking prevents circular deps
manualChunks(id) {
  if (id.includes("node_modules")) {
    return id.toString().split("node_modules/")[1].split("/")[0];
  }
}
```

**DO NOT**:
- Remove the manual chunking strategy
- Add CodeMirror packages to optimizeDeps.exclude

**Custom Keymaps**:
Located in `EditorPane.tsx`. When adding shortcuts:
```typescript
const customKeymap = keymap.of([
  {
    key: "Ctrl-a",
    run: (view) => {
      // Custom logic
      return true; // Prevent default
    }
  }
])
```

### Theme System

**CSS Variables + React Context Pattern**:
1. Themes defined as objects in `src/themes/index.ts`
2. Applied to DOM via CSS custom properties in `ThemeContext.tsx`
3. Consumed in components via Tailwind `theme-*` classes

**When Adding Theme Colors**:
1. Add to both `lightTheme` and `darkTheme` in `src/themes/index.ts`
2. Create corresponding Tailwind class in `src/index.css`
3. Apply theme in `ThemeContext.tsx` via `root.style.setProperty()`

### Scroll Synchronization

Uses percentage-based bidirectional sync:
```typescript
// Calculate scroll percentage
const percentage = scrollTop / (scrollHeight - clientHeight)
// Apply to other pane
targetRef.current.scrollTop = percentage * targetMaxScroll
```

**Important**: Always check for null refs before accessing scrollTop/scrollHeight

### LocalStorage Persistence

Settings are automatically saved to localStorage. Schema:
```typescript
{
  "markdownContent": string,
  "settings": {
    "theme": "light" | "dark" | "system",
    "fontSize": number, // 12-20
    "lineNumbers": boolean,
    "wordWrap": boolean,
    "autoSaveInterval": number // 1-30 seconds
  }
}
```

**Backward Compatibility**: Always merge with defaults when loading from localStorage

## Common Tasks

### Adding a New Component

1. Create file in `src/components/NewComponent.tsx`
2. Define interface for props
3. Export from `src/components/index.ts`
4. Import in parent component
5. Update this documentation if it's a major component

### Adding a New Hook

1. Create file in `src/hooks/useNewHook.ts`
2. Export from `src/hooks/index.ts`
3. Document in CLAUDE.md if it's complex

### Adding a New Keyboard Shortcut

1. Edit `src/components/EditorPane.tsx`
2. Add to `customKeymap` array
3. Update README.md keyboard shortcuts table
4. Test that it doesn't conflict with browser shortcuts

### Modifying Themes

1. Edit `src/themes/index.ts` for color definitions
2. Edit `src/index.css` for Tailwind classes
3. Edit `src/contexts/ThemeContext.tsx` for CSS variable application
4. Test in both light and dark modes

## Pull Request Guidelines

### PR Title Format
```
[Component/Feature] Brief description
```

Examples:
- `[EditorPane] Add syntax highlighting for code blocks`
- `[Settings] Add option to disable auto-save`
- `[Theme] Fix contrast issue in dark mode`

### Before Submitting a PR

1. **Run Linter**: `npm run lint` must pass with no errors
2. **Build Successfully**: `npm run build` must complete without errors
3. **Test Production Build**: `npm run preview` and manually test
4. **Check Bundle Size**: Ensure it's under 400KB gzipped
5. **Test All Features**: Complete the manual testing checklist above
6. **Update Documentation**: Update README.md if adding features
7. **Clean Commits**: Use descriptive commit messages

### Commit Message Format

Follow conventional commits:
```
<type>: <description>

[optional body]
```

Types:
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `style:` Code style changes (formatting, etc.)
- `docs:` Documentation changes
- `perf:` Performance improvements
- `test:` Adding tests
- `chore:` Build process or auxiliary tool changes

## Known Issues & Gotchas

### CodeMirror Circular Dependencies
**Issue**: CodeMirror can cause "Cannot access before initialization" errors
**Solution**: Manual chunking in vite.config.ts (already implemented)
**DO NOT**: Remove the manual chunking strategy

### Clipboard API Restrictions
**Issue**: Clipboard API only works in secure contexts (HTTPS or localhost)
**Solution**: Fallback to textarea + execCommand already implemented
**Note**: Always test clipboard operations in production (HTTPS) environment

### Theme Flashing on Load
**Issue**: Brief flash of wrong theme before system preference is detected
**Solution**: Use localStorage to persist last theme choice
**Status**: Already handled in ThemeContext.tsx

### Mobile Viewport Issues
**Issue**: On mobile, keyboard can cover editor
**Solution**: Use vh units carefully, test on real devices
**Note**: Current responsive design handles this

### LocalStorage Quota
**Issue**: Large documents may exceed 5MB localStorage limit
**Solution**: Consider warning users or implementing compression
**Status**: Not yet implemented - future enhancement

## Security Considerations

### CSP Headers
Configured in `vercel.json`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

### Client-Side Only
- No server-side code
- No API calls (except potential future features)
- All data stays in browser (privacy-focused)

### XSS Prevention
- React Markdown sanitizes HTML by default
- Don't use `dangerouslySetInnerHTML` without sanitization
- User input never directly inserted into DOM

## Performance Optimization

### Current Optimizations

1. **Code Splitting**: CodeMirror and Markdown are lazy-loaded
2. **Manual Chunking**: Each npm package gets own chunk
3. **React.memo**: PreviewPane is memoized
4. **Tailwind Purging**: Unused utilities removed in production
5. **Asset Compression**: Gzip compression enabled (67% reduction)

### Performance Budget

- **Total Bundle**: <400KB gzipped
- **First Contentful Paint**: <1.5s on 3G
- **Time to Interactive**: <3s on 3G
- **Lighthouse Performance**: >90

### When Adding Dependencies

1. Check bundle size impact: `npm run build`
2. Consider lazy loading for large libraries
3. Look for lighter alternatives
4. Tree-shakeable libraries preferred

## Deployment

### Vercel (Recommended)

The project is configured for automatic deployment:

1. Push to main branch
2. Vercel auto-detects Vite project
3. Runs `npm run build`
4. Deploys from `dist/` directory

### Environment Variables

Currently none required (client-side only app).

If adding backend features:
- Add to `.env.example` first
- Document in README.md
- Never commit `.env` files

## Future Development

See README.md "Future Enhancements" section for planned features.

When implementing new features:
1. Consider backward compatibility
2. Maintain localStorage schema compatibility
3. Keep bundle size under budget
4. Test across browsers and devices
5. Update all documentation

## Getting Help

- **README.md**: User-facing documentation
- **CLAUDE.md**: Claude-specific development context
- **This file**: General agent guidance
- **Code comments**: Inline documentation for complex logic

## Questions to Ask

If you're unsure about:
- **Architecture decisions**: Check with the user first
- **Breaking changes**: Always ask before modifying core functionality
- **New dependencies**: Discuss bundle size impact
- **Design changes**: Get user approval for UI/UX changes

---

**Last Updated**: 2025-11-15
**Project Status**: Production-ready (Phase 1 & 2 completed)
**Maintainer**: nabobery
