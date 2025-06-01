import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  isSyncEnabled?: boolean;
  onToggleSync?: () => void;
  onResetEditor?: () => void;
  onNewDocument?: () => void;
  onExportMarkdown?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  isSyncEnabled,
  onToggleSync,
  onResetEditor,
  onNewDocument,
  onExportMarkdown,
}) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
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
                <h1 className="text-xl font-bold text-gray-900">
                  Markdown Live Previewer
                </h1>
                <p className="text-sm text-gray-500">
                  Real-time Markdown editor and preview
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Sync Scroll Toggle */}
              {onToggleSync && (
                <button
                  onClick={onToggleSync}
                  className={`inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSyncEnabled
                      ? "border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100"
                      : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
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
                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
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
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-gray-50">
        {children}
      </main>
    </div>
  );
};
