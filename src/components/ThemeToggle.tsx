import React from "react";
import { useTheme } from "../hooks";
import type { ThemeType } from "../types";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const { currentTheme, setTheme, systemPreference } = useTheme();

  const themeOptions: {
    value: ThemeType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "light",
      label: "Light",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      value: "dark",
      label: "Dark",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ),
    },
    {
      value: "system",
      label: "System",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-1 bg-opacity-50 theme-surface rounded-lg p-1 border theme-border">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleThemeChange(option.value)}
            className={`
              inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 
              ${
                currentTheme === option.value
                  ? "bg-blue-500 text-white shadow-sm"
                  : "theme-text-secondary hover:theme-text hover:bg-opacity-80 theme-surface-secondary"
              }
            `}
            title={`Switch to ${option.label.toLowerCase()} theme`}
          >
            {option.icon}
            <span className="ml-1 hidden sm:inline">{option.label}</span>
          </button>
        ))}
      </div>
      {currentTheme === "system" && (
        <div className="absolute -bottom-6 left-0 text-xs theme-text-muted">
          Using {systemPreference}
        </div>
      )}
    </div>
  );
};
