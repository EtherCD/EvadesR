import lwf from "lwf";

const packedPlayer = [
  "id",
  "name",
  "x",
  "y",
  "energy",
  "radius",
  "area",
  "world",
  "died",
  "regeneration",
  "speed",
  "maxEnergy",
  "dTimer",
  "state",
  "stateMeta",
  "hero",
];

const packedEntity = ["type", "x", "y", "radius", "harmless"];

export const sendSchema = new lwf.Schema({
  root: {
    isArray: true,
    nested: [
      "message",
      "players",
      "self",
      "areaInit",
      "newPlayer",
      "updatePlayers",
      "newEntities",
      "updateEntities",
      "closeEntities",
    ],
    fields: ["closePlayer"],
  },
  message: {
    key: "message",
    fields: ["author", "msg", "role", "world"],
  },
  players: {
    key: "players",
    isMap: true,
    fields: packedPlayer,
  },
  self: {
    key: "self",
    fields: packedPlayer,
  },
  areaInit: {
    key: "areaInit",
    fields: ["world", "area", "w", "h"],
    nested: ["entities"],
  },
  entities: {
    key: "entities",
    isMap: true,
    fields: packedEntity,
  },
  newPlayer: {
    key: "newPlayer",
    fields: packedPlayer,
  },
  updatePlayers: {
    key: "updatePlayers",
    isMap: true,
    fields: packedPlayer,
  },
  newEntities: {
    key: "newEntities",
    isMap: true,
    fields: packedEntity,
  },
  updateEntities: {
    key: "updateEntities",
    isMap: true,
    fields: packedEntity,
  },
  closeEntities: {
    key: "closeEntities",
    isArray: true,
  },
});

export class FormatEncoder {
  static encode(value: object) {
    return lwf.encode(value, sendSchema);
  }
  static decode(buffer: Uint8Array) {
    return lwf.decode(buffer, sendSchema);
  }
}
