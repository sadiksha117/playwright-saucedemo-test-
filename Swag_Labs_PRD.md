# PRD: Checkout Flow

**Product:** Swag Labs (saucedemo.com)
**Feature:** Checkout flow for authenticated users
**Status:** Released
**Last updated:** April 2026

## 1. Background

Swag Labs is an e-commerce demo site for Sauce Labs branded merchandise. Users browse an inventory of 6 products, add items to their cart, and complete purchase through a 3-step checkout flow. The checkout flow is a critical conversion funnel — any friction directly affects orders completed.

## 2. Goal

Enable authenticated users to complete a purchase in three steps or fewer with minimal friction, while capturing the shipping information needed to fulfill the order.

## 3. User stories

- **As a** logged-in shopper with items in my cart, **I want to** provide my shipping details and review my order, **so that** I can complete my purchase confidently.
- **As a** logged-in shopper, **I want to** be warned about missing required fields before proceeding, **so that** I don't lose progress or submit incomplete data.
- **As a** logged-in shopper, **I want to** see a clear order confirmation, **so that** I know my purchase was successful.

## 4. User flow

Cart page → [Checkout] → Step 1: Info → [Continue] → Step 2: Overview → [Finish] → Step 3: Complete

### Step 1 — Your Information (`/checkout-step-one.html`)

Form with 3 required fields: First Name, Last Name, Zip/Postal Code.

Actions:
- **Cancel** button → returns to cart
- **Continue** button → validates and proceeds to Step 2

### Step 2 — Overview (`/checkout-step-two.html`)

Displays:
- Cart line items (name, description, price, quantity)
- Payment Information (static: "SauceCard #31337")
- Shipping Information (static: "Free Pony Express Delivery!")
- Price summary (Item total, Tax at 8%, Total)

Actions:
- **Cancel** button → returns to inventory
- **Finish** button → completes order, navigates to Step 3

### Step 3 — Complete (`/checkout-complete.html`)

Displays:
- Confirmation heading: "Thank you for your order!"
- Confirmation message
- Pony Express image
- **Back Home** button → returns to inventory, cart is cleared

## 5. Acceptance criteria

### Happy path
- User can complete checkout end-to-end with valid data in all three fields.
- Order overview displays correct item names, prices, and quantities matching the cart.
- Price total equals sum of line items plus 8% tax.
- Confirmation page appears after clicking Finish.
- Cart is cleared after successful order.

### Validation
- Submitting Step 1 with empty First Name shows error: "Error: First Name is required"
- Submitting Step 1 with empty Last Name shows error: "Error: Last Name is required"
- Submitting Step 1 with empty Postal Code shows error: "Error: Postal Code is required"
- User stays on Step 1 when validation fails.
- Error banner is dismissible via an `x` button.

### Navigation
- Cancel on Step 1 returns to cart (`/cart.html`).
- Cancel on Step 2 returns to inventory (`/inventory.html`).
- Back Home on Step 3 returns to inventory with cart cleared.

### State integrity
- Navigating back from Step 2 to Step 1 preserves the data already entered.
- Refreshing Step 2 preserves the cart and overview.

## 6. Out of scope

- Guest (unauthenticated) checkout — users must be logged in
- Payment processing — payment is static/simulated
- Multiple shipping addresses
- Promo codes or discounts
- International shipping (no country field)

## 7. Known limitations

- No inventory check before order placement.
- No "back" button in Step 2 to edit Step 1 info.
- The `problem_user` account is known to submit Step 1 form data incorrectly (internal test fixture behavior, not a bug).

## 8. Test user accounts

| Username | Password | Notes |
|---|---|---|
| `standard_user` | `secret_sauce` | Normal, expected behavior |
| `problem_user` | `secret_sauce` | Intentionally broken for negative testing |
| `performance_glitch_user` | `secret_sauce` | Slow responses — good for timing tests |
| `error_user` | `secret_sauce` | Triggers errors on certain flows |