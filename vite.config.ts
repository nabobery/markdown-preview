import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            if (
              id.includes("@uiw/react-codemirror") ||
              id.includes("@codemirror")
            ) {
              return "codemirror-vendor";
            }
            if (id.includes("react-markdown") || id.includes("remark-gfm")) {
              return "markdown-vendor";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
