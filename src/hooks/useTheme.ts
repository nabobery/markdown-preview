import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import type { ThemeContextType } from "../contexts/ThemeContext";

// Custom hook to use theme context
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
