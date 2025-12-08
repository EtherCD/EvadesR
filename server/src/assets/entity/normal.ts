import { Entity } from "../../core/objects/entity";
import { Player } from "../../core/objects/player";
import { Update } from "../../shared/core/types";

export class Normal extends Entity {
	behavior(props: Update): void {}
	auraEffect(player: Player): void {}
}
