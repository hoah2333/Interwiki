import { resolve } from "node:path";
import { defineConfig } from "vite";

const src = resolve(import.meta.dirname, "src");

export default defineConfig({
  root: src,
  base: "./",
  build: {
    outDir: resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(src, "index.html"),
        interwikiFrame: resolve(src, "interwikiFrame.html"),
        styleFrame: resolve(src, "styleFrame.html"),
      },
    },
  },
});
