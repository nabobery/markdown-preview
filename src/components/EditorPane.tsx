import React, { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { search, searchKeymap } from "@codemirror/search";
import { keymap } from "@codemirror/view";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import type { Extension } from "@codemirror/state";
import { useTheme } from "../hooks/useTheme";
import { copyToClipboard, showNotification } from "../utils";

interface EditorPaneProps {
  content: string;
  onChange: (value: string) => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
  scrollExtension?: Extension;
}

const EditorPane: React.FC<EditorPaneProps> = ({
  content,
  onChange,
  scrollRef,
  scrollExtension,
}) => {
  const { resolvedTheme } = useTheme();

  // Handle copy markdown functionality
  const handleCopyMarkdown = useCallback(async () => {
    if (!content.trim()) {
      showNotification("No content to copy", "error");
      return;
    }

    try {
      await copyToClipboard(content);
      showNotification("Markdown copied to clipboard!", "success");
    } catch (error) {
      console.error("Failed to copy markdown:", error);
      showNotification("Failed to copy markdown", "error");
    }
  }, [content]);

  // Build extensions array
  const extensions = [
    markdown(),
    search({
      top: true,
    }),
    keymap.of(searchKeymap),
    ...(scrollExtension ? [scrollExtension] : []),
  ];

  return (
    <div
      className={`
      flex flex-col h-full border rounded-lg overflow-hidden
      ${
        resolvedTheme === "dark"
          ? "bg-gray-800 border-gray-600"
          : "bg-white border-gray-200"
      }
    `}
    >
      {/* Header */}
      <div
        className={`
        px-6 py-4 border-b flex items-center justify-between
        ${
          resolvedTheme === "dark"
            ? "bg-gray-900 border-gray-600"
            : "bg-gray-50 border-gray-200"
        }
      `}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`
              w-2 h-2 rounded-full
              ${resolvedTheme === "dark" ? "bg-green-400" : "bg-green-500"}
            `}
            />
            <h2
              className={`
              text-lg font-semibold
              ${resolvedTheme === "dark" ? "text-gray-100" : "text-gray-900"}
            `}
            >
              Markdown Editor
            </h2>
          </div>
          <span
            className={`
            text-sm px-2 py-1 rounded
            ${
              resolvedTheme === "dark"
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-600"
            }
          `}
          >
            {content.length} chars
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`
            text-xs px-2 py-1 rounded
            ${
              resolvedTheme === "dark"
                ? "bg-blue-900 text-blue-200"
                : "bg-blue-50 text-blue-600"
            }
          `}
          >
            Ctrl+F to search
          </span>

          {/* Copy button */}
          <button
            onClick={handleCopyMarkdown}
            title="Copy markdown to clipboard"
            className={`
              p-2 rounded-lg transition-all duration-200 hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${
                resolvedTheme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-blue-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-blue-500"
              }
            `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.375A2.25 2.25 0 014.125 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
              />
            </svg>
          </button>

          {/* Settings button (for future use) */}
          <button
            title="Editor settings"
            className={`
              p-2 rounded-lg transition-all duration-200 hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${
                resolvedTheme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-blue-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-blue-500"
              }
            `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 min-h-0" ref={scrollRef}>
        <CodeMirror
          value={content}
          onChange={onChange}
          theme={resolvedTheme === "dark" ? githubDark : githubLight}
          extensions={extensions}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightSelectionMatches: true,
            searchKeymap: false, // We're handling this separately
          }}
          className="text-left h-full"
          placeholder="Start typing your markdown here..."
        />
      </div>

      {/* Footer */}
      <div
        className={`
        px-6 py-3 border-t flex items-center justify-between flex-shrink-0
        ${
          resolvedTheme === "dark"
            ? "bg-gray-900 border-gray-600 text-gray-300"
            : "bg-gray-50 border-gray-200 text-gray-600"
        }
      `}
      >
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Markdown Editor</span>
          <span
            className={`
            px-2 py-1 rounded text-xs
            ${
              resolvedTheme === "dark"
                ? "bg-green-900 text-green-200"
                : "bg-green-50 text-green-600"
            }
          `}
          >
            Syntax highlighting
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`
            w-2 h-2 rounded-full
            ${resolvedTheme === "dark" ? "bg-green-400" : "bg-green-500"}
          `}
          />
          <span className="text-sm">Active</span>
        </div>
      </div>
    </div>
  );
};

export default EditorPane;
