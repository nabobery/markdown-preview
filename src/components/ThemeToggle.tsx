import { useTheme } from "../hooks/useTheme";

// Theme toggle component
export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const handleThemeChange = () => {
    // Cycle through themes: light -> dark -> system -> light
    switch (theme) {
      case "light":
        setTheme("dark");
        break;
      case "dark":
        setTheme("system");
        break;
      case "system":
        setTheme("light");
        break;
      default:
        setTheme("light");
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.773-7.364L9.364 6.364M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
        );
      case "dark":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        );
      case "system":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        return "Theme";
    }
  };

  const getTooltipText = () => {
    switch (theme) {
      case "light":
        return "Switch to dark theme";
      case "dark":
        return "Switch to system theme";
      case "system":
        return "Switch to light theme";
      default:
        return "Change theme";
    }
  };

  return (
    <button
      onClick={handleThemeChange}
      title={getTooltipText()}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200
        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
        ${
          resolvedTheme === "dark"
            ? "bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 focus:ring-blue-400"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-blue-500"
        }
      `}
      aria-label={`Current theme: ${getThemeLabel()}. Click to ${getTooltipText().toLowerCase()}`}
    >
      <span className="flex-shrink-0">{getThemeIcon()}</span>
      <span className="text-sm font-medium">{getThemeLabel()}</span>

      {/* Active indicator */}
      <div
        className={`
        w-2 h-2 rounded-full transition-colors duration-200
        ${resolvedTheme === "dark" ? "bg-blue-400" : "bg-blue-500"}
      `}
      />
    </button>
  );
}

// Simple theme toggle button (icon only)
export function SimpleThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  const getIcon = () => {
    return resolvedTheme === "dark" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.773-7.364L9.364 6.364M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
        />
      </svg>
    );
  };

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
      className={`
        p-2 rounded-lg border transition-all duration-200 hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${
          resolvedTheme === "dark"
            ? "bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 focus:ring-blue-400"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-blue-500"
        }
      `}
      aria-label={`Switch to ${
        resolvedTheme === "dark" ? "light" : "dark"
      } theme`}
    >
      {getIcon()}
    </button>
  );
}
