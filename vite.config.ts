import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  resolve: {
    alias: {
      'fs/promises': path.resolve(__dirname, 'src/utils/empty-module.js'),
      'module': path.resolve(__dirname, 'src/utils/empty-module.js'),
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "@babel/plugin-proposal-decorators",
            {
              version: "2023-05",
            },
          ],
        ],
      },
    }),
    tailwindcss(),
  ],
  esbuild: {
    target: "esnext",
  },
  assetsInclude: ["**/*.wasm"],
  optimizeDeps: {
    exclude: ["web-tree-sitter"],
  },
});
