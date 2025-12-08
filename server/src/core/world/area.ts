import { Normal } from "../../assets/entity/normal";
import { tile } from "../../shared/config";
import { PackedEntity, Update } from "../../shared/core/types";
import { diff } from "../../shared/diff";
import { RawArea, RawEntity } from "../../shared/services/types";
import { Entity } from "../objects/entity";
import { Player } from "../objects/player";
import { sendToNetwork } from "../send";

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
    this.players = this.players.filter((v) => v !== player.id);
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
    this.oldEntitiesPacks = Object.assign({}, this.getEnemies());

    for (const e in this.entities) {
      this.entities[e].update(update);
    }

    const updatedEntities = this.getDiffEnemies();
    if (updatedEntities[0])
      for (const i of this.players)
        sendToNetwork.updateEntities(i, updatedEntities[0]);
  }

  getDiffEnemies(): [Record<number, Partial<PackedEntity>>, boolean] {
    let updated: Record<number, Partial<PackedEntity>> = {};
    const keys = Object.keys(this.entities);
    let isUpdated = false;
    for (const v of keys) {
      const i = v as any as number;
      const dif = diff(this.oldEntitiesPacks[i], this.entities[i].pack());
      if (dif[1]) {
        if (updated === null) updated = {};
        updated[i] = dif[0];
        isUpdated = true;
      }
    }
    return [updated, isUpdated];
  }

  getEnemies(): Record<number, PackedEntity> {
    let res: Record<number, PackedEntity> = {};

    for (const i in this.entities) res[i] = this.entities[i].pack();

    return res;
  }

  getPlayers(players: Record<number, Player>) {
    let output: Record<number, Player> = {};

    for (const i of this.players) {
      output[i] = players[i];
    }

    return output;
  }
}
