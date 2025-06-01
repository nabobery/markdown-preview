import React from "react";

interface PreviewPaneProps {
  content: string;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({ content }) => {
  // For now, just display the raw content. Will be replaced with proper Markdown rendering
  const renderMarkdown = (markdown: string) => {
    // Simple placeholder rendering - will be replaced with proper markdown parser
    return markdown.split("\n").map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-3xl font-bold mb-4">
            {line.slice(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-semibold mb-3">
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-xl font-medium mb-2">
            {line.slice(4)}
          </h3>
        );
      }
      if (line.trim() === "") {
        return <br key={index} />;
      }
      return (
        <p key={index} className="mb-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Preview Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <h2 className="text-sm font-medium text-gray-700">Preview</h2>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4 overflow-auto bg-white">
        <div className="prose prose-sm max-w-none">
          {content ? (
            renderMarkdown(content)
          ) : (
            <p className="text-gray-500 italic">Preview will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
};
