import React, { useState, useCallback } from "react";
import { Layout, EditorPane, PreviewPane } from "./components";
import { DEFAULT_MARKDOWN_CONTENT } from "./utils/constants";
import { useScrollSync } from "./hooks";
import "./App.css";

function App() {
  const [markdownContent, setMarkdownContent] = useState(
    DEFAULT_MARKDOWN_CONTENT
  );

  // Initialize scroll synchronization
  const { editorScrollExtension, previewRef, isSyncEnabled, toggleSync } =
    useScrollSync();

  // Memoized change handler to prevent unnecessary re-renders
  const handleContentChange = useCallback((content: string) => {
    setMarkdownContent(content);
  }, []);

  return (
    <Layout isSyncEnabled={isSyncEnabled} onToggleSync={toggleSync}>
      <EditorPane
        content={markdownContent}
        onChange={handleContentChange}
        scrollExtension={editorScrollExtension}
      />
      <PreviewPane content={markdownContent} scrollRef={previewRef} />
    </Layout>
  );
}

export default App;
