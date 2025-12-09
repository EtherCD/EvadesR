export const tile = 32;

export const gameConfig = {
  spawn: {
    radius: 15,
    speed: 17,
    maxSpeed: 17,
    regeneration: 7,
    maxRegeneration: 7,
    energy: 300,
    maxEnergy: 300,

    world: "Celestial Canyon",
    area: 0,

    sx: -(10 * tile - 15),
    sy: 2 * tile + 15,
    ex: -15,
    ey: 15 * tile - 15 - 2 * tile,

    downedTimer: 60,
  },

  worlds: ["Celestial Canyon", "Tempest Tumult"],

  heroes: {
    nomal: {},
  },
};
