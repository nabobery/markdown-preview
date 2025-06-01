import React, { useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme } from "../hooks/useTheme";
import { copyToClipboard, showNotification } from "../utils";

interface PreviewPaneProps {
  content: string;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

const PreviewPane: React.FC<PreviewPaneProps> = React.memo(
  ({ content, scrollRef }) => {
    const { resolvedTheme } = useTheme();

    // Handle copy HTML functionality
    const handleCopyHTML = useCallback(async () => {
      if (!content.trim()) {
        showNotification("No content to copy", "error");
        return;
      }

      try {
        // Create a temporary div to get the rendered HTML
        const tempDiv = document.createElement("div");
        tempDiv.className = "markdown-content";
        tempDiv.innerHTML = content; // This would need proper markdown-to-HTML conversion

        // For now, let's copy the markdown content as HTML-formatted text
        await copyToClipboard(content);
        showNotification("Content copied to clipboard!", "success");
      } catch (error) {
        console.error("Failed to copy content:", error);
        showNotification("Failed to copy content", "error");
      }
    }, [content]);

    // Handle print functionality
    const handlePrint = useCallback(() => {
      if (!content.trim()) {
        showNotification("No content to print", "error");
        return;
      }

      try {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Markdown Preview</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 2rem;
                  line-height: 1.6;
                  color: #333;
                }
                h1, h2, h3, h4, h5, h6 {
                  margin-top: 2rem;
                  margin-bottom: 1rem;
                  font-weight: 600;
                }
                p { margin-bottom: 1rem; }
                code {
                  background: #f5f5f5;
                  padding: 0.2rem 0.4rem;
                  border-radius: 0.25rem;
                  font-family: 'Monaco', 'Menlo', monospace;
                }
                pre {
                  background: #f5f5f5;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  overflow: auto;
                }
                blockquote {
                  border-left: 4px solid #e5e7eb;
                  margin: 1rem 0;
                  padding-left: 1rem;
                  color: #6b7280;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 1rem 0;
                }
                th, td {
                  border: 1px solid #e5e7eb;
                  padding: 0.5rem;
                  text-align: left;
                }
                th {
                  background: #f9fafb;
                  font-weight: 600;
                }
              </style>
            </head>
            <body>
              <div class="markdown-content">${content}</div>
            </body>
          </html>
        `);
          printWindow.document.close();
          printWindow.print();
          printWindow.close();
        }
        showNotification("Opening print dialog...", "success");
      } catch (error) {
        console.error("Failed to print:", error);
        showNotification("Failed to open print dialog", "error");
      }
    }, [content]);

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
              ${resolvedTheme === "dark" ? "bg-blue-400" : "bg-blue-500"}
            `}
              />
              <h2
                className={`
              text-lg font-semibold
              ${resolvedTheme === "dark" ? "text-gray-100" : "text-gray-900"}
            `}
              >
                Live Preview
              </h2>
            </div>
            <span
              className={`
            text-sm px-2 py-1 rounded
            ${
              resolvedTheme === "dark"
                ? "bg-blue-900 text-blue-200"
                : "bg-blue-50 text-blue-600"
            }
          `}
            >
              Real-time
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy HTML button */}
            <button
              onClick={handleCopyHTML}
              title="Copy content to clipboard"
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

            {/* Print button */}
            <button
              onClick={handlePrint}
              title="Print preview"
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
                  d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M18.75 15.75h-2.25a.75.75 0 01-.75-.75V13.5a.75.75 0 01.75-.75h2.25m-8.25-6.75h2.25a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75v-4.5a.75.75 0 01.75-.75z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto min-h-0" ref={scrollRef}>
          {content.trim() ? (
            <div
              className={`
            p-6 markdown-content
            ${resolvedTheme === "dark" ? "text-gray-100" : "text-gray-900"}
          `}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Headings
                  h1: ({ children, ...props }) => (
                    <h1
                      className={`
                      text-3xl font-bold mb-4 mt-6 first:mt-0 pb-2 border-b
                      ${
                        resolvedTheme === "dark"
                          ? "text-gray-100 border-gray-600"
                          : "text-gray-900 border-gray-200"
                      }
                    `}
                      {...props}
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2
                      className={`
                      text-2xl font-semibold mb-3 mt-5 first:mt-0
                      ${
                        resolvedTheme === "dark"
                          ? "text-gray-100"
                          : "text-gray-900"
                      }
                    `}
                      {...props}
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3
                      className={`
                      text-xl font-semibold mb-2 mt-4 first:mt-0
                      ${
                        resolvedTheme === "dark"
                          ? "text-gray-100"
                          : "text-gray-900"
                      }
                    `}
                      {...props}
                    >
                      {children}
                    </h3>
                  ),
                  h4: ({ children, ...props }) => (
                    <h4
                      className={`
                      text-lg font-semibold mb-2 mt-3 first:mt-0
                      ${
                        resolvedTheme === "dark"
                          ? "text-gray-100"
                          : "text-gray-900"
                      }
                    `}
                      {...props}
                    >
                      {children}
                    </h4>
                  ),
                  h5: ({ children, ...props }) => (
                    <h5
                      className={`
                      text-base font-semibold mb-2 mt-3 first:mt-0
                      ${
                        resolvedTheme === "dark"
                          ? "text-gray-100"
                          : "text-gray-900"
                      }
                    `}
                      {...props}
                    >
                      {children}
                    </h5>
                  ),
                  h6: ({ children, ...props }) => (
                    <h6
                      className={`
                      text-sm font-semibold mb-2 mt-3 first:mt-0 uppercase tracking-wide
                      ${
                        resolvedTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700"
                      }
                    `}
                      {...props}
                    >
                      {children}
                    </h6>
                  ),

                  // Paragraphs
                  p: ({ children, ...props }) => (
                    <p
                      className={`
                      mb-4 leading-relaxed
                      ${
                        resolvedTheme === "dark"
                          ? "text-gray-100"
                          : "text-gray-900"
                      }
                    `}
                      {...props}
                    >
                      {children}
                    </p>
                  ),

                  // Links
                  a: ({ children, href, ...props }) => (
                    <a
                      href={href}
                      className={`
                      font-medium underline underline-offset-2 transition-colors duration-200
                      ${
                        resolvedTheme === "dark"
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-800"
                      }
                    `}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    >
                      {children}
                    </a>
                  ),

                  // Code
                  code: ({ children, className, ...props }) => (
                    <code
                      className={`
                      px-2 py-1 rounded text-sm font-mono
                      ${
                        resolvedTheme === "dark"
                          ? "bg-gray-700 text-gray-100"
                          : "bg-gray-100 text-gray-900"
                      }
                    `}
                      {...props}
                    >
                      {children}
                    </code>
                  ),

                  // Code blocks
                  pre: ({ children, ...props }) => (
                    <pre
                      className={`
                      p-4 rounded-lg overflow-x-auto mb-4 border
                      ${
                        resolvedTheme === "dark"
                          ? "bg-gray-800 border-gray-600 text-gray-100"
                          : "bg-gray-50 border-gray-200 text-gray-900"
                      }
                    `}
                      {...props}
                    >
                      {children}
                    </pre>
                  ),

                  // Blockquotes
                  blockquote: ({ children, ...props }) => (
                    <blockquote
                      className={`
                      border-l-4 pl-4 py-2 my-4 italic
                      ${
                        resolvedTheme === "dark"
                          ? "border-blue-400 bg-gray-800 text-gray-300"
                          : "border-blue-500 bg-blue-50 text-gray-700"
                      }
                    `}
                      {...props}
                    >
                      {children}
                    </blockquote>
                  ),

                  // Lists
                  ul: ({ children, ...props }) => (
                    <ul
                      className={`
                      list-disc pl-6 mb-4 space-y-1
                      ${
                        resolvedTheme === "dark"
                          ? "text-gray-100"
                          : "text-gray-900"
                      }
                    `}
                      {...props}
                    >
                      {children}
                    </ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol
                      className={`
                      list-decimal pl-6 mb-4 space-y-1
                      ${
                        resolvedTheme === "dark"
                          ? "text-gray-100"
                          : "text-gray-900"
                      }
                    `}
                      {...props}
                    >
                      {children}
                    </ol>
                  ),
                  li: ({ children, ...props }) => (
                    <li
                      className={`
                      leading-relaxed
                      ${
                        resolvedTheme === "dark"
                          ? "text-gray-100"
                          : "text-gray-900"
                      }
                    `}
                      {...props}
                    >
                      {children}
                    </li>
                  ),

                  // Tables
                  table: ({ children, ...props }) => (
                    <div className="overflow-x-auto mb-4">
                      <table
                        className={`
                        min-w-full border-collapse border
                        ${
                          resolvedTheme === "dark"
                            ? "border-gray-600"
                            : "border-gray-300"
                        }
                      `}
                        {...props}
                      >
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children, ...props }) => (
                    <thead
                      className={`
                      ${resolvedTheme === "dark" ? "bg-gray-700" : "bg-gray-50"}
                    `}
                      {...props}
                    >
                      {children}
                    </thead>
                  ),
                  th: ({ children, ...props }) => (
                    <th
                      className={`
                      border px-4 py-2 text-left font-semibold
                      ${
                        resolvedTheme === "dark"
                          ? "border-gray-600 text-gray-100"
                          : "border-gray-300 text-gray-900"
                      }
                    `}
                      {...props}
                    >
                      {children}
                    </th>
                  ),
                  td: ({ children, ...props }) => (
                    <td
                      className={`
                      border px-4 py-2
                      ${
                        resolvedTheme === "dark"
                          ? "border-gray-600 text-gray-100"
                          : "border-gray-300 text-gray-900"
                      }
                    `}
                      {...props}
                    >
                      {children}
                    </td>
                  ),

                  // Task lists
                  input: ({ type, checked, disabled, ...props }) => {
                    if (type === "checkbox") {
                      return (
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled
                          className={`
                          mr-2 rounded border-2 focus:ring-2 focus:ring-offset-2
                          ${
                            resolvedTheme === "dark"
                              ? "bg-gray-700 border-gray-500 text-blue-400 focus:ring-blue-400"
                              : "bg-white border-gray-300 text-blue-600 focus:ring-blue-500"
                          }
                        `}
                          {...props}
                        />
                      );
                    }
                    return <input type={type} {...props} />;
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <div
              className={`
            flex flex-col items-center justify-center h-full p-8 text-center
            ${resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"}
          `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 mb-4 opacity-50"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              <h3
                className={`
              text-lg font-medium mb-2
              ${resolvedTheme === "dark" ? "text-gray-300" : "text-gray-700"}
            `}
              >
                Start typing to see preview
              </h3>
              <p className="text-sm max-w-md">
                Your Markdown content will appear here in real-time as you type
                in the editor.
              </p>
            </div>
          )}
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
            <span className="font-medium">Live Preview</span>
            <span
              className={`
            px-2 py-1 rounded text-xs
            ${
              resolvedTheme === "dark"
                ? "bg-blue-900 text-blue-200"
                : "bg-blue-50 text-blue-600"
            }
          `}
            >
              GitHub Flavored Markdown
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`
            w-2 h-2 rounded-full
            ${resolvedTheme === "dark" ? "bg-blue-400" : "bg-blue-500"}
          `}
            />
            <span className="text-sm">Live</span>
          </div>
        </div>
      </div>
    );
  }
);

PreviewPane.displayName = "PreviewPane";

export default PreviewPane;
