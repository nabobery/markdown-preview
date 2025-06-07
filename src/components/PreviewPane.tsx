import React, { lazy } from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { copyToClipboard, showNotification } from "../utils";
import { MermaidDiagram } from "./MermaidDiagram";
import "katex/dist/katex.min.css"; // KaTeX CSS for math rendering

const Markdown = lazy(() => import("react-markdown"));

interface PreviewPaneProps {
  content: string;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Extract markdown component definitions for better organization
const markdownComponents = {
  // Enhanced task lists
  input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      className="mr-3 w-4 h-4 accent-blue-600 rounded"
      disabled
    />
  ),
  // Enhanced tables
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6 rounded-lg border theme-border shadow-sm">
      <table {...props} className="min-w-full divide-y theme-border" />
    </div>
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
    <th
      {...props}
      className="px-6 py-3 theme-surface text-left text-xs font-semibold theme-text uppercase tracking-wider border-b theme-border"
    />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
    <td
      {...props}
      className="px-6 py-4 text-sm theme-text-secondary border-b theme-border"
    />
  ),
  // Enhanced code blocks
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      {...props}
      className="theme-surface-secondary theme-text rounded-lg p-4 overflow-x-auto shadow-lg border theme-border my-4"
    />
  ),
  code: (props: CodeProps) => {
    const { inline, className, children } = props;

    if (inline) {
      return (
        <code className="text-pink-600 bg-pink-50 px-2 py-1 rounded-md text-sm font-mono">
          {children}
        </code>
      );
    }

    // Check if this is a mermaid code block
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";

    if (language === "mermaid") {
      const code = String(children).replace(/\n$/, "");
      const id = Math.random().toString(36).substring(2, 11);
      console.log("Mermaid Diagram", code, id);
      return <MermaidDiagram code={code} id={id} />;
    }

    return <code className={className}>{children}</code>;
  },
  // Enhanced headings with proper left alignment
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      {...props}
      className="text-3xl font-bold theme-text mb-4 mt-6 pb-2 border-b theme-border text-left"
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className="text-2xl font-bold theme-text mb-3 mt-5 text-left"
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className="text-xl font-semibold theme-text mb-2 mt-4 text-left"
    />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      {...props}
      className="text-lg font-semibold theme-text mb-2 mt-3 text-left"
    />
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      {...props}
      className="text-base font-semibold theme-text mb-2 mt-3 text-left"
    />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      {...props}
      className="text-sm font-semibold theme-text mb-2 mt-3 text-left"
    />
  ),
  // Enhanced paragraphs
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="mb-4 theme-text-secondary text-left" />
  ),
  // Enhanced links
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      className="text-blue-600 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    />
  ),
  // Enhanced lists
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...props}
      className="list-disc list-inside mb-4 theme-text-secondary text-left"
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      {...props}
      className="list-decimal list-inside mb-4 theme-text-secondary text-left"
    />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li {...props} className="mb-2 text-left" />
  ),
  // Enhanced blockquotes
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      className="border-l-4 border-blue-500 pl-4 py-1 my-4 theme-text-muted italic text-left"
    />
  ),
  // Enhanced strong/emphasis
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} className="font-bold theme-text" />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em {...props} className="italic" />
  ),
  // Images
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} className="max-w-full h-auto rounded-lg my-4 shadow-md" />
  ),
  // Horizontal rule
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr {...props} className="border-t theme-border my-6" />
  ),
};

const PreviewPane: React.FC<PreviewPaneProps> = ({ content, scrollRef }) => {
  const handleCopyHTML = async () => {
    // Get the rendered HTML from the preview content
    const previewElement = scrollRef?.current?.querySelector(".max-w-none");
    if (previewElement) {
      const htmlContent = previewElement.innerHTML;
      const success = await copyToClipboard(htmlContent);
      if (success) {
        showNotification("HTML copied to clipboard!", "success");
      } else {
        showNotification("Failed to copy HTML", "error");
      }
    } else {
      showNotification("No content to copy", "error");
    }
  };

  const handlePrint = () => {
    // Create a new window with the preview content for printing
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const previewElement = scrollRef?.current?.querySelector(".max-w-none");
      if (previewElement) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Markdown Preview</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; }
                h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 10px; }
                h2 { font-size: 1.5em; }
                h3 { font-size: 1.25em; }
                p { margin-bottom: 16px; }
                code { background-color: #f6f8fa; padding: 2px 4px; border-radius: 3px; font-size: 85%; }
                pre { background-color: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; }
                blockquote { border-left: 4px solid #dfe2e5; padding-left: 16px; margin-left: 0; color: #6a737d; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #dfe2e5; padding: 6px 13px; }
                th { background-color: #f6f8fa; font-weight: 600; }
              </style>
            </head>
            <body>
              ${previewElement.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col theme-background min-h-0 shadow-sm">
      {/* Enhanced Preview Header */}
      <div className="theme-surface border-b theme-border px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h2 className="text-sm font-semibold theme-text">Preview</h2>
            <span className="text-xs theme-text-secondary">Live</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyHTML}
              className="p-1 hover:bg-opacity-80 theme-surface rounded transition-colors"
              title="Copy HTML"
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
            <button
              onClick={handlePrint}
              className="p-1 hover:bg-opacity-80 theme-surface rounded transition-colors"
              title="Print"
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Preview Content - Fixed layout */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div
          ref={scrollRef}
          className="flex-1 overflow-auto theme-background min-h-0"
        >
          <div className="p-6">
            <div className="max-w-none text-left">
              {content ? (
                <Markdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[
                    [
                      rehypeKatex,
                      {
                        // Configure KaTeX options for better error handling
                        throwOnError: false, // Don't throw on math errors
                        errorColor: "#cc0000", // Red color for math errors
                        strict: false, // Allow some non-standard LaTeX
                      },
                    ],
                  ]}
                  components={markdownComponents}
                >
                  {content}
                </Markdown>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 theme-surface rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 theme-text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium theme-text mb-2">
                    Start Writing
                  </h3>
                  <p className="theme-text-secondary max-w-sm">
                    Type some Markdown in the editor to see a beautiful live
                    preview here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Always visible */}
        <div className="border-t theme-border theme-surface px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between text-xs theme-text-secondary">
            <div className="flex items-center space-x-4">
              <span>Markdown Live Previewer</span>
              <span>•</span>
              <span>Real-time rendering</span>
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

// Memoize the component to prevent unnecessary re-renders
export const MemoizedPreviewPane = React.memo(PreviewPane);
export { MemoizedPreviewPane as PreviewPane };
