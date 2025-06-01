import React from "react";

interface EditorPaneProps {
  content: string;
  onChange: (content: string) => void;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  content,
  onChange,
}) => {
  return (
    <div className="flex-1 flex flex-col border-r border-gray-200">
      {/* Editor Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <h2 className="text-sm font-medium text-gray-700">Editor</h2>
      </div>

      {/* Editor Content - Placeholder for now, will be replaced with CodeMirror */}
      <div className="flex-1 p-4">
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full resize-none border border-gray-300 rounded-md p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Start typing your Markdown here..."
        />
      </div>
    </div>
  );
};
