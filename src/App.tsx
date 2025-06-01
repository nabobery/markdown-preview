import { useState, useCallback } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Layout, EditorPane, PreviewPane } from "./components";
import { DEFAULT_MARKDOWN_CONTENT } from "./utils/constants";
import { useScrollSync } from "./hooks/useScrollSync";
import { showNotification, downloadFile } from "./utils";
import "./App.css";

function AppContent() {
  const [markdownContent, setMarkdownContent] = useState<string>(
    DEFAULT_MARKDOWN_CONTENT
  );

  // Scroll synchronization
  const { editorScrollExtension, previewRef, isSyncEnabled, toggleSync } =
    useScrollSync();

  // Memoized change handler for performance
  const handleContentChange = useCallback((newContent: string) => {
    setMarkdownContent(newContent);
  }, []);

  // Export functionality
  const handleExportMarkdown = useCallback(() => {
    if (!markdownContent.trim()) {
      showNotification("No content to export", "error");
      return;
    }

    try {
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19);
      const filename = `markdown-document-${timestamp}.md`;
      downloadFile(markdownContent, filename, "text/markdown");
      showNotification("Markdown exported successfully!", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showNotification("Failed to export markdown", "error");
    }
  }, [markdownContent]);

  // Reset functionality
  const handleResetEditor = useCallback(() => {
    if (
      markdownContent.trim() &&
      markdownContent !== DEFAULT_MARKDOWN_CONTENT
    ) {
      if (confirm("This will clear all your current content. Are you sure?")) {
        setMarkdownContent("");
        showNotification("Editor cleared successfully", "success");
      }
    } else {
      setMarkdownContent("");
    }
  }, [markdownContent]);

  // New document functionality
  const handleNewDocument = useCallback(() => {
    if (
      markdownContent.trim() &&
      markdownContent !== DEFAULT_MARKDOWN_CONTENT
    ) {
      if (
        confirm(
          "This will replace your current content with a new document. Are you sure?"
        )
      ) {
        setMarkdownContent(DEFAULT_MARKDOWN_CONTENT);
        showNotification("New document created", "success");
      }
    } else {
      setMarkdownContent(DEFAULT_MARKDOWN_CONTENT);
    }
  }, [markdownContent]);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
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
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="markdown-editor-theme">
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
