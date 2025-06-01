import { useRef, useCallback, useEffect, useState } from "react";
import * as events from "@uiw/codemirror-extensions-events";
import type { Extension } from "@codemirror/state";

interface ScrollSyncHook {
  editorScrollExtension: Extension;
  previewRef: React.RefObject<HTMLDivElement | null>;
  isSyncEnabled: boolean;
  toggleSync: () => void;
}

export const useScrollSync = (): ScrollSyncHook => {
  const previewRef = useRef<HTMLDivElement>(null);
  const editorScrollRef = useRef<HTMLElement | null>(null);
  const [isSyncEnabled, setIsSyncEnabled] = useState(true);
  const syncAnimationFrameRef = useRef<number | null>(null);
  const isScrollingRef = useRef<{ editor: boolean; preview: boolean }>({
    editor: false,
    preview: false,
  });

  const toggleSync = useCallback(() => {
    setIsSyncEnabled((prev) => !prev);
  }, []);

  // Generic scroll synchronization function
  const syncScroll = useCallback(
    (
      sourceRef: React.RefObject<HTMLElement | null>,
      targetRef: React.RefObject<HTMLElement | null>,
      isSourceScrolling: boolean,
      setSourceScrolling: (value: boolean) => void,
      scrollTop: number,
      scrollHeight: number,
      clientHeight: number
    ) => {
      if (
        !sourceRef.current ||
        !targetRef.current ||
        !isSyncEnabled ||
        isSourceScrolling
      )
        return;

      setSourceScrolling(true);

      // Calculate scroll percentage
      const maxScroll = Math.max(0, scrollHeight - clientHeight);
      const scrollPercentage =
        maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;

      // Apply to target with immediate scrolling
      const targetMaxScroll = Math.max(
        0,
        targetRef.current.scrollHeight - targetRef.current.clientHeight
      );
      const targetScrollTop = targetMaxScroll * scrollPercentage;

      targetRef.current.scrollTo({
        top: targetScrollTop,
        behavior: "auto",
      });

      // Clear any existing animation frame
      if (syncAnimationFrameRef.current) {
        cancelAnimationFrame(syncAnimationFrameRef.current);
      }

      // Reset flag using requestAnimationFrame for better performance
      syncAnimationFrameRef.current = requestAnimationFrame(() => {
        setSourceScrolling(false);
      });
    },
    [isSyncEnabled]
  );

  // Sync preview scroll to match editor scroll
  const syncPreviewToEditor = useCallback(
    (scrollTop: number, scrollHeight: number, clientHeight: number) => {
      syncScroll(
        editorScrollRef,
        previewRef,
        isScrollingRef.current.preview,
        (value) => (isScrollingRef.current.editor = value),
        scrollTop,
        scrollHeight,
        clientHeight
      );
    },
    [syncScroll]
  );

  // Sync editor scroll to match preview scroll
  const syncEditorToPreview = useCallback(
    (scrollTop: number, scrollHeight: number, clientHeight: number) => {
      syncScroll(
        previewRef,
        editorScrollRef,
        isScrollingRef.current.editor,
        (value) => (isScrollingRef.current.preview = value),
        scrollTop,
        scrollHeight,
        clientHeight
      );
    },
    [syncScroll]
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
      if (syncAnimationFrameRef.current) {
        cancelAnimationFrame(syncAnimationFrameRef.current);
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
