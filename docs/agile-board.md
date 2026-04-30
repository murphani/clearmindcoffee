# Clear Mind Coffee Agile Board

## Sprint Goal

Turn the Lovable concept into a usable coffee storefront landing page with tested shopping behavior and a clear path to real checkout.

## Current Stories

### Story 1: Add Coffee To Cart
As a shopper, I want to add a blend to my cart so I can review what I plan to buy.

Acceptance criteria:
- A 12 oz blend item can be added with name, detail, and price.
- The cart count increases by one.
- The cart total reflects the added item.

### Story 2: Remove Cart Item
As a shopper, I want to remove an item so I can correct my cart before checkout.

Acceptance criteria:
- Removing by index returns a cart without that item.
- Removing an invalid index leaves the cart unchanged.

### Story 3: Build Subscription
As a subscriber, I want to configure blend, grind, and delivery cadence so my recurring order matches my routine.

Acceptance criteria:
- The subscription item includes the selected blend.
- The detail includes grind and cadence.
- The subscription uses the active subscription price.

### Story 4: Checkout Handoff
As a shopper, I want checkout feedback so I understand whether I can proceed.

Acceptance criteria:
- Empty carts show an add-item prompt.
- Non-empty carts show the payment-provider handoff message.

## Working Agreement

For each story:
1. Write the smallest failing test.
2. Write only enough production code to pass.
3. Refactor without changing behavior.
4. Keep a browser smoke test for the wired UI.
