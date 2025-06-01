import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">
          Markdown Live Previewer
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">{children}</main>
    </div>
  );
};
