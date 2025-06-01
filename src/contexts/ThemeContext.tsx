import React, { createContext, useEffect, useState } from "react";
import type { ThemeContextType, ThemeType } from "../types";
import { getThemeConfig, applyCSSVariables } from "../themes";

// Create the theme context
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

// Local storage key for theme preference
const THEME_STORAGE_KEY = "markdown-previewer-theme";

// System theme detection
const getSystemPreference = (): "light" | "dark" => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

// Resolve theme based on current setting and system preference
const resolveTheme = (
  theme: ThemeType,
  systemPreference: "light" | "dark"
): "light" | "dark" => {
  if (theme === "system") {
    return systemPreference;
  }
  return theme;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [systemPreference, setSystemPreference] = useState<"light" | "dark">(
    getSystemPreference
  );
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    // Load saved theme from localStorage or default to "system"
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (
        saved &&
        (saved === "light" || saved === "dark" || saved === "system")
      ) {
        return saved as ThemeType;
      }
    }
    return "system";
  });

  const resolvedTheme = resolveTheme(currentTheme, systemPreference);
  const themeConfig = getThemeConfig(resolvedTheme);

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Apply CSS variables whenever theme changes
  useEffect(() => {
    applyCSSVariables(themeConfig);
  }, [themeConfig]);

  // Save theme preference to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    }
  }, [currentTheme]);

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
  };

  const value: ThemeContextType = {
    currentTheme,
    resolvedTheme,
    themeConfig,
    setTheme,
    systemPreference,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
