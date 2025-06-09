import React, { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import type { AppSettings } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  // Update local settings when props change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSettingChange = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    const updatedSettings = { ...localSettings, [key]: value };
    setLocalSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };

  const handleResetSettings = () => {
    const defaultSettings: AppSettings = {
      theme: "system",
      previewTheme: "default",
      fontSize: 14,
      showLineNumbers: true,
      wordWrap: true,
      autoSave: true,
      autoSaveInterval: 5000,
      // Enhanced Table Features defaults
      tableZebraStripes: false,
      tableAlignmentIndicators: true,
      // Table of Contents Features
      showTableOfContents: true,
      tocPosition: "left",
      tocMaxLevel: 3,
    };
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative theme-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border theme-border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b theme-border">
            <h2 className="text-xl font-semibold theme-text">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-opacity-80 theme-surface rounded-lg transition-colors"
              title="Close settings"
            >
              <svg
                className="w-5 h-5 theme-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Theme Section */}
            <section>
              <h3 className="text-lg font-medium theme-text mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 theme-text-secondary"
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
                Appearance
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium theme-text-secondary mb-2">
                    Theme
                  </label>
                  <ThemeToggle />
                  <p className="text-xs theme-text-muted mt-2">
                    Choose between light, dark, or system theme preference
                  </p>
                </div>
              </div>
            </section>

            {/* Editor Section */}
            <section>
              <h3 className="text-lg font-medium theme-text mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 theme-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editor
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium theme-text-secondary mb-2">
                    Font Size
                  </label>
                  <select
                    value={localSettings.fontSize}
                    onChange={(e) =>
                      handleSettingChange("fontSize", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 theme-background border theme-border rounded-md theme-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={12}>12px</option>
                    <option value={13}>13px</option>
                    <option value={14}>14px</option>
                    <option value={15}>15px</option>
                    <option value={16}>16px</option>
                    <option value={18}>18px</option>
                    <option value={20}>20px</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium theme-text-secondary">
                      Show Line Numbers
                    </label>
                    <p className="text-xs theme-text-muted">
                      Display line numbers in the editor
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleSettingChange(
                        "showLineNumbers",
                        !localSettings.showLineNumbers
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      localSettings.showLineNumbers
                        ? "bg-blue-600"
                        : "theme-border bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.showLineNumbers
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium theme-text-secondary">
                      Word Wrap
                    </label>
                    <p className="text-xs theme-text-muted">
                      Wrap long lines in the editor
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleSettingChange("wordWrap", !localSettings.wordWrap)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      localSettings.wordWrap
                        ? "bg-blue-600"
                        : "theme-border bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.wordWrap
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* Auto-save Section */}
            <section>
              <h3 className="text-lg font-medium theme-text mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 theme-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Auto-save
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium theme-text-secondary">
                      Enable Auto-save
                    </label>
                    <p className="text-xs theme-text-muted">
                      Automatically save your work to local storage
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleSettingChange("autoSave", !localSettings.autoSave)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      localSettings.autoSave
                        ? "bg-blue-600"
                        : "theme-border bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.autoSave
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {localSettings.autoSave && (
                  <div>
                    <label className="block text-sm font-medium theme-text-secondary mb-2">
                      Auto-save Interval
                    </label>
                    <select
                      value={localSettings.autoSaveInterval}
                      onChange={(e) =>
                        handleSettingChange(
                          "autoSaveInterval",
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 theme-background border theme-border rounded-md theme-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={1000}>1 second</option>
                      <option value={3000}>3 seconds</option>
                      <option value={5000}>5 seconds</option>
                      <option value={10000}>10 seconds</option>
                      <option value={30000}>30 seconds</option>
                    </select>
                  </div>
                )}
              </div>
            </section>

            {/* Table Settings Section */}
            <section>
              <h3 className="text-lg font-medium theme-text mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 theme-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M3 6h18m-9 8h9m-9 4h9m-9-8V6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2z"
                  />
                </svg>
                Tables
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium theme-text-secondary">
                      Zebra Stripes
                    </label>
                    <p className="text-xs theme-text-muted">
                      Alternate row colors for easier table scanning
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleSettingChange(
                        "tableZebraStripes",
                        !localSettings.tableZebraStripes
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      localSettings.tableZebraStripes
                        ? "bg-blue-600"
                        : "theme-border bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.tableZebraStripes
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium theme-text-secondary">
                      Alignment Indicators
                    </label>
                    <p className="text-xs theme-text-muted">
                      Show visual indicators for column text alignment
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleSettingChange(
                        "tableAlignmentIndicators",
                        !localSettings.tableAlignmentIndicators
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      localSettings.tableAlignmentIndicators
                        ? "bg-blue-600"
                        : "theme-border bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.tableAlignmentIndicators
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* Table of Contents Section */}
            <section>
              <h3 className="text-lg font-medium theme-text mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 theme-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                Table of Contents
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium theme-text-secondary">
                      Show Table of Contents
                    </label>
                    <p className="text-xs theme-text-muted">
                      Display a navigable table of contents sidebar
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleSettingChange(
                        "showTableOfContents",
                        !localSettings.showTableOfContents
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      localSettings.showTableOfContents
                        ? "bg-blue-600"
                        : "theme-border bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.showTableOfContents
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {localSettings.showTableOfContents && (
                  <>
                    <div>
                      <label className="block text-sm font-medium theme-text-secondary mb-2">
                        TOC Position
                      </label>
                      <select
                        value={localSettings.tocPosition}
                        onChange={(e) =>
                          handleSettingChange(
                            "tocPosition",
                            e.target.value as "left" | "right"
                          )
                        }
                        className="w-full px-3 py-2 theme-background border theme-border rounded-md theme-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="left">Left sidebar</option>
                        <option value="right">Right sidebar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium theme-text-secondary mb-2">
                        Maximum Heading Level
                      </label>
                      <select
                        value={localSettings.tocMaxLevel}
                        onChange={(e) =>
                          handleSettingChange(
                            "tocMaxLevel",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 theme-background border theme-border rounded-md theme-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={1}>H1 only</option>
                        <option value={2}>H1-H2</option>
                        <option value={3}>H1-H3</option>
                        <option value={4}>H1-H4</option>
                        <option value={5}>H1-H5</option>
                        <option value={6}>H1-H6</option>
                      </select>
                      <p className="text-xs theme-text-muted mt-2">
                        Show headings up to the selected level in the TOC
                      </p>
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t theme-border">
            <button
              onClick={handleResetSettings}
              className="px-4 py-2 text-sm font-medium theme-text-secondary border theme-border rounded-md hover:bg-opacity-80 theme-surface transition-colors"
            >
              Reset to Defaults
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
