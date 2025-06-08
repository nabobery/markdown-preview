// Core types for the Markdown Live Previewer

export interface EditorState {
  content: string;
  cursorPosition: number;
  scrollPosition: number;
}

export interface PreviewState {
  htmlContent: string;
  scrollPosition: number;
}

// Enhanced theme system types
export type ThemeType = "light" | "dark" | "system";

export interface ThemeConfig {
  type: ThemeType;
  colors: {
    // Background colors
    background: string;
    surface: string;
    surfaceSecondary: string;

    // Text colors
    text: string;
    textSecondary: string;
    textMuted: string;

    // Border colors
    border: string;
    borderLight: string;

    // Interactive colors
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;

    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;

    // Editor specific
    editorBackground: string;
    editorGutter: string;
    editorSelection: string;
    editorSelectionText: string;
    editorCursor: string;
    editorActiveLine: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface ThemeContextType {
  currentTheme: ThemeType;
  resolvedTheme: "light" | "dark"; // The actual resolved theme (system preference resolved)
  themeConfig: ThemeConfig;
  setTheme: (theme: ThemeType) => void;
  systemPreference: "light" | "dark";
}

export interface AppSettings {
  theme: ThemeType;
  previewTheme: string;
  fontSize: number;
  showLineNumbers: boolean;
  wordWrap: boolean;
  autoSave: boolean;
  autoSaveInterval: number;
  // Enhanced Table Features
  tableZebraStripes: boolean;
  tableAlignmentIndicators: boolean;
}

export interface MarkdownFile {
  name: string;
  content: string;
  lastModified: Date;
}
