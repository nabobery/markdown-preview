import React from "react";
import type { ReactNode } from "react";

/**
 * Generic markdown content processor utility
 * Handles various content transformations and edge cases
 */

export interface ContentProcessorOptions {
  preserveLineBreaks?: boolean;
  handleEmptyContent?: boolean;
  sanitizeHtml?: boolean;
  normalizeWhitespace?: boolean;
}

/**
 * Processes content to handle line breaks properly in all contexts
 * This is a generic solution that works for tables, regular text, and other content
 */
export const processLineBreaks = (
  content: string | ReactNode,
  options: ContentProcessorOptions = {}
): ReactNode => {
  const {
    preserveLineBreaks = true,
    handleEmptyContent = true,
    sanitizeHtml = false,
  } = options;

  // Handle non-string content
  if (typeof content !== "string") {
    return content;
  }

  // Handle empty content
  if (handleEmptyContent && (!content || content.trim() === "")) {
    return "";
  }

  let processedContent = content;

  // Sanitize HTML if requested
  if (sanitizeHtml) {
    processedContent = processedContent.replace(/<[^>]*>/g, "");
  }

  // Handle line breaks preservation
  if (preserveLineBreaks) {
    // Split content by various line break patterns
    const parts = processedContent.split(/(<br\s*\/?>|\n|\r\n|\r)/gi);

    return parts
      .map((part, index) => {
        // Convert various line break formats to actual React line breaks
        if (
          part.match(/^<br\s*\/?>$/gi) ||
          part === "\n" ||
          part === "\r\n" ||
          part === "\r"
        ) {
          return React.createElement("br", { key: `br-${index}` });
        }

        // Return text content as-is if not empty
        if (part.trim()) {
          return part;
        }

        // Handle empty strings
        return null;
      })
      .filter(Boolean); // Remove null values
  }

  return processedContent;
};

/**
 * Generic text normalization for consistent display
 */
export const normalizeText = (
  text: string,
  options: {
    trimWhitespace?: boolean;
    collapseSpaces?: boolean;
    preserveEmojis?: boolean;
  } = {}
): string => {
  const {
    trimWhitespace = true,
    collapseSpaces = false,
    preserveEmojis = true,
  } = options;

  let normalized = text;

  // Trim whitespace if requested
  if (trimWhitespace) {
    normalized = normalized.trim();
  }

  // Collapse multiple spaces if requested
  if (collapseSpaces) {
    normalized = normalized.replace(/\s+/g, " ");
  }

  // Handle emoji preservation
  if (!preserveEmojis) {
    const emojiRegex =
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    normalized = normalized.replace(emojiRegex, "").trim();
  }

  return normalized;
};

/**
 * Generic slug generation that handles all edge cases
 */
export const generateSlug = (
  text: string,
  options: {
    preserveCase?: boolean;
    maxLength?: number;
    fallbackPrefix?: string;
    allowNumbers?: boolean;
    separator?: string;
  } = {}
): string => {
  const {
    preserveCase = false,
    maxLength = 100,
    fallbackPrefix = "heading",
    allowNumbers = true,
    separator = "-",
  } = options;

  // Normalize the text first
  let slug = normalizeText(text, {
    trimWhitespace: true,
    collapseSpaces: true,
    preserveEmojis: false,
  });

  // Handle case
  if (!preserveCase) {
    slug = slug.toLowerCase();
  }

  // Remove special characters but preserve word characters, spaces, and optionally numbers
  const charPattern = allowNumbers ? /[^\w\s]/g : /[^\w\s]|[\d]/g;
  slug = slug.replace(charPattern, "");

  // Replace spaces with separator
  slug = slug.replace(/\s+/g, separator);

  // Remove multiple separators
  slug = slug.replace(new RegExp(`${separator}+`, "g"), separator);

  // Remove leading/trailing separators
  slug = slug.replace(new RegExp(`^${separator}+|${separator}+$`, "g"), "");

  // Limit length
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    // Ensure we don't cut in the middle of a word
    const lastSeparator = slug.lastIndexOf(separator);
    if (lastSeparator > maxLength * 0.7) {
      slug = slug.substring(0, lastSeparator);
    }
  }

  // Generate fallback if slug is empty or too short
  if (!slug || slug.length < 2) {
    slug = `${fallbackPrefix}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)}`;
  }

  return slug;
};

/**
 * Generic text truncation with smart word boundaries
 */
export const truncateText = (
  text: string,
  options: {
    maxLength?: number;
    wordBoundary?: boolean;
    ellipsis?: string;
    preserveEmojis?: boolean;
  } = {}
): string => {
  const {
    maxLength = 50,
    wordBoundary = true,
    ellipsis = "...",
    preserveEmojis = true,
  } = options;

  // Normalize text first
  const normalized = normalizeText(text, {
    trimWhitespace: true,
    collapseSpaces: true,
    preserveEmojis,
  });

  // Return as-is if already short enough
  if (normalized.length <= maxLength) {
    return normalized;
  }

  let truncated = normalized.substring(0, maxLength - ellipsis.length);

  // Handle word boundary truncation
  if (wordBoundary) {
    const lastWordBoundary = Math.max(
      truncated.lastIndexOf(" "),
      truncated.lastIndexOf("-"),
      truncated.lastIndexOf("_")
    );

    // Only truncate at word boundary if it's not too close to the beginning
    if (lastWordBoundary > maxLength * 0.6) {
      truncated = truncated.substring(0, lastWordBoundary);
    }
  }

  return truncated + ellipsis;
};

/**
 * Generic content validator for various markdown elements
 */
export const validateContent = (
  content: unknown,
  type: "string" | "number" | "array" | "object" = "string"
): boolean => {
  switch (type) {
    case "string":
      return typeof content === "string" && content.trim().length > 0;
    case "number":
      return typeof content === "number" && !isNaN(content);
    case "array":
      return Array.isArray(content) && content.length > 0;
    case "object":
      return typeof content === "object" && content !== null;
    default:
      return false;
  }
};

/**
 * Generic debounced function creator for performance optimization
 */
export const createDebouncedFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options: {
    immediate?: boolean;
    maxWait?: number;
  } = {}
): ((...args: Parameters<T>) => void) => {
  const { immediate = false, maxWait } = options;

  let timeoutId: number | null = null;
  let maxTimeoutId: number | null = null;
  let lastCallTime = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    lastCallTime = now;

    const callFunction = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (maxTimeoutId) clearTimeout(maxTimeoutId);
      timeoutId = null;
      maxTimeoutId = null;
      func(...args);
    };

    // Clear existing timeouts
    if (timeoutId) clearTimeout(timeoutId);

    // Handle immediate execution
    if (immediate && timeSinceLastCall > delay) {
      callFunction();
      return;
    }

    // Set up max wait timeout if specified
    if (maxWait && !maxTimeoutId) {
      maxTimeoutId = window.setTimeout(callFunction, maxWait);
    }

    // Set up regular debounce timeout
    timeoutId = window.setTimeout(callFunction, delay);
  };
};
