(function (root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  root.ClearMindProducts = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const products = [
    {
      id: "morning-ritual",
      name: "Morning Ritual",
      roast: "Light roast",
      description: "Bright citrus, toasted almond, and a clean finish for your first focused hour.",
      image: "assets/morning-ritual.jpg",
      price: 999
    },
    {
      id: "deep-focus",
      name: "Deep Focus",
      roast: "Medium roast",
      description: "Rich cocoa, brown sugar, and a steady body for long work blocks.",
      image: "assets/deep-focus.jpg",
      price: 999
    },
    {
      id: "evening-calm",
      name: "Evening Calm",
      roast: "Low-caf blend",
      description: "Soft caramel, dried cherry, and a mellow cup for slower hours.",
      image: "assets/evening-calm.jpg",
      price: 999
    }
  ];

  function findProductById(id) {
    return products.find((product) => product.id === id);
  }

  function productCartItem(product) {
    return {
      name: product.name,
      detail: `${product.roast} - one 12 oz bag`,
      price: product.price
    };
  }

  return {
    products,
    findProductById,
    productCartItem
  };
});
