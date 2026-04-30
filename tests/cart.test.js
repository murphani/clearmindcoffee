const test = require("node:test");
const assert = require("node:assert/strict");

const {
  addCartItem,
  buildSubscriptionItem,
  cartCount,
  cartTotal,
  checkoutMessage,
  removeCartItem
} = require("../src/cart");

test("adds a coffee bag to the cart and updates count and total", () => {
  const cart = addCartItem([], {
    name: "Morning Ritual",
    detail: "Light roast - one 12 oz bag",
    price: 18
  });

  assert.equal(cartCount(cart), 1);
  assert.equal(cartTotal(cart), 18);
  assert.deepEqual(cart[0], {
    name: "Morning Ritual",
    detail: "Light roast - one 12 oz bag",
    price: 18
  });
});

test("removes an item without mutating the original cart", () => {
  const original = [
    { name: "Morning Ritual", detail: "Light roast - one 12 oz bag", price: 18 },
    { name: "Deep Focus", detail: "Medium roast - one 12 oz bag", price: 20 }
  ];

  const cart = removeCartItem(original, 0);

  assert.equal(cartCount(cart), 1);
  assert.equal(cart[0].name, "Deep Focus");
  assert.equal(original.length, 2);
});

test("ignores invalid remove indexes", () => {
  const original = [{ name: "Evening Calm", detail: "Low-caf blend - one 12 oz bag", price: 17 }];

  assert.deepEqual(removeCartItem(original, 9), original);
  assert.deepEqual(removeCartItem(original, -1), original);
});

test("builds a configured subscription item", () => {
  const item = buildSubscriptionItem({
    blend: "Deep Focus",
    grind: "Espresso",
    cadence: "Every month"
  });

  assert.deepEqual(item, {
    name: "Deep Focus subscription",
    detail: "Espresso, Every month",
    price: 16
  });
});

test("returns the right checkout message for empty and active carts", () => {
  assert.equal(checkoutMessage([]), "Add a blend or subscription before checkout.");
  assert.equal(
    checkoutMessage([{ name: "Morning Ritual", detail: "Light roast - one 12 oz bag", price: 18 }]),
    "Checkout is ready for a payment provider connection, such as Shopify, Stripe, or Square."
  );
});
