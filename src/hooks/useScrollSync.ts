import { useRef, useCallback, useState, useEffect } from "react";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

// Types for scroll sync hook
interface ScrollSyncHook {
  editorScrollExtension: Extension;
  previewRef: React.RefObject<HTMLDivElement | null>;
  isSyncEnabled: boolean;
  toggleSync: () => void;
}

export const useScrollSync = (): ScrollSyncHook => {
  const [isSyncEnabled, setIsSyncEnabled] = useState(true);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null); // To store EditorView instance
  const syncTimeoutRef = useRef<number | null>(null);
  const isScrollingRef = useRef<{ editor: boolean; preview: boolean }>({
    editor: false,
    preview: false,
  });

  const toggleSync = useCallback(() => {
    setIsSyncEnabled((prev) => !prev);
  }, []);

  const getScrollPercentage = (element: HTMLElement): number => {
    const { scrollTop, scrollHeight, clientHeight } = element;
    if (scrollHeight <= clientHeight) return 0;
    return scrollTop / (scrollHeight - clientHeight);
  };

  const setScrollPercentage = (element: HTMLElement, percentage: number) => {
    const { scrollHeight, clientHeight } = element;
    const maxScrollTop = scrollHeight - clientHeight;
    element.scrollTo({
      top: Math.max(0, Math.min(maxScrollTop, maxScrollTop * percentage)),
      behavior: "auto",
    });
  };

  // Sync preview scroll to match editor scroll
  const syncPreviewToEditor = useCallback(() => {
    if (
      !isSyncEnabled ||
      !editorViewRef.current ||
      !previewRef.current ||
      isScrollingRef.current.preview
    )
      return;

    isScrollingRef.current.editor = true;
    const editorScroller = editorViewRef.current.scrollDOM.querySelector(
      ".cm-scroller"
    ) as HTMLElement;
    if (!editorScroller) return;

    const percentage = getScrollPercentage(editorScroller);
    setScrollPercentage(previewRef.current, percentage);

    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = window.setTimeout(() => {
      isScrollingRef.current.editor = false;
    }, 150); // Debounce to prevent scroll fight
  }, [isSyncEnabled]);

  // Sync editor scroll to match preview scroll
  const syncEditorToPreview = useCallback(() => {
    if (
      !isSyncEnabled ||
      !editorViewRef.current ||
      !previewRef.current ||
      isScrollingRef.current.editor
    )
      return;

    isScrollingRef.current.preview = true;
    const editorScroller = editorViewRef.current.scrollDOM.querySelector(
      ".cm-scroller"
    ) as HTMLElement;
    if (!editorScroller) return;

    const percentage = getScrollPercentage(previewRef.current);
    setScrollPercentage(editorScroller, percentage);

    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = window.setTimeout(() => {
      isScrollingRef.current.preview = false;
    }, 150); // Debounce to prevent scroll fight
  }, [isSyncEnabled]);

  // CodeMirror scroll extension
  const editorScrollExtension: Extension = EditorView.updateListener.of(
    (update) => {
      if (update.view) {
        editorViewRef.current = update.view; // Store the EditorView instance
        const scrollerElement =
          update.view.scrollDOM.querySelector(".cm-scroller");
        if (scrollerElement) {
          // Remove any existing listener to avoid duplicates
          scrollerElement.removeEventListener("scroll", syncPreviewToEditor);
          if (isSyncEnabled) {
            scrollerElement.addEventListener("scroll", syncPreviewToEditor, {
              passive: true,
            });
          }
        }
      }
    }
  );

  // Set up preview scroll listener
  useEffect(() => {
    const previewElement = previewRef.current;
    if (previewElement) {
      // Remove any existing listener
      previewElement.removeEventListener("scroll", syncEditorToPreview);
      if (isSyncEnabled) {
        previewElement.addEventListener("scroll", syncEditorToPreview, {
          passive: true,
        });
      }
    }
    // Cleanup on unmount or when isSyncEnabled changes
    return () => {
      if (previewElement) {
        previewElement.removeEventListener("scroll", syncEditorToPreview);
      }
      const editorScroller =
        editorViewRef.current?.scrollDOM.querySelector(".cm-scroller");
      if (editorScroller) {
        editorScroller.removeEventListener("scroll", syncPreviewToEditor);
      }
    };
  }, [isSyncEnabled, syncEditorToPreview, syncPreviewToEditor]);

  useEffect(() => {
    // Clear timeout on unmount
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  return {
    editorScrollExtension,
    previewRef,
    isSyncEnabled,
    toggleSync,
  };
};
