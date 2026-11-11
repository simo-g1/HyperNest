# HyperNest Improvement Package

This package contains the three HTML pages and the CSS/JavaScript files modified in this pass. Copy the folders/files into your existing HyperNest project, replacing files with matching paths. Keep your existing `imgs/`, `webfonts/`, `css/normalize.css`, and `css/all.min.css` assets; they were not included in the uploaded source archive and are intentionally not fabricated here.

## Main changes
- Removed the Hero Intro badge, CTA, and scroll hint markup and their JavaScript event bindings.
- Removed the HUD entrance animation so the title is not hidden behind an entrance effect. Added early Google Fonts preconnect hints.
- Added a cart-position-driven SVG trail using the existing Hero render loop (no second animation controller).
- Stopped the VirtualFit animation frame loop while its hero is outside the viewport.
- Fixed wishlist removal scope and persistence.
- Replaced the four-item recommendation preview with a session-stable selection of up to 20 products (five per top-level group), excluding cart items and unavailable stock.
- Consolidated order recording and loyalty awarding into one checkout wrapper; removed the second loyalty wrapper to prevent duplicate awards. Updated homepage/dashboard loyalty displays.
- Reduced artificial product/dashboard skeleton delays from 2.5 seconds to 160 ms.

## Important limitations
- The uploaded archive did not include the image assets, Font Awesome CSS/fonts, Normalize CSS, or a package/build configuration. Therefore the large `supermarket-aisle.webp` image could not be recompressed or resized, and the full visual project could not be run end-to-end here.
- Lighthouse scores were not re-run in a browser. JavaScript syntax and basic HTML structure checks were performed; please run the site locally and test cart/checkout, recommendations, wishlist, and all three pages before merging.
- Suggestions remain stable during a session. Products already in the cart are hidden from the rendered recommendations; if several selected products are later added to the cart, fewer than 20 may remain visible until the next session.
