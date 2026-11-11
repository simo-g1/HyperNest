# HyperNest — Corrective Update 2

## Fixed in this iteration
- Removed the extra checkout wrapper from `pages.js`; checkout persistence and loyalty awarding now happen in one transaction path inside `my.js`.
- Added durable order history under `hypernest-demo-orders-v1` and persisted loyalty points in `hypernest-demo-state-v1`.
- Implemented Dashboard order count, item count, spend total, order history, points balance, and 1000-point redemption for a 15% discount.
- Added an accessible continuously scrolling right-to-left Smart Suggestions ribbon. It renders the selected products as a loop, pauses on hover/focus, and respects reduced-motion preferences.
- Fixed header visibility so it stays hidden until the main aisle hero has left the viewport.
- Reworked the golden cart trail into a synchronized soft halo and bright core, both drawn from the cart's actual render coordinates.
- First visible product images are eagerly requested; the first gets high fetch priority to address the Products LCP lazy-image finding.

## Validation
- JavaScript syntax checks are required after extraction (`node --check js/*.js`).
- Browser interaction testing and Lighthouse reruns have not been performed in this environment.
- Original image/font/Normalize/Font Awesome assets are not included in this ZIP; retain the project's existing `imgs`, `webfonts`, `css/normalize.css`, and `css/all.min.css`.

## Storage keys
- `hypernest-demo-state-v1`: cart, wishlist, theme, delivery, discount, loyalty points.
- `hypernest-demo-orders-v1`: up to 100 recorded demo orders.
- `hn-smart-suggestions-v1`: per-session recommendation IDs.
