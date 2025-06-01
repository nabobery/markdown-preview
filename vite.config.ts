import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ["@codemirror/lang-markdown", "@codemirror/theme-one-dark"],
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
