# HyperNest – first mobile performance pass

## Changes in this pass

1. Mobile devices (viewport width <= 767px) skip downloading and running `js/hero-intro.js`.
2. Mobile starts with the interactive product hero instead of the scroll-driven cinematic intro.
3. The mobile intro scroll runway and overlay layers are collapsed/hidden; the hero gets a shorter fixed working height.
4. Hero product cards are smaller on mobile (maximum width reduced from 150px to 112px).
5. The first hero product image is eager/high priority; other hero images keep `data-src` and are requested only when their card moves within the active-neighbor range (2.2 positions), with async decoding.
6. Reduced the glass blur on the mobile hero and removed persistent `will-change` promotion from its cards to limit GPU layer pressure.
7. Added the supplied `imgs/` and `webfonts/` folders to this project root so the relative paths used by the site resolve in one deployable folder.

## Preserved

- Desktop cinematic intro behavior and its script.
- Existing cart, wishlist, product, map, dashboard, and navigation logic.
- Existing visual structure outside the mobile hero adjustments.

## Validation performed

- `node --check` passed for every JavaScript file.
- Static local asset-reference check performed against HTML, CSS, and JS files.

## Not yet verified

- Lighthouse before/after comparison (no full Lighthouse report/trace was supplied).
- Real-device interaction and visual regression tests.
- Full refactoring of shared JS/CSS and page-specific code splitting. Those changes require function-by-function dependency mapping and browser regression tests; they are intentionally not mixed into this first low-risk performance pass.
