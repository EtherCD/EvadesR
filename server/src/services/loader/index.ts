import fs from "fs";
import path from "path";
import { Env } from "../env";
import { DatabaseSync } from "node:sqlite";
import { World } from "../../core/world";

const pathToWorlds = path.join("./", Env.storagePath, Env.worldsPath);

export class Loader {
	static init() {
		try {
			fs.mkdirSync(pathToWorlds);
		} catch {}
	}

	static loadWorlds() {
		const worldsFiles = fs.readdirSync(pathToWorlds);
		let worlds: Record<string, World> = {};
		for (const i of worldsFiles) {
			const p = path.join(pathToWorlds, i);
			const file = fs.readFileSync(p) + "";
			const object = JSON.parse(file);
			const world = new World(object);
			worlds[world.name] = world;
		}

		return worlds;
	}
}
