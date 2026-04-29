const {
  addCartItem,
  buildSubscriptionItem,
  cartCount: getCartCount,
  cartTotal: getCartTotal,
  checkoutMessage,
  removeCartItem
} = window.ClearMindCart;
const { products, findProductById, productCartItem } = window.ClearMindProducts;
const {
  buildContactMessage,
  buildFlavorUpdateSubscription,
  createBackendClient
} = window.ClearMindBackend;

let cart = [];
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const backendClient = createBackendClient({
  endpoints: window.ClearMindBackendEndpoints,
  fetcher: window.fetch ? window.fetch.bind(window) : undefined
});

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector(".menu-toggle");
const productGrid = document.querySelector("[data-products]");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const cartItems = document.querySelector("[data-cart-items]");
const cartCount = document.querySelector("[data-cart-count]");
const cartTotal = document.querySelector("[data-cart-total]");
const checkoutStatus = document.querySelector("[data-checkout-status]");

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeMenu() {
  nav.classList.remove("is-open");
  header.classList.remove("nav-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function openCart() {
  renderCart();
  document.body.classList.add("cart-open");
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.body.classList.remove("cart-open");
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function addToCart(item) {
  cart = addCartItem(cart, item);
  renderCart();
  openCart();
}

function removeFromCart(index) {
  cart = removeCartItem(cart, index);
  renderCart();
}

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card reveal">
          <div class="product-visual">
            <img src="${product.image}" alt="${product.name} coffee blend" />
            <div class="bag-mockup" aria-hidden="true">
              <span>Clear Mind</span>
              <strong>${product.name}</strong>
              <span>${product.roast}</span>
            </div>
          </div>
          <div class="product-body">
            <p class="roast">${product.roast}</p>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-meta">
              <strong>${money.format(product.price)}</strong>
              <span>12 oz bag</span>
            </div>
            <button class="button dark full" type="button" data-add-product="${product.id}">
              Add to cart
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCart() {
  const total = getCartTotal(cart);
  cartCount.textContent = getCartCount(cart);
  cartTotal.textContent = money.format(total);
  checkoutStatus.textContent = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Your cart is ready for a better morning. Add a blend or build a subscription to get started.</p>`;
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item, index) => `
        <div class="cart-line">
          <div>
            <h3>${item.name}</h3>
            <p>${item.detail}</p>
          </div>
          <div>
            <strong>${money.format(item.price)}</strong>
            <button class="remove-button" type="button" data-remove="${index}">Remove</button>
          </div>
        </div>
      `
    )
    .join("");
}

function watchReveals() {
  const revealItems = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

window.addEventListener("scroll", setHeaderState);
setHeaderState();
renderProducts();
renderCart();
watchReveals();

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("nav-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMenu();
  }
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-product]");
  if (!button) return;
  const product = findProductById(button.dataset.addProduct);
  addToCart(productCartItem(product));
});

document.querySelector("[data-subscribe-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const blend = data.get("blend");
  const grind = data.get("grind");
  const cadence = data.get("cadence");
  const status = document.querySelector("[data-subscribe-status]");

  addToCart(buildSubscriptionItem({ blend, grind, cadence }));

  status.textContent = "Subscription added. You can review it in your cart.";
});

document.querySelector("[data-contact-form]").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const status = document.querySelector("[data-contact-status]");
  const payload = buildContactMessage({
    name: data.get("name"),
    email: data.get("email"),
    message: data.get("message")
  });

  await backendClient.sendContactMessage(payload);
  status.textContent = "Thanks. Your message is ready for the Clear Mind Coffee team.";
  form.reset();
});

document.querySelector("[data-flavor-updates-form]").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const status = document.querySelector("[data-flavor-updates-status]");
  const payload = buildFlavorUpdateSubscription({
    email: data.get("email"),
    favoriteBlend: data.get("favoriteBlend")
  });

  await backendClient.subscribeToFlavorUpdates(payload);
  status.textContent = "You are on the flavor update list.";
  form.reset();
});

document.querySelectorAll("[data-open-cart]").forEach((button) => {
  button.addEventListener("click", openCart);
});

document.querySelector("[data-close-cart]").addEventListener("click", closeCart);

cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) {
    closeCart();
  }
});

cartItems.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove]");
  if (!removeButton) return;
  removeFromCart(Number(removeButton.dataset.remove));
});

document.querySelector("[data-checkout]").addEventListener("click", () => {
  checkoutStatus.textContent = checkoutMessage(cart);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeMenu();
  }
});
