export const HARDGAME_CONFIG = Object.freeze({
  version: "0.2.0",
  apiBase: "/api",
  world: {
    chunkSize: 32,
    renderDistance: 5,
    seed: "HARDGAME-001"
  },
  combat: {
    perfectBlockWindowMs: 180,
    blockAuraCost: 5,
    spellManaCost: 18
  },
  persistence: {
    autosaveMs: 15000
  }
});
