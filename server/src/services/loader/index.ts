import fs from "fs";
import path from "path";
import { Env } from "../env";
import { DatabaseSync } from "node:sqlite";
import { World } from "../../core/world";
import { RawWorld } from "server/src/shared/services/types";
import { ClientArea, ClientWorld } from "@shared/types";

const pathToWorlds = path.join("./", Env.storagePath, Env.worldsPath);

export class Loader {
  static init() {
    try {
      fs.mkdirSync(pathToWorlds);
    } catch {}
  }

  static worldsProps: Record<string, ClientWorld> = {};

  static loadWorlds() {
    const worldsFiles = fs.readdirSync(pathToWorlds);
    let worlds: Record<string, World> = {};
    for (const i of worldsFiles) {
      const p = path.join(pathToWorlds, i);
      const file = fs.readFileSync(p) + "";
      const object = JSON.parse(file) as RawWorld;
      Loader.worldsProps[object.name] = {
        client: object.client,
        areas: {},
      };
      for (const i in object.areas) {
        const ar = object.areas[i];
        if (ar.text || ar.win) {
          Loader.worldsProps[object.name].areas[i] = {
            win: ar.win,
            vp: ar.vp,
            text: ar.text,
          };
        }
      }
      const world = new World(object);
      worlds[world.name] = world;
    }

    return worlds;
  }
}
