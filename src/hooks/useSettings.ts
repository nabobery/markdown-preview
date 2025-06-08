import { useState, useEffect } from "react";
import type { AppSettings } from "../types";

const SETTINGS_STORAGE_KEY = "markdown-previewer-settings";

const defaultSettings: AppSettings = {
  theme: "system",
  previewTheme: "default",
  fontSize: 14,
  showLineNumbers: true,
  wordWrap: true,
  autoSave: true,
  autoSaveInterval: 5000,
  // Enhanced Table Features
  tableZebraStripes: false,
  tableAlignmentIndicators: true,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Load settings from localStorage or use defaults
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (saved) {
          const parsedSettings = JSON.parse(saved);
          // Merge with defaults to ensure all properties exist
          return { ...defaultSettings, ...parsedSettings };
        }
      } catch (error) {
        console.warn("Failed to load settings from localStorage:", error);
      }
    }
    return defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.warn("Failed to save settings to localStorage:", error);
      }
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    setSettings,
  };
};
