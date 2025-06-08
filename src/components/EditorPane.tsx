import React, { lazy, Suspense, useRef, useCallback, useEffect } from "react";
import { markdown } from "@codemirror/lang-markdown";
import { searchKeymap, search } from "@codemirror/search";
import { keymap, EditorView } from "@codemirror/view";
import { selectAll } from "@codemirror/commands";
import { drawSelection } from "@codemirror/view";
import type { Extension } from "@codemirror/state";
import { copyToClipboard, showNotification } from "../utils";
import type { AppSettings } from "../types";
import { useTheme } from "../hooks/useTheme";

const CodeMirror = lazy(() => import("@uiw/react-codemirror"));

// Utility function to sanitize error messages for logging
const sanitizeErrorForLogging = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message.replace(/[\r\n]+/g, " ").substring(0, 200);
  }
  return String(err)
    .replace(/[\r\n]+/g, " ")
    .substring(0, 200);
};

interface EditorPaneProps {
  content: string;
  onChange: (content: string) => void;
  scrollExtension?: Extension;
  settings: AppSettings;
  className?: string;
}

// Enhanced loading component for CodeMirror
const EditorLoadingFallback = () => (
  <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
    <div className="flex-1 min-h-0 overflow-hidden flex items-center justify-center theme-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="text-sm theme-text-muted">Loading editor...</span>
      </div>
    </div>
  </div>
);

