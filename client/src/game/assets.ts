import { WorldEffect, type Assets } from "./types";

export const GlobalAssets: Assets = {
  textures: {
    leaves: "worlds/leaves3.png",
    leavesCorners: "worlds/corners.png",
    road: "worlds/road.png",
    leaf: "entity/leaf.png",
    leaf2: "entity/leaf2.png",
  },
  worlds: {
    /* world name - properties */
    "Celestial Canyon": {
      fillColor: "#49a8d7ff",
      fillAlpha: 0.2,
      effect: WorldEffect.Rain,
    },
  },
  zones: {
    teleport_world: {
      fillColor: "#6AD0DE",
    },
    teleport: {
      fillColor: "#FFF46C",
    },
    victory: {
      fillColor: "#FFF46C",
    },
    active: {
      fillColor: "#fff",
    },
    safe: {
      fillColor: "#C1C1C1",
    },
    wall: {
      fillColor: "#222",
    },
    exit: {
      fillColor: "#FFFABA",
    },
  },
  entities: [["#ccc"], ["#000"], ["#000"], ["#A05353"], ["#A05353"]],
};
