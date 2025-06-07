import { useState, useCallback, useEffect, useMemo } from "react";
import { Layout, EditorPane, PreviewPane, SettingsModal } from "./components";
import { DEFAULT_MARKDOWN_CONTENT, STORAGE_KEYS } from "./utils/constants";
import { useScrollSync, useSettings } from "./hooks";
import { showNotification, downloadFile, debounce } from "./utils";
import "./App.css";

function App() {
  // Initialize settings first
  const { settings, setSettings } = useSettings();

  // Initialize markdown content with auto-save loading
  const [markdownContent, setMarkdownContent] = useState(() => {
    // Load auto-saved content if auto-save is enabled
    if (settings.autoSave && typeof window !== "undefined") {
      try {
        const savedContent = localStorage.getItem(STORAGE_KEYS.EDITOR_CONTENT);
        if (savedContent && savedContent.trim()) {
          return savedContent;
        }
      } catch (error) {
        console.warn("Failed to load auto-saved content:", error);
      }
    }
    return DEFAULT_MARKDOWN_CONTENT;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize scroll synchronization
  const { editorScrollExtension, previewRef, isSyncEnabled, toggleSync } =
    useScrollSync();

  // Auto-save functionality with debouncing
  const debouncedAutoSave = useMemo(
    () =>
      debounce((...args: unknown[]) => {
        const content = args[0] as string;
        if (settings.autoSave && typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEYS.EDITOR_CONTENT, content);
            // Show a subtle notification for auto-save (only if content is substantial)
            if (content.length > 50) {
              showNotification("Auto-saved", "success", 1500);
            }
          } catch (error) {
            console.warn("Failed to auto-save content:", error);
            showNotification("Auto-save failed", "error", 2000);
          }
        }
      }, settings.autoSaveInterval),
    [settings.autoSave, settings.autoSaveInterval]
  );

  // Auto-save effect
  useEffect(() => {
    if (settings.autoSave && markdownContent.trim()) {
      debouncedAutoSave(markdownContent);
    }
  }, [markdownContent, debouncedAutoSave, settings.autoSave]);

  // Effect to load auto-saved content when auto-save setting changes
  useEffect(() => {
    if (settings.autoSave && typeof window !== "undefined") {
      try {
        const savedContent = localStorage.getItem(STORAGE_KEYS.EDITOR_CONTENT);
        if (
          savedContent &&
          savedContent.trim() &&
          savedContent !== markdownContent
        ) {
          // Only load if it's different from current content and not the default
          if (markdownContent === DEFAULT_MARKDOWN_CONTENT) {
            setMarkdownContent(savedContent);
          }
        }
      } catch (error) {
        console.warn("Failed to load auto-saved content:", error);
      }
    }
  }, [settings.autoSave, markdownContent]); // Only run when autoSave setting changes

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
      // Clear auto-saved content as well
      if (settings.autoSave && typeof window !== "undefined") {
        try {
          localStorage.removeItem(STORAGE_KEYS.EDITOR_CONTENT);
        } catch (error) {
          console.warn("Failed to clear auto-saved content:", error);
        }
      }
      showNotification("Editor cleared successfully", "success");
    }
  }, [markdownContent, settings.autoSave]);

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
      // Update auto-saved content as well
      if (settings.autoSave && typeof window !== "undefined") {
        try {
          localStorage.setItem(
            STORAGE_KEYS.EDITOR_CONTENT,
            DEFAULT_MARKDOWN_CONTENT
          );
        } catch (error) {
          console.warn("Failed to auto-save new document:", error);
        }
      }
      showNotification("New document created", "success");
    }
  }, [markdownContent, settings.autoSave]);

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

  // Settings handlers
  const handleOpenSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const handleSettingsChange = useCallback(
    (newSettings: typeof settings) => {
      setSettings(newSettings);
    },
    [setSettings]
  );

  return (
    <>
      <Layout
        isSyncEnabled={isSyncEnabled}
        onToggleSync={toggleSync}
        onResetEditor={handleResetEditor}
        onNewDocument={handleNewDocument}
        onExportMarkdown={handleExportMarkdown}
        onOpenSettings={handleOpenSettings}
      >
        <EditorPane
          content={markdownContent}
          onChange={handleContentChange}
          scrollExtension={editorScrollExtension}
          settings={settings}
        />
        <PreviewPane content={markdownContent} scrollRef={previewRef} />
      </Layout>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </>
  );
}

export default App;
