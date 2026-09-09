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
