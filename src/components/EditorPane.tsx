import React, { lazy, Suspense } from "react";
import { markdown } from "@codemirror/lang-markdown";
import { searchKeymap, search } from "@codemirror/search";
import { keymap, EditorView } from "@codemirror/view";
import type { Extension } from "@codemirror/state";
import { copyToClipboard, showNotification } from "../utils";
import type { AppSettings } from "../types";

const CodeMirror = lazy(() => import("@uiw/react-codemirror"));

interface EditorPaneProps {
  content: string;
  onChange: (content: string) => void;
  scrollExtension?: Extension;
  settings: AppSettings;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  content,
  onChange,
  scrollExtension,
  settings,
}) => {
  const extensions = [
    markdown(),
    search(),
    keymap.of(searchKeymap),
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
    <div className="flex-1 flex flex-col theme-background border-b theme-border lg:border-b-0 lg:border-r lg:border-gray-300 min-h-0 shadow-sm">
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
              Ctrl+F to search
            </div>
            <button
              onClick={handleCopyMarkdown}
              className="p-1 hover:bg-opacity-80 theme-surface rounded transition-colors"
              title="Copy Markdown"
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

      {/* Enhanced CodeMirror Editor - Fixed layout with settings integration */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden">
          <Suspense fallback={<div>Loading editor...</div>}>
            <CodeMirror
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
                highlightSelectionMatches: true,
                searchKeymap: false, // We're adding it manually above
              }}
              placeholder="Start typing your Markdown here..."
              className="text-left h-full"
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: "1.6",
              }}
            />
          </Suspense>
        </div>

        {/* Footer - Always visible */}
        <div className="border-t theme-border theme-surface px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between text-xs theme-text-secondary">
            <div className="flex items-center space-x-4">
              <span>Markdown Editor</span>
              <span>•</span>
              <span>Syntax highlighting</span>
              <span>•</span>
              <span>Search enabled</span>
              <span>•</span>
              <span>{settings.fontSize}px</span>
              {settings.wordWrap && (
                <>
                  <span>•</span>
                  <span>Word wrap</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span>Active</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
