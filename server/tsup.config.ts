import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  platform: "node",
  target: "node16",
  bundle: true,
  outDir: "dist",
  format: ["cjs"],
  sourcemap: true,
  clean: true,
  alias: {
    "@shared": "./src/shared",
    native: "./native",
  },
  loader: {
    ".node": "copy",
  },
  external: ["*.node"],
});
