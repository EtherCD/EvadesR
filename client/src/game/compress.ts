import { decompress } from "lz4-wasm";

export class Compress {
  static async decode(uint8: Uint8Array) {
    return decompress(uint8);
  }
}
