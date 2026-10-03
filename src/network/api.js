// HardGame client API adapter.
// The browser never talks to D1 directly.
// Authentication and persistence stay behind the API boundary.

const API_BASE = globalThis.HARDGAME_API_BASE || "/api";

async function request(path, options = {}) {
  const response = await fetch(API_BASE + path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "api_error");
  return data;
}

export const HardGameAPI = {
  health() {
    return request("/health");
  },

  loadPlayer() {
    return request("/player");
  },

  savePlayer(player) {
    return request("/player", {
      method: "POST",
      body: JSON.stringify(player)
    });
  }
};
