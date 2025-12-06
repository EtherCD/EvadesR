import { Normal } from "../../assets/entity/normal";
import { tile } from "../../shared/config";
import { diff } from "../../shared/diff";
import { PackedEntity, Update } from "../../shared/game/types";
import { RawArea, RawEntity } from "../../shared/services/types";
import { Entity } from "../objects/entity";
import { Player } from "../objects/player";

export class Area {
	entities: Record<number, Entity> = {};
	oldEntitiesPacks: Record<number, PackedEntity> = {};
	rawEntities: RawEntity[] = [];
	nextId = 0;
	w: number;
	h: number;
	players: number[] = [];

	constructor(props: RawArea) {
		this.w = props.w * tile;
		this.h = props.h * tile;
		this.rawEntities = props.enemies;
	}

	join(player: Player) {
		if (this.players.length === 0) {
			this.init();
		}
		this.players.push(player.id);
	}

	leave(player: Player) {
		delete this.players[player.id];
		if (this.players.length === 0) this.deInit();
	}

	init() {
		if (!this.rawEntities) return;
		this.nextId = 0;
		for (let i = 0; i < this.rawEntities.length; i++) {
			for (let l = 0; l < this.rawEntities[i].count; l++) {
				const val = this.rawEntities[i];
				this.entities[this.nextId++] = new Normal({
					...val,
					area: this,
					name: "normal",
					type: 0,
				});
			}
		}

		this.oldEntitiesPacks = Object.assign({}, this.getEnemies());
	}

	private deInit() {
		this.entities = [];
	}

	update(update: Update) {
		for (const e in this.entities) {
			this.entities[e].update(update);
		}
	}

	getDiffEnemies(): Record<number, Partial<PackedEntity>> {
		let res: Record<number, Partial<PackedEntity>> = {};

		this.oldEntitiesPacks = {};
		for (const i in this.entities) {
			const newPack = this.entities[i].pack();
			const oldPack = this.oldEntitiesPacks[i];
			this.oldEntitiesPacks[i] = newPack;
			const dif = diff(newPack, oldPack);
			if (dif[1]) res[i] = dif[0];
		}

		return res;
	}

	getEnemies(): Record<number, PackedEntity> {
		let res: Record<number, PackedEntity> = {};

		for (const i in this.entities) res[i] = this.entities[i].pack();

		return res;
	}
}