export const EditorPane: React.FC<EditorPaneProps> = ({
  content,
  onChange,
  scrollExtension,
  settings,
  className = "",
}) => {
  const editorRef = useRef<{ view?: EditorView } | null>(null);
  const { themeConfig } = useTheme();

  // Apply font size to CSS variables for better control
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--editor-font-size",
      `${settings.fontSize}px`
    );
  }, [settings.fontSize]);

  // Create custom theme extension with proper selection styling and font size
  const customTheme = EditorView.theme({
    // Font size application
    "&.cm-editor": {
      fontSize: `var(--editor-font-size, ${settings.fontSize}px)`,
    },
    "&.cm-editor .cm-content": {
      fontSize: `var(--editor-font-size, ${settings.fontSize}px)`,
    },
    "&.cm-editor .cm-line": {
      fontSize: `var(--editor-font-size, ${settings.fontSize}px)`,
    },
    // Primary selection styling - highest specificity
    "&.cm-editor .cm-selectionBackground": {
      background: `${themeConfig.colors.editorSelection} !important`,
      color: `${
        themeConfig.type === "dark" ? "#ffffff" : "#000000"
      } !important`,
    },
    "&.cm-focused .cm-selectionBackground": {
      background: `${themeConfig.colors.editorSelection} !important`,
      color: `${
        themeConfig.type === "dark" ? "#ffffff" : "#000000"
      } !important`,
    },
    // Native browser selection
    "&.cm-editor ::selection": {
      background: `${themeConfig.colors.editorSelection} !important`,
      color: `${
        themeConfig.type === "dark" ? "#ffffff" : "#000000"
      } !important`,
    },
    "&.cm-editor ::-moz-selection": {
      background: `${themeConfig.colors.editorSelection} !important`,
      color: `${
        themeConfig.type === "dark" ? "#ffffff" : "#000000"
      } !important`,
    },
    // Content area selection
    "&.cm-editor .cm-content ::selection": {
      background: `${themeConfig.colors.editorSelection} !important`,
      color: `${
        themeConfig.type === "dark" ? "#ffffff" : "#000000"
      } !important`,
    },
    "&.cm-editor .cm-content ::-moz-selection": {
      background: `${themeConfig.colors.editorSelection} !important`,
      color: `${
        themeConfig.type === "dark" ? "#ffffff" : "#000000"
      } !important`,
    },
    // Line selection
    "&.cm-editor .cm-line ::selection": {
      background: `${themeConfig.colors.editorSelection} !important`,
      color: `${
        themeConfig.type === "dark" ? "#ffffff" : "#000000"
      } !important`,
    },
    "&.cm-editor .cm-line ::-moz-selection": {
      background: `${themeConfig.colors.editorSelection} !important`,
      color: `${
        themeConfig.type === "dark" ? "#ffffff" : "#000000"
      } !important`,
    },
    // Cursor styling
    "&.cm-editor .cm-cursor, &.cm-editor .cm-cursor-primary": {
      borderLeftColor: `${themeConfig.colors.editorCursor} !important`,
      borderLeftWidth: "2px !important",
    },
    // Selection layer styling for drawSelection
    "&.cm-editor .cm-selectionLayer .cm-selectionBackground": {
      background: `${themeConfig.colors.editorSelection} !important`,
    },
    // Unfocused selection
    "&.cm-editor:not(.cm-focused) .cm-selectionBackground": {
      background: `${themeConfig.colors.editorSelection} !important`,
      color: `${
        themeConfig.type === "dark" ? "#ffffff" : "#000000"
      } !important`,
      opacity: "0.8",
    },
  });

  // Enhanced custom keybindings based on CodeMirror best practices
  const customKeymap = keymap.of([
    {
      key: "Ctrl-a",
      run: (view) => {
        // Use CodeMirror's built-in selectAll command first
        selectAll(view);

        // Then add our notification
        const docLength = view.state.doc.length;
        if (docLength > 0) {
          showNotification(`Selected all ${docLength} characters`, "success");
        } else {
          showNotification("Editor is empty. Nothing to select.", "info");
        }
        return true;
      },
    },
    {
      key: "Ctrl-c",
      run: (view) => {
        const selection = view.state.selection.main;

        if (selection.empty) {
          showNotification("No text selected to copy.", "info");
          return true;
        }

        const selectedText = view.state.sliceDoc(selection.from, selection.to);

        // Ensure editor has focus before clipboard operation
        view.focus();

        // Use proper clipboard API with fallbacks
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard
            .writeText(selectedText)
            .then(() => {
              showNotification(
                `Copied ${selectedText.length} characters!`,
                "success"
              );
            })
            .catch((err) => {
              console.error(
                "Clipboard copy error:",
                sanitizeErrorForLogging(err)
              );
              // Try fallback
              copyWithFallback(selectedText);
            });
        } else {
          copyWithFallback(selectedText);
        }
        return true;
      },
    },
    {
      key: "Ctrl-v",
      run: (view) => {
        // Ensure editor has focus
        view.focus();

        // Use proper clipboard API
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard
            .readText()
            .then((clipboardText) => {
              if (clipboardText) {
                // Use CodeMirror's replaceSelection helper for proper handling
                view.dispatch(view.state.replaceSelection(clipboardText));
                view.focus();
                showNotification(
                  `Pasted ${clipboardText.length} characters!`,
                  "success"
                );
              } else {
                showNotification(
                  "Clipboard is empty. Nothing to paste.",
                  "info"
                );
              }
            })
            .catch((err) => {
              console.error(
                "Clipboard paste error:",
                sanitizeErrorForLogging(err)
              );
              showNotification(
                "Paste failed. Click the editor to focus and try again.",
                "error"
              );
            });
        } else {
          showNotification(
            "Paste requires HTTPS or localhost for security.",
            "error"
          );
        }
        return true;
      },
    },
    {
      key: "Ctrl-x",
      run: (view) => {
        const selection = view.state.selection.main;

        if (selection.empty) {
          showNotification("No text selected to cut.", "info");
          return true;
        }

        const selectedText = view.state.sliceDoc(selection.from, selection.to);

        view.focus();

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard
            .writeText(selectedText)
            .then(() => {
              // Use CodeMirror's replaceSelection with empty string
              view.dispatch(view.state.replaceSelection(""));
              view.focus();
              showNotification(
                `Cut ${selectedText.length} characters!`,
                "success"
              );
            })
            .catch((err) => {
              console.error(
                "Clipboard cut error:",
                sanitizeErrorForLogging(err)
              );
              copyWithFallback(selectedText);
              // Still remove the text
              view.dispatch(view.state.replaceSelection(""));
              view.focus();
              showNotification(
                `Cut ${selectedText.length} characters!`,
                "success"
              );
            });
        } else {
          copyWithFallback(selectedText);
          view.dispatch(view.state.replaceSelection(""));
          view.focus();
          showNotification(`Cut ${selectedText.length} characters!`, "success");
        }
        return true;
      },
    },
  ]);

  // Fallback copy function for non-secure contexts
  const copyWithFallback = useCallback((text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showNotification(`Copied ${text.length} characters!`, "success");
    } catch (err) {
      console.error("Fallback copy error:", sanitizeErrorForLogging(err));
      showNotification("Copy failed.", "error");
    }
  }, []);

  const extensions = [
    markdown(),
    search(),
    keymap.of(searchKeymap),
    customKeymap, // Add our custom keybindings
    customTheme,
    drawSelection(), // Enable custom selection rendering
    ...(settings.wordWrap ? [EditorView.lineWrapping] : []),
    ...(scrollExtension ? [scrollExtension] : []),
  ];

  const handleCopyMarkdown = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      showNotification("Markdown copied to clipboard!", "success");
    } else {
      showNotification("Failed to copy markdown", "error");
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col theme-background border-b theme-border lg:border-b-0 lg:border-r lg:border-gray-300 min-h-0 shadow-sm ${className}`}
    >
      {/* Enhanced Editor Header */}
      <div className="theme-surface border-b theme-border px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h2 className="text-sm font-semibold theme-text">Editor</h2>
            <span className="text-xs theme-text-secondary">Markdown</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs theme-text-secondary">
              {content.length} characters
            </div>
            <div className="text-xs theme-text-secondary border-l theme-border pl-2">
              Ctrl+A/C/V/X • Ctrl+F to search
            </div>
            <button
              onClick={handleCopyMarkdown}
              className="p-1 hover:bg-opacity-80 theme-surface rounded transition-colors"
              title="Copy All Markdown"
            >
              <svg
                className="w-4 h-4 theme-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced CodeMirror Editor */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden">
          <Suspense fallback={<EditorLoadingFallback />}>
            <CodeMirror
              ref={editorRef}
              value={content}
              onChange={onChange}
              extensions={extensions}
              height="100%"
              basicSetup={{
                lineNumbers: settings.showLineNumbers,
                foldGutter: true,
                dropCursor: false,
                allowMultipleSelections: false,
                indentOnInput: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                highlightActiveLine: true,
                highlightSelectionMatches: false,
                searchKeymap: false,
                rectangularSelection: true,
                crosshairCursor: false,
                drawSelection: false,
              }}
              placeholder="Start typing your Markdown here... (Ctrl+A to select all, Ctrl+C to copy, Ctrl+V to paste, Ctrl+X to cut)"
              className="text-left h-full"
              style={{
                lineHeight: "1.6",
              }}
            />
          </Suspense>
        </div>

        {/* Footer */}
        <div className="border-t theme-border theme-surface px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between text-xs theme-text-secondary">
            <div className="flex items-center space-x-4">
              <span>Markdown Editor</span>
              <span>•</span>
              <span>{settings.fontSize}px</span>
              {settings.wordWrap && (
                <>
                  <span>•</span>
                  <span>Word wrap</span>
                </>
              )}
              {settings.autoSave && (
                <>
                  <span>•</span>
                  <span>Auto-save</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span>Ready</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
