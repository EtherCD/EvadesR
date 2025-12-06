import { Update } from "../../shared/game/types";
import { RawWorld } from "../../shared/services/types";
import { Player } from "../objects/player";
import { Area } from "./area";

export class World {
	areas: Area[];
	name: string;

	constructor(props: RawWorld) {
		this.areas = props.areas.map((v) => new Area(v));
		this.name = props.name;
	}

	update(props: Update) {
		for (const area in this.areas) this.areas[area].update(props);
	}

	join(player: Player) {
		this.areas[player.area].join(player);
	}

	leave(player: Player) {
		this.areas[player.area].leave(player);
	}

	packArea(area: number) {
		const value = this.areas[area];
		return {
			w: value.w,
			h: value.h,
			area,
			entities: value.getEnemies(),
			world: this.name,
		};
	}
}
