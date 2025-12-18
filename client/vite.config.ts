import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import path, { resolve } from "path";
import wasm from "vite-plugin-wasm";
import { protobufPatch } from "./vite/protobuf.ts";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [preact(), tailwindcss(), wasm(), protobufPatch(),  viteStaticCopy({ targets: [
      {src: resolve(import.meta.dirname, "../server/compute/protos/index.js"), dest: "proto"}
    ]})],
  resolve: {
    alias: {
      'protobufjs/minimal': 'protobufjs/dist/minimal/protobuf.min.js',
      shared: path.resolve(__dirname, "../shared"),
      proto: path.resolve(__dirname, "../server/compute/protos"),
      'proto/': path.resolve(__dirname, "../server/compute/protos/")
    },
  },
  optimizeDeps: {
    include: ['protobufjs']
  }
});
