import { useCallback, useRef, useEffect } from "react";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { createDebouncedFunction } from "../utils/markdownProcessor";

/**
 * Generic enhanced scroll synchronization system
 * Handles all scroll sync scenarios: editor <-> preview, TOC <-> both
 */

export interface ScrollSyncConfig {
  enabled: boolean;
  smoothScroll: boolean;
  syncRatio: number;
  debounceMs: number;
  offsetTop: number;
  offsetBottom: number;
}

export interface ScrollPosition {
  top: number;
  left: number;
  percentage: number;
}

export interface ScrollTarget {
  element: HTMLElement;
  container?: HTMLElement;
  getScrollPosition: () => ScrollPosition;
  setScrollPosition: (position: Partial<ScrollPosition>) => void;
}

export interface EnhancedScrollSyncHook {
  editorScrollExtension: Extension;
  previewRef: React.RefObject<HTMLElement | null>;
  registerScrollTarget: (key: string, target: ScrollTarget) => void;
  unregisterScrollTarget: (key: string) => void;
  syncToTarget: (targetKey: string, position: Partial<ScrollPosition>) => void;
  syncAllTargets: (sourceKey: string, position: ScrollPosition) => void;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
  config: ScrollSyncConfig;
  updateConfig: (newConfig: Partial<ScrollSyncConfig>) => void;
}

const DEFAULT_CONFIG: ScrollSyncConfig = {
  enabled: true,
  smoothScroll: true,
  syncRatio: 1,
  debounceMs: 16, // ~60fps
  offsetTop: 0,
  offsetBottom: 0,
};

