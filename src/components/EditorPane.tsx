import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";

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
    <div className="flex-1 flex flex-col border-r border-gray-200">
      {/* Editor Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <h2 className="text-sm font-medium text-gray-700">Editor</h2>
      </div>

      {/* CodeMirror Editor */}
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={content}
          onChange={onChange}
          extensions={extensions}
          theme={oneDark}
          height="100%"
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
        />
      </div>
    </div>
  );
};
