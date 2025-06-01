import { useEffect, useState, type ReactNode } from "react";
import { getSystemTheme, applyThemeToDocument } from "../utils/themeUtils";
import {
  ThemeContext,
  type Theme,
  type ResolvedTheme,
  type ThemeContextType,
} from "./themeObject";

// Theme context props
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

// Theme provider component
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "markdown-editor-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  // Resolve theme based on current theme setting
  const resolveTheme = (currentTheme: Theme): ResolvedTheme => {
    if (currentTheme === "system") {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  // Toggle between light and dark (skip system)
  const toggleTheme = () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
        setThemeState(storedTheme);
      }
    }
  }, [storageKey]);

  // Update resolved theme when theme changes
  useEffect(() => {
    const newResolvedTheme = resolveTheme(theme);
    setResolvedTheme(newResolvedTheme);
    applyThemeToDocument(newResolvedTheme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = () => {
        if (theme === "system") {
          const newResolvedTheme = getSystemTheme();
          setResolvedTheme(newResolvedTheme);
          applyThemeToDocument(newResolvedTheme);
        }
      };

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
