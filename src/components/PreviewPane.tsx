import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PreviewPaneProps {
  content: string;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ content }) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Preview Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
        <h2 className="text-sm font-medium text-gray-700">Preview</h2>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4 overflow-auto bg-white min-h-0">
        <div className="prose prose-sm lg:prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:text-gray-700 prose-th:text-gray-900 prose-td:text-gray-700">
          {content ? (
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom styling for task lists
                input: ({ node, ...props }) => (
                  <input {...props} className="mr-2 accent-blue-600" disabled />
                ),
                // Custom styling for tables
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto">
                    <table
                      {...props}
                      className="min-w-full border-collapse border border-gray-300"
                    />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th
                    {...props}
                    className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold"
                  />
                ),
                td: ({ node, ...props }) => (
                  <td {...props} className="border border-gray-300 px-4 py-2" />
                ),
              }}
            >
              {content}
            </Markdown>
          ) : (
            <p className="text-gray-500 italic">Preview will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const MemoizedPreviewPane = React.memo(PreviewPane);
export { MemoizedPreviewPane as PreviewPane };
