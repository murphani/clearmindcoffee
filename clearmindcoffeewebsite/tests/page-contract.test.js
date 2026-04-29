const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("loads the tested modules before the browser wiring script", () => {
  const productsScript = html.indexOf('<script src="src/products.js"></script>');
  const cartScript = html.indexOf('<script src="src/cart.js"></script>');
  const backendScript = html.indexOf('<script src="src/backend.js"></script>');
  const browserScript = html.indexOf('<script src="script.js"></script>');

  assert.ok(productsScript > -1);
  assert.ok(cartScript > productsScript);
  assert.ok(backendScript > cartScript);
  assert.ok(browserScript > backendScript);
});

test("keeps the one-page coffee storefront sections in place", () => {
  for (const id of ["home", "story", "product", "subscribe", "contact"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

test("keeps the hero as an ocean background without the product bag overlay", () => {
  assert.match(html, /<section class="hero" id="home">/);
  assert.match(html, /<img src="assets\/morning-ritual\.jpg" alt="" \/>/);
  assert.doesNotMatch(html, /class="hero-pack"/);
});

test("keeps interactive targets available to the JavaScript layer", () => {
  for (const hook of [
    "data-products",
    "data-subscribe-form",
    "data-contact-form",
    "data-flavor-updates-form",
    "data-cart-drawer",
    "data-cart-items",
    "data-cart-count",
    "data-cart-total",
    "data-checkout",
    "data-flavor-updates-status"
  ]) {
    assert.match(html, new RegExp(hook));
  }
});
