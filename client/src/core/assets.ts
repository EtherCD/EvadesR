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
		"Autumn Atmosphere": {
			backgrounds: [
				["leavesCorners", 0.5],
				["leaves", 0.5],
			],
			fillColor: "#D79D49",
			fillAlpha: 0.45,
			effect: WorldEffect.LeafFall,
		},
		"Rainy Road": {
			backgrounds: [["road", 0.3]],
			fillColor: "#49a8d7ff",
			fillAlpha: 0.45,
			effect: WorldEffect.Rain,
		},
		"Infectant Industry": {
			effect: WorldEffect.Rain,
			fillColor: "b465ff",
			fillAlpha: 0.4,
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
	entities: {
		0: {
			color: "#aaa",
		},
	},
};
