import { useState, useCallback } from "react";
import { Layout, EditorPane, PreviewPane } from "./components";
import { DEFAULT_MARKDOWN_CONTENT } from "./utils/constants";
import { useScrollSync } from "./hooks";
import { showNotification, downloadFile } from "./utils";
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

  // Reset editor with confirmation
  const handleResetEditor = useCallback(() => {
    if (markdownContent.trim() === "") {
      showNotification("Editor is already empty", "info");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear the editor? This action cannot be undone."
    );

    if (confirmed) {
      setMarkdownContent("");
      showNotification("Editor cleared successfully", "success");
    }
  }, [markdownContent]);

  // Create new document (reset to default content)
  const handleNewDocument = useCallback(() => {
    if (markdownContent === DEFAULT_MARKDOWN_CONTENT) {
      showNotification("Already showing default content", "info");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to create a new document? Current content will be lost."
    );

    if (confirmed) {
      setMarkdownContent(DEFAULT_MARKDOWN_CONTENT);
      showNotification("New document created", "success");
    }
  }, [markdownContent]);

  // Export markdown to file
  const handleExportMarkdown = useCallback(() => {
    if (markdownContent.trim() === "") {
      showNotification("No content to export", "error");
      return;
    }

    try {
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `markdown-document-${timestamp}.md`;
      downloadFile(markdownContent, filename, "text/markdown");
      showNotification("Markdown file downloaded successfully", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showNotification("Failed to export markdown file", "error");
    }
  }, [markdownContent]);

  return (
    <Layout
      isSyncEnabled={isSyncEnabled}
      onToggleSync={toggleSync}
      onResetEditor={handleResetEditor}
      onNewDocument={handleNewDocument}
      onExportMarkdown={handleExportMarkdown}
    >
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
