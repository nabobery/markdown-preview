import React, { useState, useCallback } from "react";
import { Layout, EditorPane, PreviewPane } from "./components";
import { DEFAULT_MARKDOWN_CONTENT } from "./utils/constants";
import "./App.css";

function App() {
  const [markdownContent, setMarkdownContent] = useState(
    DEFAULT_MARKDOWN_CONTENT
  );

  // Memoized change handler to prevent unnecessary re-renders
  const handleContentChange = useCallback((content: string) => {
    setMarkdownContent(content);
  }, []);

  return (
    <Layout>
      <EditorPane content={markdownContent} onChange={handleContentChange} />
      <PreviewPane content={markdownContent} />
    </Layout>
  );
}

export default App;
