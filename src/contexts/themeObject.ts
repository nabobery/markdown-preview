import { createContext } from "react";

// Theme types
export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

// Theme context interface
export interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Create and export the theme context object
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
