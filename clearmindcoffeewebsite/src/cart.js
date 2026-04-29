(function (root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  root.ClearMindCart = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const SUBSCRIPTION_PRICE = 16;
  const EMPTY_CHECKOUT_MESSAGE = "Add a blend or subscription before checkout.";
  const ACTIVE_CHECKOUT_MESSAGE =
    "Checkout is ready for a payment provider connection, such as Shopify, Stripe, or Square.";

  function addCartItem(cart, item) {
    return [...cart, { name: item.name, detail: item.detail, price: item.price }];
  }

  function removeCartItem(cart, index) {
    if (!Number.isInteger(index) || index < 0 || index >= cart.length) {
      return cart;
    }

    return cart.filter((_, itemIndex) => itemIndex !== index);
  }

  function cartCount(cart) {
    return cart.length;
  }

  function cartTotal(cart) {
    return cart.reduce((sum, item) => sum + item.price, 0);
  }

  function buildSubscriptionItem({ blend, grind, cadence }) {
    return {
      name: `${blend} subscription`,
      detail: `${grind}, ${cadence}`,
      price: SUBSCRIPTION_PRICE
    };
  }

  function checkoutMessage(cart) {
    return cart.length === 0 ? EMPTY_CHECKOUT_MESSAGE : ACTIVE_CHECKOUT_MESSAGE;
  }

  return {
    addCartItem,
    buildSubscriptionItem,
    cartCount,
    cartTotal,
    checkoutMessage,
    removeCartItem
  };
});
