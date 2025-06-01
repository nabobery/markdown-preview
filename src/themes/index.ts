import type { ThemeConfig } from "../types";

// Light theme configuration
export const lightTheme: ThemeConfig = {
  type: "light",
  colors: {
    // Background colors
    background: "#ffffff",
    surface: "#f8fafc",
    surfaceSecondary: "#f1f5f9",

    // Text colors - High contrast
    text: "#0f172a",
    textSecondary: "#334155",
    textMuted: "#64748b",

    // Border colors
    border: "#e2e8f0",
    borderLight: "#f1f5f9",

    // Interactive colors
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    secondary: "#64748b",
    secondaryHover: "#475569",

    // Status colors
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",

    // Editor specific - Optimal contrast
    editorBackground: "#ffffff",
    editorGutter: "#f8fafc",
    editorSelection: "#dbeafe",
    editorCursor: "#3b82f6",
    editorActiveLine: "#f8fafc",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
};

// Dark theme configuration - Enhanced contrast
export const darkTheme: ThemeConfig = {
  type: "dark",
  colors: {
    // Background colors - Improved contrast
    background: "#0a0f1c",
    surface: "#1a1f2e",
    surfaceSecondary: "#242938",

    // Text colors - Much better contrast
    text: "#f8fafc",
    textSecondary: "#e2e8f0",
    textMuted: "#9ca3af",

    // Border colors
    border: "#374151",
    borderLight: "#242938",

    // Interactive colors
    primary: "#60a5fa",
    primaryHover: "#3b82f6",
    secondary: "#9ca3af",
    secondaryHover: "#d1d5db",

    // Status colors
    success: "#34d399",
    warning: "#fbbf24",
    error: "#f87171",
    info: "#60a5fa",

    // Editor specific - High contrast for dark mode
    editorBackground: "#0a0f1c",
    editorGutter: "#1a1f2e",
    editorSelection: "#1e3a8a",
    editorCursor: "#60a5fa",
    editorActiveLine: "#1a1f2e",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.3)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
  },
};

// Theme getter function
export const getThemeConfig = (theme: "light" | "dark"): ThemeConfig => {
  return theme === "dark" ? darkTheme : lightTheme;
};

// CSS Variables generator
export const generateCSSVariables = (
  themeConfig: ThemeConfig
): Record<string, string> => {
  const cssVars: Record<string, string> = {};

  // Colors
  Object.entries(themeConfig.colors).forEach(([key, value]) => {
    cssVars[`--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`] = value;
  });

  // Shadows
  Object.entries(themeConfig.shadows).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = value;
  });

  return cssVars;
};

// Apply CSS variables to document root with smooth transitions
export const applyCSSVariables = (themeConfig: ThemeConfig): void => {
  const root = document.documentElement;
  const cssVars = generateCSSVariables(themeConfig);

  // Add transition class before applying changes
  root.classList.add("theme-transitioning");

  Object.entries(cssVars).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Also set a data attribute for theme-specific styling
  root.setAttribute("data-theme", themeConfig.type);

  // Remove transition class after a short delay
  setTimeout(() => {
    root.classList.remove("theme-transitioning");
  }, 300);
};
