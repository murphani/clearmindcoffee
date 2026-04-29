const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const css = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");

test("keeps the current brand color system", () => {
  for (const token of [
    "--ink: #203942",
    "--ink-deep: #132930",
    "--cloud: #fff9f0",
    "--cream: #f7eddf",
    "--copper: #9a451c",
    "--sage: #6f8f80"
  ]) {
    assert.match(css, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("keeps the ocean hero image full-bleed and text-led", () => {
  assert.match(css, /\.hero\s*{[^}]*min-height: 96vh;/s);
  assert.match(css, /\.hero-media img\s*{[^}]*object-fit: cover;/s);
  assert.match(css, /\.hero::after\s*{[^}]*linear-gradient/s);
  assert.doesNotMatch(css, /\.hero-pack\s*{/);
});

test("keeps product cards and bag mockups for blend cards", () => {
  assert.match(css, /\.product-grid\s*{[^}]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\);/s);
  assert.match(css, /\.product-card\s*{[^}]*border-radius: 8px;/s);
  assert.match(css, /\.bag-mockup\s*{[^}]*position: absolute;/s);
});

test("keeps responsive mobile breakpoints", () => {
  assert.match(css, /@media \(max-width: 860px\)/);
  assert.match(css, /@media \(max-width: 520px\)/);
});
