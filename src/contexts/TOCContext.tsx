import React, { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { TOCContextType, TOCHeading } from "../types";
import { createDebouncedFunction } from "../utils/markdownProcessor";

const TOCContext = createContext<TOCContextType | undefined>(undefined);

interface TOCProviderProps {
  children: ReactNode;
}

export const TOCProvider: React.FC<TOCProviderProps> = ({ children }) => {
  const [headings, setHeadings] = useState<TOCHeading[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  // Enhanced scroll-to-element function with comprehensive error handling
  const scrollToElement = useCallback((element: HTMLElement, offset = 80) => {
    try {
      // Find the best container for scrolling with priority order
      const containers = [
        element.closest('[data-testid="preview-content"]'),
        element.closest(".overflow-auto"),
        element.closest('[role="main"]'),
        document.querySelector(".preview-container"),
        document.documentElement,
      ].filter(Boolean) as HTMLElement[];

      const container = containers[0] || document.documentElement;

      if (container === document.documentElement) {
        // Scroll the window
        const elementRect = element.getBoundingClientRect();
        const targetPosition = window.pageYOffset + elementRect.top - offset;

        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: "smooth",
        });
      } else {
        // Scroll within container with enhanced positioning
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scrollTop = container.scrollTop;

        // Calculate optimal scroll position
        const elementTopRelativeToContainer =
          elementRect.top - containerRect.top;
        const targetPosition =
          scrollTop + elementTopRelativeToContainer - offset;

        // Ensure we don't scroll past the bottom of the container
        const maxScrollTop = container.scrollHeight - container.clientHeight;
        const finalPosition = Math.max(
          0,
          Math.min(targetPosition, maxScrollTop)
        );

        container.scrollTo({
          top: finalPosition,
          behavior: "smooth",
        });
      }

      // Visual feedback: briefly highlight the target heading
      const originalStyle = element.style.cssText;
      element.style.transition = "background-color 0.3s ease";
      element.style.backgroundColor = "rgba(59, 130, 246, 0.1)"; // Light blue highlight

      setTimeout(() => {
        element.style.cssText = originalStyle;
      }, 1000);
    } catch (error) {
      console.warn("Advanced scroll failed, using fallback:", error);
      // Fallback to basic scroll
      try {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      } catch (fallbackError) {
        console.error("All scroll methods failed:", fallbackError);
      }
    }
  }, []);

  // Optimized debounced scroll function
  const debouncedScrollToElement = createDebouncedFunction(
    scrollToElement,
    150, // Slightly longer delay for smoother experience
    { immediate: false, maxWait: 500 }
  );

  // Enhanced scroll to heading function with validation and error handling
  const scrollToHeading = useCallback(
    (id: string) => {
      if (!id) {
        console.warn("No heading ID provided for scrolling");
        return;
      }

      // Try multiple methods to find the element
      let element: HTMLElement | null = null;

      // Method 1: Direct ID lookup
      element = document.getElementById(id);

      // Method 2: Search within preview container
      if (!element) {
        const previewContainer = document.querySelector(
          '[data-testid="preview-content"]'
        );
        if (previewContainer) {
          element = previewContainer.querySelector(
            `#${CSS.escape(id)}`
          ) as HTMLElement;
        }
      }

      // Method 3: Search by heading text (fallback)
      if (!element) {
        const heading = headings.find((h) => h.id === id);
        if (heading) {
          const previewContainer = document.querySelector(
            '[data-testid="preview-content"]'
          );
          if (previewContainer) {
            const headingElements = previewContainer.querySelectorAll(
              "h1, h2, h3, h4, h5, h6"
            );
            element = Array.from(headingElements).find((el) => {
              const text = el.textContent?.replace(/^🔗\s*/, "").trim();
              return text === heading.text;
            }) as HTMLElement;
          }
        }
      }

      if (!element) {
        console.warn(
          `Element with ID "${id}" not found. Available headings:`,
          headings.map((h) => ({ id: h.id, text: h.text }))
        );

        // Try to find and scroll to the first available heading as fallback
        if (headings.length > 0) {
          const firstHeading = document.getElementById(headings[0].id);
          if (firstHeading) {
            console.log("Scrolling to first available heading as fallback");
            debouncedScrollToElement(firstHeading);
            setActiveHeading(headings[0].id);
          }
        }
        return;
      }

      // Immediate active heading update for responsive UI feedback
      setActiveHeading(id);

      // Smooth scroll with enhanced error handling
      try {
        debouncedScrollToElement(element);

        // Confirm active heading after scroll completes
        setTimeout(() => {
          setActiveHeading(id);

          // Ensure the element is actually visible after scroll
          const rect = element!.getBoundingClientRect();
          const container = element!.closest('[data-testid="preview-content"]');

          if (container) {
            const containerRect = container.getBoundingClientRect();
            const isVisible =
              rect.top >= containerRect.top && rect.top <= containerRect.bottom;

            if (!isVisible) {
              console.warn("Element may not be fully visible after scroll");
            }
          }
        }, 600); // Wait for scroll animation to complete
      } catch (scrollError) {
        console.error("Failed to scroll to heading:", scrollError);
      }
    },
    [debouncedScrollToElement, headings, setActiveHeading]
  );

  // Enhanced heading validation and update function
  const setHeadingsWithValidation = useCallback(
    (newHeadings: TOCHeading[]) => {
      // Validate and sanitize headings
      const validatedHeadings = newHeadings
        .filter((heading) => {
          const isValid =
            heading.id &&
            heading.text &&
            heading.level >= 1 &&
            heading.level <= 6 &&
            typeof heading.text === "string" &&
            typeof heading.id === "string";

          if (!isValid) {
            console.warn("Invalid heading detected:", heading);
          }

          return isValid;
        })
        .map((heading) => ({
          ...heading,
          // Ensure text is properly cleaned
          text: heading.text.trim(),
          id: heading.id.trim(),
          slug: heading.slug || heading.id,
        }));

      // Check for duplicate IDs and resolve them
      const uniqueHeadings = validatedHeadings.reduce((acc, heading) => {
        const existingIndex = acc.findIndex((h) => h.id === heading.id);
        if (existingIndex >= 0) {
          // Keep the first occurrence, but log the duplicate
          console.warn(
            `Duplicate heading ID found: ${heading.id}. Keeping first occurrence.`
          );
        } else {
          acc.push(heading);
        }
        return acc;
      }, [] as TOCHeading[]);

      setHeadings(uniqueHeadings);

      // Clear active heading if it's no longer valid
      if (
        activeHeading &&
        !uniqueHeadings.find((h) => h.id === activeHeading)
      ) {
        setActiveHeading(null);
      }

      // Debug logging for development
      if (process.env.NODE_ENV === "development") {
        console.log("TOC headings updated:", {
          count: uniqueHeadings.length,
          headings: uniqueHeadings.map((h) => ({
            id: h.id,
            text: h.text,
            level: h.level,
          })),
        });
      }
    },
    [activeHeading]
  );

  const value: TOCContextType = {
    headings,
    setHeadings: setHeadingsWithValidation,
    scrollToHeading,
    activeHeading,
    setActiveHeading,
  };

  return <TOCContext.Provider value={value}>{children}</TOCContext.Provider>;
};

export const useTOC = (): TOCContextType => {
  const context = useContext(TOCContext);
  if (context === undefined) {
    throw new Error("useTOC must be used within a TOCProvider");
  }
  return context;
};
