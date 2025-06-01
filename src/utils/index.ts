// Utility functions for the Markdown Live Previewer

/**
 * Debounce function to limit the rate of function execution
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
}

/**
 * Download a file with the given content and filename
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard with fallback for older browsers
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // Modern clipboard API
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-1000px";
    textArea.style.left = "-1000px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      throw new Error("Failed to copy text to clipboard");
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

/**
 * Show a temporary notification message
 */
export function showNotification(
  message: string,
  type: "success" | "error" | "info" = "info",
  duration: number = 3000
): void {
  const notification = document.createElement("div");
  notification.textContent = message;

  let bgColorClass = "bg-blue-500";
  if (type === "success") bgColorClass = "bg-green-500";
  if (type === "error") bgColorClass = "bg-red-500";

  notification.className = `fixed top-4 right-4 px-4 py-3 rounded-md shadow-lg text-white ${bgColorClass} z-50 transition-all duration-300 ease-in-out transform translate-x-full`;

  document.body.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    notification.style.transform = "translateX(0)";
  });

  // Remove after duration
  setTimeout(() => {
    notification.style.transform = "translateX(150%)"; // Animate out
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300); // Allow time for animation
  }, duration);
}