export const useEnhancedScrollSync = (
  initialConfig: Partial<ScrollSyncConfig> = {}
): EnhancedScrollSyncHook => {
  const configRef = useRef<ScrollSyncConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  });
  const previewRef = useRef<HTMLElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const scrollTargetsRef = useRef<Map<string, ScrollTarget>>(new Map());
  const syncInProgressRef = useRef<Set<string>>(new Set());

  // Generic scroll position calculator
  const calculateScrollPosition = useCallback(
    (element: HTMLElement): ScrollPosition => {
      const { scrollTop, scrollLeft, scrollHeight, clientHeight } = element;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);
      const percentage = maxScroll > 0 ? scrollTop / maxScroll : 0;

      return {
        top: scrollTop,
        left: scrollLeft,
        percentage: Math.min(1, Math.max(0, percentage)),
      };
    },
    []
  );

  // Generic scroll position setter
  const setScrollPosition = useCallback(
    (
      element: HTMLElement,
      position: Partial<ScrollPosition>,
      smooth = true
    ) => {
      const scrollOptions: ScrollToOptions = {
        behavior:
          smooth && configRef.current.smoothScroll ? "smooth" : "instant",
      };

      if (position.top !== undefined) {
        scrollOptions.top = Math.max(
          0,
          position.top + configRef.current.offsetTop
        );
      }

      if (position.left !== undefined) {
        scrollOptions.left = position.left;
      }

      if (position.percentage !== undefined) {
        const { scrollHeight, clientHeight } = element;
        const maxScroll = Math.max(0, scrollHeight - clientHeight);
        scrollOptions.top = Math.max(
          0,
          position.percentage * maxScroll + configRef.current.offsetTop
        );
      }

      element.scrollTo(scrollOptions);
    },
    []
  );

  // Debounced sync function to prevent excessive updates
  const debouncedSync = useCallback(
    (sourceKey: string, position: ScrollPosition) => {
      if (!configRef.current.enabled) return;

      scrollTargetsRef.current.forEach((target, targetKey) => {
        if (
          targetKey === sourceKey ||
          syncInProgressRef.current.has(targetKey)
        ) {
          return;
        }

        syncInProgressRef.current.add(targetKey);

        try {
          // Apply sync ratio for proportional scrolling
          const adjustedPosition: Partial<ScrollPosition> = {
            ...position,
            percentage: Math.min(
              1,
              Math.max(0, position.percentage * configRef.current.syncRatio)
            ),
          };

          target.setScrollPosition(adjustedPosition);
        } catch (error) {
          console.warn(`Failed to sync scroll to ${targetKey}:`, error);
        } finally {
          // Remove from sync progress after a short delay
          setTimeout(() => {
            syncInProgressRef.current.delete(targetKey);
          }, configRef.current.debounceMs * 2);
        }
      });
    },
    []
  );

  const debouncedSyncFunction = createDebouncedFunction(
    debouncedSync,
    configRef.current.debounceMs,
    { immediate: false, maxWait: configRef.current.debounceMs * 4 }
  );

  // Register scroll target
  const registerScrollTarget = useCallback(
    (key: string, target: ScrollTarget) => {
      scrollTargetsRef.current.set(key, target);

      // Set up scroll listener for this target
      const handleScroll = () => {
        if (!configRef.current.enabled || syncInProgressRef.current.has(key)) {
          return;
        }

        const position = target.getScrollPosition();
        debouncedSyncFunction(key, position);
      };

      const element = target.container || target.element;
      element.addEventListener("scroll", handleScroll, { passive: true });

      // Return cleanup function
      return () => {
        element.removeEventListener("scroll", handleScroll);
        scrollTargetsRef.current.delete(key);
      };
    },
    [debouncedSyncFunction]
  );

  // Unregister scroll target
  const unregisterScrollTarget = useCallback((key: string) => {
    scrollTargetsRef.current.delete(key);
    syncInProgressRef.current.delete(key);
  }, []);

  // Sync to specific target
  const syncToTarget = useCallback(
    (targetKey: string, position: Partial<ScrollPosition>) => {
      const target = scrollTargetsRef.current.get(targetKey);
      if (!target || !configRef.current.enabled) return;

      syncInProgressRef.current.add(targetKey);

      try {
        target.setScrollPosition(position);
      } catch (error) {
        console.warn(`Failed to sync to ${targetKey}:`, error);
      } finally {
        setTimeout(() => {
          syncInProgressRef.current.delete(targetKey);
        }, configRef.current.debounceMs * 2);
      }
    },
    []
  );

  // Sync all targets from a source
  const syncAllTargets = useCallback(
    (sourceKey: string, position: ScrollPosition) => {
      debouncedSyncFunction(sourceKey, position);
    },
    [debouncedSyncFunction]
  );

  // CodeMirror scroll extension
  const editorScrollExtension = useCallback((): Extension => {
    return EditorView.domEventHandlers({
      scroll: (_, view) => {
        if (!configRef.current.enabled) return false;

        editorViewRef.current = view;
        const element = view.scrollDOM;
        const position = calculateScrollPosition(element);

        // Sync with all other targets
        debouncedSyncFunction("editor", position);
        return false;
      },
    });
  }, [calculateScrollPosition, debouncedSyncFunction]);

  // Auto-register preview target when ref is available
  useEffect(() => {
    if (!previewRef.current) return;

    const previewTarget: ScrollTarget = {
      element: previewRef.current,
      getScrollPosition: () => calculateScrollPosition(previewRef.current!),
      setScrollPosition: (position) =>
        setScrollPosition(previewRef.current!, position),
    };

    const cleanup = registerScrollTarget("preview", previewTarget);
    return cleanup;
  }, [calculateScrollPosition, setScrollPosition, registerScrollTarget]);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<ScrollSyncConfig>) => {
    configRef.current = { ...configRef.current, ...newConfig };
  }, []);

  // Enable/disable sync
  const setEnabled = useCallback((enabled: boolean) => {
    configRef.current.enabled = enabled;

    // Clear any ongoing sync operations when disabling
    if (!enabled) {
      syncInProgressRef.current.clear();
    }
  }, []);

  return {
    editorScrollExtension: editorScrollExtension(),
    previewRef,
    registerScrollTarget,
    unregisterScrollTarget,
    syncToTarget,
    syncAllTargets,
    isEnabled: configRef.current.enabled,
    setEnabled,
    config: configRef.current,
    updateConfig,
  };
};
