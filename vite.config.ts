import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ["@codemirror/lang-markdown", "@codemirror/theme-one-dark"],
    include: [
      "@codemirror/state",
      "@codemirror/view",
      "@codemirror/commands",
      "@codemirror/search",
      "@codemirror/lang-markdown",
      "@uiw/react-codemirror",
    ],
  },
  resolve: {
    dedupe: [
      "@codemirror/state",
      "@codemirror/view",
      "@codemirror/commands",
      "@codemirror/search",
      "@codemirror/lang-markdown",
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Ensure CodeMirror packages are bundled together
          if (id.includes("@codemirror")) {
            return "codemirror";
          }
          if (id.includes("@uiw") && id.includes("codemirror")) {
            return "codemirror";
          }
          // Other packages get separate chunks
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
