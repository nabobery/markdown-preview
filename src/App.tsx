import React, { useState } from "react";
import { Layout, EditorPane, PreviewPane } from "./components";
import { DEFAULT_MARKDOWN_CONTENT } from "./utils/constants";
import "./App.css";

function App() {
  const [markdownContent, setMarkdownContent] = useState(
    DEFAULT_MARKDOWN_CONTENT
  );

  return (
    <Layout>
      <EditorPane content={markdownContent} onChange={setMarkdownContent} />
      <PreviewPane content={markdownContent} />
    </Layout>
  );
}

export default App;
