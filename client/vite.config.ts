import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import wasm from "vite-plugin-wasm";

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), tailwindcss(), wasm()],
  resolve: {
    alias: {
      'protobufjs/minimal': 'protobufjs/dist/minimal/protobuf.min.js',
      shared: path.resolve(__dirname, "../shared"),
      proto: path.resolve(__dirname, "../server/compute/protos"),
    },
  },
  optimizeDeps: {
    include: ['protobufjs']
  }
});
