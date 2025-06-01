import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";

interface EditorPaneProps {
  content: string;
  onChange: (content: string) => void;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  content,
  onChange,
}) => {
  const extensions = [markdown()];

  return (
    <div className="flex-1 flex flex-col bg-white border-b border-gray-200 lg:border-b-0 lg:border-r lg:border-gray-300 min-h-0 shadow-sm">
      {/* Enhanced Editor Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h2 className="text-sm font-semibold text-gray-700">Editor</h2>
            <span className="text-xs text-gray-500">Markdown</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-500">
              {content.length} characters
            </div>
            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced CodeMirror Editor */}
      <div className="flex-1 overflow-hidden min-h-0 relative flex flex-col">
        <div className="flex-1 p-6">
          <CodeMirror
            value={content}
            onChange={onChange}
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
              highlightActiveLine: true,
              highlightSelectionMatches: true,
            }}
            placeholder="Start typing your Markdown here..."
            className="text-left"
          />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Markdown Editor</span>
              <span>•</span>
              <span>Syntax highlighting</span>
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
