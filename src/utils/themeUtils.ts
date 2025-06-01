import type { ResolvedTheme } from "../contexts/ThemeContext";

// Get current system theme preference
export const getSystemTheme = (): ResolvedTheme => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

// Check if system supports dark mode
export const supportsColorScheme = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").media !== "not all";
};

// Get theme colors for different contexts
export const getThemeColors = (theme: ResolvedTheme) => ({
  background: theme === "dark" ? "#1f2937" : "#ffffff",
  foreground: theme === "dark" ? "#f9fafb" : "#111827",
  muted: theme === "dark" ? "#374151" : "#f3f4f6",
  border: theme === "dark" ? "#4b5563" : "#e5e7eb",
  accent: theme === "dark" ? "#3b82f6" : "#2563eb",
});

// Apply theme colors to meta tags
export const updateMetaThemeColor = (theme: ResolvedTheme): void => {
  if (typeof window !== "undefined") {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#1f2937" : "#ffffff"
      );
    }
  }
};

// Apply theme classes to document
export const applyThemeToDocument = (theme: ResolvedTheme): void => {
  if (typeof window !== "undefined") {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Set data attribute for Tailwind dark mode
    root.setAttribute("data-theme", theme);

    // Update meta theme-color
    updateMetaThemeColor(theme);
  }
};
