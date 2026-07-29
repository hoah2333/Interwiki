import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(root, "index.html"),
        interwikiFrame: resolve(root, "interwikiFrame.html"),
        styleFrame: resolve(root, "styleFrame.html"),
      },
    },
  },
});
