const test = require("node:test");
const assert = require("node:assert/strict");

const { products, findProductById, productCartItem } = require("../src/products");

test("defines the three visible coffee blends", () => {
  assert.deepEqual(
    products.map((product) => product.name),
    ["Morning Ritual", "Deep Focus", "Evening Calm"]
  );
});

test("keeps product card content complete", () => {
  for (const product of products) {
    assert.ok(product.id);
    assert.ok(product.name);
    assert.ok(product.roast);
    assert.ok(product.description);
    assert.match(product.image, /^assets\/.+\.jpg$/);
    assert.equal(typeof product.price, "number");
  }
});

test("finds products by id for button clicks", () => {
  assert.equal(findProductById("deep-focus").name, "Deep Focus");
  assert.equal(findProductById("missing"), undefined);
});

test("builds the cart item shown after clicking add to cart", () => {
  assert.deepEqual(productCartItem(findProductById("morning-ritual")), {
    name: "Morning Ritual",
    detail: "Light roast - one 12 oz bag",
    price: 999
  });
});
