import { useRef, useCallback, useEffect, useState } from "react";
import * as events from "@uiw/codemirror-extensions-events";
import type { Extension } from "@codemirror/state";

interface ScrollSyncHook {
  editorScrollExtension: Extension;
  previewRef: React.RefObject<HTMLDivElement>;
  isSyncEnabled: boolean;
  toggleSync: () => void;
}

export const useScrollSync = (): ScrollSyncHook => {
  const previewRef = useRef<HTMLDivElement>(null);
  const editorScrollRef = useRef<HTMLElement | null>(null);
  const [isSyncEnabled, setIsSyncEnabled] = useState(true);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef<{ editor: boolean; preview: boolean }>({
    editor: false,
    preview: false,
  });

  const toggleSync = useCallback(() => {
    setIsSyncEnabled((prev) => !prev);
  }, []);

  // Sync preview scroll to match editor scroll
  const syncPreviewToEditor = useCallback(
    (scrollTop: number, scrollHeight: number, clientHeight: number) => {
      if (
        !previewRef.current ||
        !isSyncEnabled ||
        isScrollingRef.current.preview
      )
        return;

      isScrollingRef.current.editor = true;

      // Calculate scroll percentage
      const maxScroll = Math.max(0, scrollHeight - clientHeight);
      const scrollPercentage =
        maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;

      // Apply to preview with smooth scrolling
      const previewMaxScroll = Math.max(
        0,
        previewRef.current.scrollHeight - previewRef.current.clientHeight
      );
      const previewScrollTop = previewMaxScroll * scrollPercentage;

      previewRef.current.scrollTo({
        top: previewScrollTop,
        behavior: "auto", // Use auto for immediate sync
      });

      // Clear any existing timeout
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      // Reset flag after a short delay
      syncTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current.editor = false;
      }, 150);
    },
    [isSyncEnabled]
  );

  // Sync editor scroll to match preview scroll
  const syncEditorToPreview = useCallback(
    (scrollTop: number, scrollHeight: number, clientHeight: number) => {
      if (
        !editorScrollRef.current ||
        !isSyncEnabled ||
        isScrollingRef.current.editor
      )
        return;

      isScrollingRef.current.preview = true;

      // Calculate scroll percentage
      const maxScroll = Math.max(0, scrollHeight - clientHeight);
      const scrollPercentage =
        maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;

      // Apply to editor
      const editorMaxScroll = Math.max(
        0,
        editorScrollRef.current.scrollHeight -
          editorScrollRef.current.clientHeight
      );
      const editorScrollTop = editorMaxScroll * scrollPercentage;

      editorScrollRef.current.scrollTo({
        top: editorScrollTop,
        behavior: "auto",
      });

      // Clear any existing timeout
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      // Reset flag after a short delay
      syncTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current.preview = false;
      }, 150);
    },
    [isSyncEnabled]
  );

  // Create CodeMirror scroll extension
  const editorScrollExtension = events.scroll({
    scroll: (event) => {
      const target = event.target as HTMLElement;

      // Find the scrollable container (usually .cm-scroller)
      const scrollContainer = target.closest(".cm-scroller") as HTMLElement;
      if (scrollContainer) {
        editorScrollRef.current = scrollContainer;
        syncPreviewToEditor(
          scrollContainer.scrollTop,
          scrollContainer.scrollHeight,
          scrollContainer.clientHeight
        );
      }
    },
  });

  // Set up preview scroll listener
  useEffect(() => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    const handlePreviewScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      syncEditorToPreview(
        target.scrollTop,
        target.scrollHeight,
        target.clientHeight
      );
    };

    previewElement.addEventListener("scroll", handlePreviewScroll, {
      passive: true,
    });

    return () => {
      previewElement.removeEventListener("scroll", handlePreviewScroll);
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [syncEditorToPreview]);

  return {
    editorScrollExtension,
    previewRef,
    isSyncEnabled,
    toggleSync,
  };
};
