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
        <div className="prose prose-sm lg:prose max-w-none">
          {content ? (
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
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
