const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildContactMessage,
  buildFlavorUpdateSubscription,
  createBackendClient
} = require("../src/backend");

test("builds a normalized contact message payload for future database/email storage", () => {
  assert.deepEqual(
    buildContactMessage({
      name: "  Ada  ",
      email: "  ADA@EXAMPLE.COM ",
      message: "  Wholesale question  ",
      now: () => "2026-04-28T23:00:00.000Z"
    }),
    {
      type: "contact-message",
      source: "website-contact",
      name: "Ada",
      email: "ada@example.com",
      message: "Wholesale question",
      createdAt: "2026-04-28T23:00:00.000Z"
    }
  );
});

test("builds a flavor update subscription payload for future email chains", () => {
  assert.deepEqual(
    buildFlavorUpdateSubscription({
      email: "  FAN@EXAMPLE.COM ",
      favoriteBlend: "Deep Focus",
      now: () => "2026-04-28T23:10:00.000Z"
    }),
    {
      type: "flavor-update-subscription",
      source: "website-flavor-updates",
      email: "fan@example.com",
      favoriteBlend: "Deep Focus",
      interests: ["new-flavors", "back-in-stock"],
      status: "pending-confirmation",
      createdAt: "2026-04-28T23:10:00.000Z"
    }
  );
});

test("keeps submissions local when no backend endpoints are configured", async () => {
  const client = createBackendClient();
  const payload = buildFlavorUpdateSubscription({
    email: "fan@example.com",
    now: () => "2026-04-28T23:10:00.000Z"
  });

  await assert.deepEqual(await client.subscribeToFlavorUpdates(payload), {
    ok: true,
    mode: "not-configured",
    payload
  });
});

test("posts contact and flavor-update payloads when endpoints are configured later", async () => {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => ({ id: "saved-1" }) };
  };
  const client = createBackendClient({
    endpoints: {
      contact: "/api/contact-messages",
      flavorUpdates: "/api/flavor-updates"
    },
    fetcher
  });

  const contactPayload = buildContactMessage({
    name: "Ada",
    email: "ada@example.com",
    message: "Hello",
    now: () => "2026-04-28T23:00:00.000Z"
  });
  const flavorPayload = buildFlavorUpdateSubscription({
    email: "fan@example.com",
    now: () => "2026-04-28T23:10:00.000Z"
  });

  assert.deepEqual(await client.sendContactMessage(contactPayload), {
    ok: true,
    mode: "posted",
    data: { id: "saved-1" }
  });
  assert.deepEqual(await client.subscribeToFlavorUpdates(flavorPayload), {
    ok: true,
    mode: "posted",
    data: { id: "saved-1" }
  });

  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "/api/contact-messages");
  assert.equal(calls[1].url, "/api/flavor-updates");
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(calls[1].options.body), flavorPayload);
});
