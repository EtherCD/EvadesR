import type { Assets } from "./types";

export const GlobalAssets: Assets = {
  textures: {
    leaves: "worlds/leaves3.png",
    leavesCorners: "worlds/corners.png",
    road: "worlds/road.png",
    leaf: "entity/leaf.png",
    leaf2: "entity/leaf2.png",
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
  entities: [
    ["#787878"], /// normal 0
    ["#000"], // wall 1
    ["#000"], // immune 2
    ["#A05353"], // sniper 3
    ["#A05353"], // bullet 4
    ["#565656"], // changer 5
    ["#00EB00"], // corrosive 6
    ["#679fff"], // drop 7
    ["#fff"], // leaf 8
    ["#A0780A"], // homing 9
    ["#aaa"], //  vortex 10
    ["#f00"], // slower 11
    ["#00f"], // draining 12
    ["#ffbfce"], // disable 13
    ["#563232"], // tree 14
    ["#ffc18c"], // bee 15
    ["#D09C0D"], // homing_sniper 16
    ["#D09C0D"], // homing_bullet 17
    ["#D53E07"], // flame 18
    ["#D53E07"], // trail, 19
    ["#F86630"], // flame_sniper 20
    ["#d0e2ed"], // cloud 21
    ["#78148C"], // pull 22
    ["#6A6084"], // fade 23
  ],
};
