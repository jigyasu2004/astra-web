# EMBER Kitchen

A fictional burger restaurant with a scroll-driven, texture-mapped 3D burger. Five layers separate, rotate, and assemble as the camera moves. The final act adds falling 3D fries, a rising glass of cola, animated ice, bubbles, and condensation. Includes food detail dialogs, a demo tasting tray with quantity controls and totals, and flavour preferences.

## Develop and build

```sh
pnpm install
pnpm dev
pnpm build:hostinger
```

Deploy the contents of `hostinger-dist/` to an independent Hostinger `public_html/`. This is a static site; the tray does not submit orders or process payments. No credentials or runtime API keys are needed.

## Assets

See `public/credits.html` for full linked attribution. Burger by usp05 (CC BY 4.0), modified by splitting geometry, adjusting materials and adding motion. Photos by David Foodphototasty, Mitchell Luo, and Qasim Malick (Unsplash License).

## Validation

TypeScript check and production build pass. WebMCP contracts verified: renderer ready, progress changes, invalid progress rejection, tray quantities and ₹627 combo total, invalid quantity rejection, and reset. Motion respects reduced-motion settings; ambient movement can also be paused. Full browser visual QA was not requested.
