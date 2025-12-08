import lz4 from "lz4js";

export class Compress {
  static decode(uint8: Uint8Array) {
    return lz4.decompress(uint8);
  }
}
