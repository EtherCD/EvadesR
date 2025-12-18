import { uncompress } from "snappyjs";

export class Compress {
  static  decode(uint8: Uint8Array) {
    return uncompress(uint8);
  }
}
