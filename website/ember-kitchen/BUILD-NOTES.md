# EMBER Kitchen build notes

Recorded on 9 September 2026. **Build duration: approximately 25 minutes.**

## Final experience

- Textured 3D burger opens into five rotating layers and assembles on scroll.
- Fries tumble into place and an iced cola rises beside the burger.
- The meal settles onto a ceramic platter with shadows.
- Opt-in synthesized whoosh, stack, crunch, fizz, and ice-clink effects.
- Portrait and landscape phone layouts; food canvas separated from copy.
- Smaller pixel and shadow budgets on phones; no rendering offscreen.
- Demo menu, food details, quantities, and tray totals. No real orders or payments.

## Checks

TypeScript and production builds pass. WebMCP verified valid journey positions, renderer readiness, invalid progress rejection, tray totals, invalid quantities, and reset. The final platter/ingredient scenes returned ready=true and error=false. No claim of testing on physical phones is made; no physical phone was connected.

[Live demo](https://firebrick-reindeer-525697.hostingersite.com/)

## Loading UX correction

The opening holds native wheel, touch, keyboard, and restored scrolling at zero until the model has rendered its first frame. It waits for a current touch gesture and 350 ms of quiet wheel input before releasing, preventing queued momentum from skipping ahead. A visible menu shortcut and the normal navigation can bypass loading immediately. An error or a 30-second timeout releases the guard and uses a static, one-screen fallback.

The embedded RGB PNG was re-encoded as a quality-90 JPEG at its original 2048×2048 resolution, reducing the GLB from 6,517,868 to 2,136,308 bytes (67.2%). All geometry buffers and original attribution metadata were verified unchanged. An HTML preload starts the model download early, while Three.js modules load concurrently.

Three regression tests passed for scroll suppression/cleanup, touch and wheel settling, and menu bypass without a later jump back. In a production preview with the model delayed by six seconds, an attempted progress of 0.8 returned progress=0, ready=false, openingLocked=true. After loading, readiness was true, the guard was released, and journey progress 0, 0.8 and back to 0 passed. The normal production preview also passed progress 0, 0.45, 1 and reset. TypeScript and the production build pass.
