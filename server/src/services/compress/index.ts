import lz4 from "lz4-napi";

export class Compress {
  static async encode(buffer: Uint8Array) {
    return await lz4.compress(Buffer.from(buffer));
  }

  // static decode(buffer: Uint8Array): Buffer {
  //   const buf = Buffer.from(buffer);
  //   const output = Buffer.alloc(buffer.length * 10);
  //   const size = lz4.decodeBlock(buf, output);
  //   return output.subarray(0, size);
  // }
}
