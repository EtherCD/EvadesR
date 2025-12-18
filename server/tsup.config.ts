import { defineConfig } from "tsup";
import { platformArchTriples } from "@napi-rs/triples";
import fs from "fs";
import path from "path";

// https://github.com/replit/ruspty/blob/main/tsup.config.ts

let triples: string[] = [];
for (const platform in platformArchTriples) {
  for (const arch in platformArchTriples[platform]) {
    for (const triple of platformArchTriples[platform][arch]) {
      triples.push(triple.platformArchABI);
    }
  }
}

triples = triples.filter(v => v !== "altverse-rs.freebsd-arm64.node")
triples.push("freebsd-arm64")
triples.push('darwin-universal');
triples.push('linux-riscv64-musl');

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
    compute: "./compute",
  },
  loader: {
    ".node": "copy",
  },
  external: triples.map((triple) => `./altverse-rs.${triple}.node`),
  onSuccess: async () => {
    const files = fs.readdirSync('./compute/')
    const nodeFiles = files.filter((file) => file.endsWith(".node"));
    for (const file of nodeFiles) {
      const src = path.resolve("./compute", file);
      const dest = path.join('./dist', file);
      fs.copyFileSync(src, dest);
    }
  }
});
