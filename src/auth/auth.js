// Provider-neutral authentication adapter.
// Google/Discord OAuth secrets must only exist server-side.
// This module deliberately does not fake OAuth in the browser.

export const Auth = {
  provider: null,

  async login(provider) {
    if (!["google", "discord"].includes(provider)) {
      throw new Error("unsupported_provider");
    }

    // The production route will be /auth/:provider.
    // Keeping the redirect here means the game client does not know
    // provider secrets or OAuth implementation details.
    window.location.href = `/auth/${provider}`;
  },

  logout() {
    window.location.href = "/auth/logout";
  }
};
