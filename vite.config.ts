import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "src/index.html"),
        interwikiFrame: resolve(import.meta.dirname, "src/interwikiFrame.html"),
        styleFrame: resolve(import.meta.dirname, "src/styleFrame.html"),
      },
    },
  },
});
