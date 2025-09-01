import { useCallback } from "react";
import { useTOC } from "../contexts/TOCContext";

export const useTOCScrollSync = (
  editorRef: React.RefObject<any>,
  previewRef: React.RefObject<HTMLElement>
) => {
  const { scrollToHeading: originalScrollToHeading } = useTOC();

  const scrollToHeadingWithSync = useCallback(
    (headingId: string) => {
      const previewElement = document.getElementById(headingId);
      const previewContainer = previewRef.current;

      if (!previewElement || !previewContainer) {
        // Fallback to original implementation
        originalScrollToHeading(headingId);
        return;
      }

      // Calculate the position in the preview pane
      const previewContainerRect = previewContainer.getBoundingClientRect();
      const elementRect = previewElement.getBoundingClientRect();
      const scrollTop = previewContainer.scrollTop;
      const targetPosition =
        scrollTop + (elementRect.top - previewContainerRect.top) - 80;

      // Smooth scroll the preview container
      previewContainer.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth",
      });

      // Try to sync with editor if CodeMirror editor is available
      if (editorRef.current && editorRef.current.view) {
        try {
          // Find the corresponding line in the editor
          // This is a simplified approach - in a real implementation,
          // you'd want to maintain a mapping between headings and line numbers
          const editorContent = editorRef.current.view.state.doc.toString();
          const headingText = previewElement.textContent?.trim() || "";

          // Find the line that contains this heading
          const lines = editorContent.split("\n");
          let targetLine = -1;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            // Check if this line is a heading and contains the text
            if (
              line.match(/^#{1,6}\s+/) &&
              line.includes(headingText.replace(/[^\w\s]/g, ""))
            ) {
              targetLine = i;
              break;
            }
          }

          if (targetLine >= 0) {
            // Scroll editor to the target line
            const pos = editorRef.current.view.state.doc.line(
              targetLine + 1
            ).from;
            editorRef.current.view.dispatch({
              selection: { anchor: pos, head: pos },
              effects: [
                // Scroll the line into view
                editorRef.current.view.state
                  .facet(editorRef.current.view.state.config)
                  .find((facet: any) => facet.name === "scrollIntoView") ||
                  null,
              ].filter(Boolean),
            });

            // Ensure the line is centered in the view
            editorRef.current.view.requestMeasure({
              read: () => {
                const coords = editorRef.current.view.coordsAtPos(pos);
                return coords;
              },
              write: (coords: any) => {
                if (coords) {
                  editorRef.current.view.scrollDOM.scrollTop =
                    coords.top -
                    editorRef.current.view.scrollDOM.clientHeight / 2;
                }
              },
            });
          }
        } catch (error) {
          console.log("Could not sync with editor:", error);
        }
      }
    },
    [originalScrollToHeading, editorRef, previewRef]
  );

  return {
    scrollToHeadingWithSync,
  };
};
