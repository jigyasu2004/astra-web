# EMBER — Space Journey

A cinematic Three.js voyage from Earth past the Moon, through an asteroid drift, and into Saturn's rings. Seven scroll chapters, animated type, atmospheric edges, a shadowed annular mesh, instanced rocks, and an orbiting camera.

- Live demo: https://peru-rat-318520.hostingersite.com/
- Source: `gpt-astra/website/ember/`
- Hostinger production branch: `hostinger-ember`
- Development: `pnpm install` then `pnpm dev --port 3001`
- Static production build: `pnpm build:hostinger`; output `hostinger-dist/`

## Recorded duration

Research/build/check window: 9 September 2026, 05:56:42–06:13:12 UTC, **16 minutes 30 seconds**. This is the observed work window beginning at this task's first recorded clock reading and ending after the validated build. Hostinger/GitHub publication is excluded. The shared scaffold pre-existed this space implementation.

## Validation

TypeScript check and Hostinger production build passed. The page's WebMCP tool `navigate_space_journey` was verified at 69% (Saturn reveal) and 87% (ring passage), both with ready=true, error=false, and matching scroll/render state. Progress=2 was rejected intentionally. General browser visual QA was not performed.

## Assets

Earth, Moon and Saturn textures by [Solar System Scope](https://www.solarsystemscope.com/textures/) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Original maps are unmodified and rendered under artistic lighting. Detailed URLs are in `public/space/ATTRIBUTION.txt`; visitor credits are at `/credits.html`.

The experience is an artistic composition, not an astronomical scale model. It uses no API keys, accounts or runtime services. Google Fonts has system-font fallbacks. Reduced-motion preferences disable continuous rotation and pointer drift. WebGL context failure shows a retry state.

## Phone layout update — 9 September 2026

Portrait phones use a separate, correctly proportioned 3D scene above the story, centered camera targets, and a wider Saturn reveal. The layout includes safe-area insets, larger chapter touch targets, a swipe hint, shorter scroll travel, readable body copy, and a separate landscape composition. Browser chrome changes are accommodated by combining stable viewport travel with dynamic viewport padding. Phone rendering uses fewer polygons, stars, rocks and ring particles, with a capped pixel ratio and no pointer drift on touch.

Validation: TypeScript and production build; mathematical projection checks for the Earth, Moon and full Saturn-ring views at 320×568, 375×667, 390×844 and 430×932. These are geometry checks, not device/browser visual QA.
