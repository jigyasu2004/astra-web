# EMBER Kitchen

**Build duration: approximately 25 minutes.**

A fictional burger restaurant with a scroll-driven, texture-mapped 3D burger. Five layers separate, rotate, and assemble as the camera moves. The final act adds falling 3D fries, a rising glass of cola, animated ice, bubbles, and condensation. Optional Web Audio foley adds whooshes, a stack thud, fry crunch, cola fizz, and an ice clink. Sound is off by default and starts only after a visitor enables it. Includes food detail dialogs, a demo tasting tray with quantity controls and totals, and flavour preferences.

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

## Phone and reference refinement

The food occupies its own canvas region below the copy on portrait phones, with a separate landscape composition. Phone rendering caps pixel density at 1.35, uses 512px shadows, and skips rendering while offscreen or hidden. Larger touch targets and compact layouts support small screens. The ending now settles the meal onto a ceramic platter with contact shadows, inspired by the food-first presentation of the supplied Instagram reference.

## Loading behavior

The story waits at the opening until its first 3D frame is ready, and releases after any active swipe or wheel momentum finishes. Visitors can use **View the menu** immediately. Errors and a timeout fall back to a static hero without holding scrolling. The burger GLB is preloaded and is now 2.1 MB, 67% smaller, with unchanged geometry and a 2048px texture.

Run the loading regression checks with `node --experimental-strip-types --test tests/opening-scroll.test.mjs`. A six-second delayed-model check also verified that early journey navigation stays at zero until readiness.
