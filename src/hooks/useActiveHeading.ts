import { useEffect, useCallback, useRef } from "react";
import { useTOC } from "../contexts/TOCContext";

/**
 * Enhanced active heading detection that works with dynamic content
 * and provides robust heading tracking for any markdown content
 */
export const useActiveHeading = () => {
  const { headings, setActiveHeading } = useTOC();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Debounced active heading setter to prevent rapid changes
  const setActiveHeadingDebounced = useCallback(
    (id: string | null) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setActiveHeading(id);
      }, 50); // Small delay to prevent flickering
    },
    [setActiveHeading]
  );

  // Find the heading that should be considered "active"
  const determineActiveHeading = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      // Filter for headings that are actually intersecting and visible
      const visibleHeadings = entries
        .filter((entry) => entry.isIntersecting && entry.intersectionRatio > 0)
        .map((entry) => ({
          element: entry.target as HTMLElement,
          rect: entry.boundingClientRect,
          ratio: entry.intersectionRatio,
        }));

      if (visibleHeadings.length === 0) {
        // No headings visible, find the closest one above the viewport
        const allHeadingElements = document.querySelectorAll(
          '[data-testid="preview-content"] h1[id], [data-testid="preview-content"] h2[id], [data-testid="preview-content"] h3[id], [data-testid="preview-content"] h4[id], [data-testid="preview-content"] h5[id], [data-testid="preview-content"] h6[id]'
        );

        let closestHeading: HTMLElement | null = null;
        let closestDistance = Infinity;

        // Use explicit type for forEach parameter
        Array.from(allHeadingElements).forEach((heading: Element) => {
          const htmlElement = heading as HTMLElement;
          const rect = htmlElement.getBoundingClientRect();
          // Consider headings that are above the viewport (negative top values)
          if (rect.top <= 100) {
            // Allow some margin for headers
            const distance = Math.abs(rect.top);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestHeading = htmlElement;
            }
          }
        });

        if (closestHeading && (closestHeading as HTMLElement).id) {
          setActiveHeadingDebounced((closestHeading as HTMLElement).id);
        } else {
          setActiveHeadingDebounced(null);
        }
        return;
      }

      // Find the heading closest to the top of the viewport
      const topHeading = visibleHeadings
        .filter(({ rect }) => rect.top >= 0) // Only consider headings visible from top
        .sort((a, b) => {
          // First, sort by distance from top
          const aDistance = Math.abs(a.rect.top);
          const bDistance = Math.abs(b.rect.top);

          if (Math.abs(aDistance - bDistance) < 5) {
            // If very close, prefer higher ratio (more visible)
            return b.ratio - a.ratio;
          }

          return aDistance - bDistance;
        })[0];

      if (topHeading?.element.id) {
        setActiveHeadingDebounced(topHeading.element.id);
      } else if (visibleHeadings[0]?.element.id) {
        // Fallback to first visible heading
        setActiveHeadingDebounced(visibleHeadings[0].element.id);
      }
    },
    [setActiveHeadingDebounced]
  );

  // Set up intersection observer for heading detection
  const setupObserver = useCallback(() => {
    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Find the preview container
    const previewContainer = document.querySelector(
      '[data-testid="preview-content"]'
    );
    if (!previewContainer) {
      console.warn("Preview container not found for active heading detection");
      return;
    }

    // Find all heading elements with IDs
    const headingElements = previewContainer.querySelectorAll(
      "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"
    );

    if (headingElements.length === 0) {
      setActiveHeading(null);
      return;
    }

    // Create intersection observer with optimized settings
    observerRef.current = new IntersectionObserver(
      (entries) => {
        determineActiveHeading(entries);
      },
      {
        root: previewContainer,
        // Use margin to detect headings slightly before they enter viewport
        rootMargin: "-80px 0px -60% 0px", // Account for header and focus on top portion
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0], // Multiple thresholds for better detection
      }
    );

    // Observe all heading elements
    headingElements.forEach((element) => {
      observerRef.current?.observe(element);
    });

    // Initial check for active heading
    setTimeout(() => {
      if (observerRef.current) {
        const initialEntries = Array.from(headingElements).map((element) => ({
          target: element,
          isIntersecting: false,
          intersectionRatio: 0,
          boundingClientRect: element.getBoundingClientRect(),
          rootBounds: previewContainer.getBoundingClientRect(),
          intersectionRect: element.getBoundingClientRect(),
          time: Date.now(),
        })) as IntersectionObserverEntry[];

        // Manually check which headings are in view
        const rect = previewContainer.getBoundingClientRect();
        const visibleEntries = initialEntries
          .filter((entry) => {
            const elemRect = entry.boundingClientRect;
            return elemRect.top < rect.bottom && elemRect.bottom > rect.top;
          })
          .map((entry) => ({
            ...entry,
            isIntersecting: true,
            intersectionRatio: 1,
          }));

        if (visibleEntries.length > 0) {
          determineActiveHeading(visibleEntries);
        }
      }
    }, 100);
  }, [determineActiveHeading, setActiveHeading]);

  // Effect to set up observer when headings change
  useEffect(() => {
    if (headings.length === 0) {
      setActiveHeading(null);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    // Set up observer after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      setupObserver();
    }, 200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [headings, setupObserver, setActiveHeading]);

  // Effect to handle scroll events for immediate feedback
  useEffect(() => {
    if (headings.length === 0) return;

    const previewContainer = document.querySelector(
      '[data-testid="preview-content"]'
    );
    if (!previewContainer) return;

    let scrollTimeout: number | null = null;

    const handleScroll = () => {
      // Debounce scroll events
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = window.setTimeout(() => {
        // Trigger a manual check of active headings
        const headingElements = previewContainer.querySelectorAll(
          "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"
        );

        if (headingElements.length === 0) return;

        const containerRect = previewContainer.getBoundingClientRect();
        let closestHeading: HTMLElement | null = null;
        let closestDistance = Infinity;

        // Use explicit type for forEach parameter
        Array.from(headingElements).forEach((element: Element) => {
          const htmlElement = element as HTMLElement;
          const rect = htmlElement.getBoundingClientRect();
          const relativeTop = rect.top - containerRect.top;

          // Find heading closest to the ideal position (slightly below top)
          const idealPosition = 100; // 100px from top
          const distance = Math.abs(relativeTop - idealPosition);

          if (
            relativeTop >= -50 &&
            relativeTop <= containerRect.height &&
            distance < closestDistance
          ) {
            closestDistance = distance;
            closestHeading = htmlElement;
          }
        });

        if (closestHeading && (closestHeading as HTMLElement).id) {
          setActiveHeadingDebounced((closestHeading as HTMLElement).id);
        }
      }, 100);
    };

    previewContainer.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      previewContainer.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [headings, setActiveHeadingDebounced]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};
