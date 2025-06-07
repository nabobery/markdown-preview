import React, { useEffect, useRef, useState, useCallback } from "react";
import mermaid from "mermaid";
import { useTheme } from "../hooks/useTheme";

interface MermaidDiagramProps {
  code: string;
  id: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { themeConfig } = useTheme();

  // Function to fix SVG rendering issues
  const fixSvgRendering = useCallback((svgElement: SVGSVGElement) => {
    // Ensure proper responsive behavior
    svgElement.style.maxWidth = "100%";
    svgElement.style.height = "auto";
    svgElement.style.width = "100%";

    // Fix viewBox issues - ensure it's properly set
    const bbox = svgElement.getBBox();
    if (bbox.width > 0 && bbox.height > 0) {
      // Add some padding to prevent clipping
      const padding = 10;
      const viewBoxX = bbox.x - padding;
      const viewBoxY = bbox.y - padding;
      const viewBoxWidth = bbox.width + 2 * padding;
      const viewBoxHeight = bbox.height + 2 * padding;

      svgElement.setAttribute(
        "viewBox",
        `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`
      );
    }

    // Ensure preserveAspectRatio is set for proper scaling
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // Fix overflow issues
    svgElement.style.overflow = "visible";

    // Ensure proper display
    svgElement.style.display = "block";
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !code) {
        setIsLoading(false);
        if (containerRef.current) containerRef.current.innerHTML = "";
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Enhanced Mermaid configuration to prevent clipping
        mermaid.initialize({
          startOnLoad: false,
          theme: themeConfig.type === "dark" ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          logLevel: "error",
          // Enhanced responsive settings
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: "basis",
            padding: 20, // Add padding to prevent clipping
          },
          sequence: {
            useMaxWidth: true,
            wrap: true,
            width: 150,
            height: 65,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
          },
          gantt: {
            useMaxWidth: true,
            leftPadding: 75,
            gridLineStartPadding: 35,
            fontSize: 11,
            sectionFontSize: 24,
            numberSectionStyles: 4,
          },
          journey: {
            useMaxWidth: true,
            diagramMarginX: 50,
            diagramMarginY: 10,
            leftMargin: 150,
            width: 150,
            height: 50,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
          },
          timeline: {
            useMaxWidth: true,
            diagramMarginX: 50,
            diagramMarginY: 10,
            leftMargin: 150,
            width: 150,
            height: 50,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
          },
          class: {
            useMaxWidth: true,
          },
          state: {
            useMaxWidth: true,
          },
          er: {
            useMaxWidth: true,
          },
          pie: {
            useMaxWidth: true,
          },
        });

        // Generate unique ID for this diagram
        const diagramRenderId = `mermaid-${id}-${Date.now()}`;

        // Validate and render the diagram
        const { svg } = await mermaid.render(diagramRenderId, code);

        if (containerRef.current) {
          containerRef.current.innerHTML = svg;

          // Apply comprehensive SVG fixes
          const svgElement = containerRef.current.querySelector(
            "svg"
          ) as SVGSVGElement;
          if (svgElement) {
            // Wait for the SVG to be fully rendered before applying fixes
            setTimeout(() => {
              fixSvgRendering(svgElement);
            }, 100);
          }
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to render diagram"
        );
      } finally {
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [code, id, themeConfig.type, fixSvgRendering]);

  const handleExportSVG = () => {
    const svgElement = containerRef.current?.querySelector("svg");
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mermaid-diagram-${id}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (error) {
    return (
      <div className="theme-surface-secondary border theme-border rounded-lg p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-red-600">
            Mermaid Diagram Error
          </h4>
        </div>
        <p className="text-sm theme-text-muted mb-3">{error}</p>
        <pre className="text-xs theme-text-secondary overflow-x-auto p-3 theme-surface rounded border theme-border">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div className="mermaid-container theme-surface-secondary border theme-border rounded-lg my-4">
      {/* Diagram Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b theme-border theme-surface">
        <div className="flex items-center space-x-2">
          <svg
            className="w-4 h-4 theme-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="text-sm font-medium theme-text">
            Mermaid Diagram
          </span>
          {isLoading && (
            <span className="text-xs theme-text-muted">Rendering...</span>
          )}
        </div>
        <button
          onClick={handleExportSVG}
          disabled={isLoading || !!error}
          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded theme-text-secondary theme-surface-secondary hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border theme-border"
          title="Export as SVG"
        >
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export SVG
        </button>
      </div>

      {/* Diagram Content */}
      <div className="p-4" style={{ overflow: "visible" }}>
        {isLoading && !error && (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        <div
          ref={containerRef}
          className={`mermaid-diagram-render-area ${
            isLoading || error ? "hidden" : ""
          }`}
          style={{
            minHeight: isLoading || error ? "0" : "100px",
            overflow: "visible",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        />
        {!isLoading && !error && !code && (
          <div className="text-center theme-text-muted p-4">
            No diagram code provided.
          </div>
        )}
      </div>
    </div>
  );
};
