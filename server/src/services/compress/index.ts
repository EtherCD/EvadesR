import lz4 from "lz4";

export class Compress {
  static encode(buffer: Uint8Array) {
    let input = Buffer.from(buffer);
    return lz4.encode(input);
  }

  // static decode(buffer: Uint8Array): Buffer {
  //   const buf = Buffer.from(buffer);
  //   const output = Buffer.alloc(buffer.length * 10);
  //   const size = lz4.decodeBlock(buf, output);
  //   return output.subarray(0, size);
  // }
}
