import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PreviewPaneProps {
  content: string;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ content, scrollRef }) => {
  return (
    <div className="flex-1 flex flex-col bg-white min-h-0 shadow-sm">
      {/* Enhanced Preview Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h2 className="text-sm font-semibold text-gray-700">Preview</h2>
            <span className="text-xs text-gray-500">Live</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Copy HTML"
            >
              <svg
                className="w-4 h-4 text-gray-500"
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
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Print"
            >
              <svg
                className="w-4 h-4 text-gray-500"
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
        <div ref={scrollRef} className="flex-1 overflow-auto bg-white min-h-0">
          <div className="p-6">
            <div className="max-w-none text-left">
              {content ? (
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Enhanced task lists
                    input: ({ node, ...props }) => (
                      <input
                        {...props}
                        className="mr-3 w-4 h-4 accent-blue-600 rounded"
                        disabled
                      />
                    ),
                    // Enhanced tables
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-6 rounded-lg border border-gray-200 shadow-sm">
                        <table
                          {...props}
                          className="min-w-full divide-y divide-gray-200"
                        />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        {...props}
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200"
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        {...props}
                        className="px-6 py-4 text-sm text-gray-700 border-b border-gray-100"
                      />
                    ),
                    // Enhanced code blocks
                    pre: ({ node, ...props }) => (
                      <pre
                        {...props}
                        className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto shadow-lg border border-gray-700 my-4"
                      />
                    ),
                    code: ({ node, inline, ...props }: any) =>
                      inline ? (
                        <code
                          {...props}
                          className="text-pink-600 bg-pink-50 px-2 py-1 rounded-md text-sm font-mono"
                        />
                      ) : (
                        <code {...props} />
                      ),
                    // Enhanced headings with proper left alignment
                    h1: ({ node, ...props }) => (
                      <h1
                        {...props}
                        className="text-3xl font-bold text-gray-900 mb-4 mt-6 pb-2 border-b border-gray-200 text-left"
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        {...props}
                        className="text-2xl font-bold text-gray-900 mb-3 mt-5 text-left"
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        {...props}
                        className="text-xl font-semibold text-gray-900 mb-2 mt-4 text-left"
                      />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4
                        {...props}
                        className="text-lg font-semibold text-gray-900 mb-2 mt-3 text-left"
                      />
                    ),
                    h5: ({ node, ...props }) => (
                      <h5
                        {...props}
                        className="text-base font-semibold text-gray-900 mb-2 mt-3 text-left"
                      />
                    ),
                    h6: ({ node, ...props }) => (
                      <h6
                        {...props}
                        className="text-sm font-semibold text-gray-900 mb-2 mt-3 text-left"
                      />
                    ),
                    // Enhanced paragraphs
                    p: ({ node, ...props }) => (
                      <p
                        {...props}
                        className="text-gray-700 leading-relaxed mb-4 text-left"
                      />
                    ),
                    // Enhanced lists
                    ul: ({ node, ...props }) => (
                      <ul
                        {...props}
                        className="list-disc list-inside text-gray-700 mb-4 space-y-1 text-left"
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        {...props}
                        className="list-decimal list-inside text-gray-700 mb-4 space-y-1 text-left"
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li {...props} className="text-gray-700 text-left" />
                    ),
                    // Enhanced blockquotes
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        {...props}
                        className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 my-4 text-gray-700 font-medium italic text-left"
                      />
                    ),
                    // Enhanced links
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-blue-600 hover:underline text-left"
                      />
                    ),
                    // Enhanced strong text
                    strong: ({ node, ...props }) => (
                      <strong
                        {...props}
                        className="font-semibold text-gray-900"
                      />
                    ),
                    // Enhanced emphasis
                    em: ({ node, ...props }) => (
                      <em {...props} className="italic text-gray-700" />
                    ),
                  }}
                >
                  {content}
                </Markdown>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Start Writing
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    Type some Markdown in the editor to see a beautiful live
                    preview here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Always visible */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between text-xs text-gray-500">
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
