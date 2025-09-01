import React, { useState } from "react";
import { useTOC } from "../contexts/TOCContext";
import { truncateText } from "../utils/markdownProcessor";
import type { AppSettings } from "../types";

interface TOCSidebarProps {
  settings: AppSettings;
  className?: string;
}

export const TOCSidebar: React.FC<TOCSidebarProps> = ({
  settings,
  className = "",
}) => {
  const { headings, scrollToHeading, activeHeading } = useTOC();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter headings based on max level setting
  const filteredHeadings = headings.filter(
    (heading) => heading.level <= settings.tocMaxLevel
  );

  if (!settings.showTableOfContents || filteredHeadings.length === 0) {
    return null;
  }

  return (
    <div
      className={`${
        isCollapsed ? "w-12" : "w-64"
      } flex-shrink-0 theme-surface border-r theme-border transition-all duration-300 ease-in-out toc-sidebar ${className}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-opacity-80 theme-surface-secondary rounded transition-colors"
              title={
                isCollapsed
                  ? "Expand Table of Contents"
                  : "Collapse Table of Contents"
              }
            >
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
            {!isCollapsed && (
              <h3 className="text-sm font-semibold theme-text">
                Table of Contents
              </h3>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <nav className="space-y-1">
            {filteredHeadings.map((heading) => {
              const isActive = activeHeading === heading.id;
              const paddingLevel = Math.max(0, heading.level - 1) * 12;

              return (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={`
                    w-full text-left px-2 py-1.5 rounded text-sm transition-colors
                    hover:bg-opacity-80 hover:theme-surface-secondary
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500"
                        : "theme-text-secondary hover:theme-text"
                    }
                  `}
                  style={{ paddingLeft: `${8 + paddingLevel}px` }}
                  title={heading.text}
                >
                  <span className="block toc-heading-text">
                    {truncateText(heading.text, {
                      maxLength: isCollapsed ? 10 : 40,
                      wordBoundary: true,
                      ellipsis: "...",
                      preserveEmojis: true,
                    })}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {isCollapsed && filteredHeadings.length > 0 && (
          <div className="space-y-1">
            {filteredHeadings.slice(0, 5).map((heading) => {
              const isActive = activeHeading === heading.id;

              return (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={`
                    w-full p-1 rounded text-xs transition-colors flex items-center justify-center
                    hover:bg-opacity-80 hover:theme-surface-secondary
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "theme-text-secondary hover:theme-text"
                    }
                  `}
                  title={`${heading.text} (Level ${heading.level})`}
                >
                  <span className="w-2 h-2 rounded-full bg-current opacity-60"></span>
                </button>
              );
            })}
            {filteredHeadings.length > 5 && (
              <div className="text-center">
                <span className="text-xs theme-text-muted">
                  +{filteredHeadings.length - 5}
                </span>
              </div>
            )}
          </div>
        )}

        {filteredHeadings.length === 0 && (
          <div className="text-center py-8">
            <svg
              className="w-8 h-8 mx-auto theme-text-muted mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-xs theme-text-muted">No headings found</p>
          </div>
        )}
      </div>
    </div>
  );
};
