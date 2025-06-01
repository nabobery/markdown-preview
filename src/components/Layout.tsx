import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  isSyncEnabled?: boolean;
  onToggleSync?: () => void;
  onResetEditor?: () => void;
  onNewDocument?: () => void;
  onExportMarkdown?: () => void;
  onOpenSettings?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  isSyncEnabled,
  onToggleSync,
  onResetEditor,
  onNewDocument,
  onExportMarkdown,
  onOpenSettings,
}) => {
  return (
    <div className="h-screen flex flex-col theme-surface">
      {/* Enhanced Header */}
      <header className="theme-background border-b theme-border shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold theme-text">
                  Markdown Live Previewer
                </h1>
                <p className="text-sm theme-text-secondary">
                  Real-time Markdown editor and preview
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Settings Button */}
              <button
                onClick={onOpenSettings}
                className="inline-flex items-center px-3 py-2 border theme-border shadow-sm text-sm leading-4 font-medium rounded-md theme-text-secondary theme-background hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                title="Open settings"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              {/* Sync Scroll Toggle */}
              {onToggleSync && (
                <button
                  onClick={onToggleSync}
                  className={`inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSyncEnabled
                      ? "border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100"
                      : "theme-border theme-text-secondary theme-background hover:bg-opacity-80"
                  }`}
                  title={`${
                    isSyncEnabled ? "Disable" : "Enable"
                  } scroll synchronization`}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                  Sync scroll
                  {isSyncEnabled && (
                    <div className="ml-2 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </button>
              )}

              {/* Reset Editor Button */}
              {onResetEditor && (
                <button
                  onClick={onResetEditor}
                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 theme-background hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  title="Clear editor content"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear
                </button>
              )}

              {onExportMarkdown && (
                <button
                  onClick={onExportMarkdown}
                  className="inline-flex items-center px-3 py-2 border theme-border shadow-sm text-sm leading-4 font-medium rounded-md theme-text-secondary theme-background hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Export
                </button>
              )}
              {onNewDocument && (
                <button
                  onClick={onNewDocument}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  New
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Enhanced responsive layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden theme-surface">
        {children}
      </main>
    </div>
  );
};
