# PRISM — A different dimension

[Live demo](https://palegreen-hyena-221826.hostingersite.com/)

A separate immersive 3D portfolio inspired by the Alche website shown in [the supplied Instagram reel](https://www.instagram.com/reel/DbLgANVRgZ_/). Original PRISM identity and implementation; not affiliated with Alche.

## Experience

A reflective chrome triangular portal opens into a curved gallery of six photographic worlds. Scroll or use the next/previous buttons, then open a project preview. Four previews link to the existing Astra demos. Two are clearly marked visual concepts. Phone layouts, keyboard controls, a loading state, reduced motion, and a fallback image are included.

## Development

Requires Node 22.13+ and pnpm. Run `pnpm install`, then `pnpm dev` (port 3010). Build with `pnpm build:hostinger`. Output: `hostinger-dist/`.

Pushes to main build the site and publish generated files to `hostinger-prism`, watched by Hostinger for automatic deployment.

## Timing

Research, implementation and build/WebMCP checks: **10 min 12 sec**, measured from task start to 06:52:35 UTC on 9 September 2026. Uses the existing shared scaffold; subsequent publishing is excluded.

## Sources and validation

Photographs: Unsplash. Attribution links are in `public/credits.html`. 3D rendering: Three.js. UI: React, shadcn/ui, Lucide. No account, backend or runtime secrets.

Production build passed. WebMCP `explore_prism_world` verified for navigation, opening/closing previews and invalid input rejection, with sceneReady true and fallback false. No separate visual browser QA was requested.
