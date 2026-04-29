(function (root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  root.ClearMindBackend = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function timestamp(now) {
    return now ? now() : new Date().toISOString();
  }

  function normalizeEmail(email) {
    return String(email).trim().toLowerCase();
  }

  function buildContactMessage({ name, email, message, now }) {
    return {
      type: "contact-message",
      source: "website-contact",
      name: String(name).trim(),
      email: normalizeEmail(email),
      message: String(message).trim(),
      createdAt: timestamp(now)
    };
  }

  function buildFlavorUpdateSubscription({ email, favoriteBlend = "All blends", now }) {
    return {
      type: "flavor-update-subscription",
      source: "website-flavor-updates",
      email: normalizeEmail(email),
      favoriteBlend,
      interests: ["new-flavors", "back-in-stock"],
      status: "pending-confirmation",
      createdAt: timestamp(now)
    };
  }

  function createBackendClient({ endpoints = {}, fetcher } = {}) {
    const postJson = async (url, payload) => {
      if (!url) {
        return { ok: true, mode: "not-configured", payload };
      }

      const response = await fetcher(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = response.json ? await response.json() : null;

      return {
        ok: response.ok,
        mode: "posted",
        data
      };
    };

    return {
      sendContactMessage(payload) {
        return postJson(endpoints.contact, payload);
      },
      subscribeToFlavorUpdates(payload) {
        return postJson(endpoints.flavorUpdates, payload);
      }
    };
  }

  return {
    buildContactMessage,
    buildFlavorUpdateSubscription,
    createBackendClient
  };
});
