import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: [
      "@codemirror/commands",
      "@codemirror/language",
      "@codemirror/state",
      "@codemirror/view",
      "@codemirror/lang-markdown",
      "@codemirror/search",
      "@codemirror/theme-one-dark",
      "@lezer/highlight",
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Fix for circular dependency issue - each package gets its own chunk
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
