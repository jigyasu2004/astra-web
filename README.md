# astra-web

A collection of interactive websites built with GPT Astra. Each project includes its source code and an independent Hostinger-ready build.

| Website | Experience | Live demo | Recorded work duration |
| --- | --- | --- | --- |
| [Aether](website/aether) | Scroll-driven particle transformations and pointer-responsive motion | [Open Aether](https://saddlebrown-shark-315620.hostingersite.com) | 7 min 21 sec initial task |
| [VERDANT](website/verdant) | Real-time 3D tree growth, an orbiting camera, forest travel, and falling autumn leaves | [Open VERDANT](https://antiquewhite-ant-461490.hostingersite.com) | [27 min](website/verdant/BUILD-NOTES.md) |
| [EMBER — Space Journey](website/ember) | 3D Earth and Moon flybys, drifting asteroids, and travel through Saturn’s rings | [Open EMBER](https://peru-rat-318520.hostingersite.com) | 16 min 30 sec (research/build/checks; publishing excluded) |
| [EMBER Kitchen](website/ember-kitchen) | A 3D burger unstacking on scroll, tumbling fries, rising iced cola, and a demo tasting tray | [Open EMBER Kitchen](https://firebrick-reindeer-525697.hostingersite.com) | [Approximately 25 min, owner-corrected](website/ember-kitchen/BUILD-NOTES.md) |

Live demos are hosted on Hostinger. The GitHub repository is public.

## Timing notes

Earlier measurements on 9 September 2026 were 5 min 1 sec for Aether and 8 min 1 sec for VERDANT, measured from site registration to the first successful publication. The table now links the broader task-duration record. These are observed development/publication windows, not total task times: initial research, early setup, the subsequent 3D redesign, folder organization, GitHub upload, and Hostinger migration are excluded.

- Aether: 04:26:15–04:31:16 UTC.
- VERDANT: 04:37:22–04:45:23 UTC.

## Layout

```text
website/
  aether/
  verdant/
  ember/
  ember-kitchen/
```

Each project is independent. Shared repository name: `astra-web`; local parent folder: `gpt-astra`.

## Run locally

Requires Node.js 22.13+ and pnpm.

```sh
cd website/aether # or website/verdant
pnpm install
pnpm dev
```

## Build for Hostinger

```sh
cd website/aether # or website/verdant
pnpm install
pnpm build:hostinger
```

Upload the **contents** of `hostinger-dist/` into the corresponding website's `public_html/` folder. The generated `index.html` must be directly inside `public_html/`. These sites run as static HTML, JavaScript, and CSS; no Node server, database, API keys, or paid external services are needed at runtime.

Use a separate Hostinger website/domain for each project. Do not overwrite an existing website's files. If deploying through a build integration, select the relevant `website/aether` or `website/verdant` root, build with `pnpm build:hostinger`, and publish `hostinger-dist`.

The original Sites build is retained as `pnpm build`. `.openai/hosting.json` holds non-secret identifiers for those original deployments.

## Assets

Aether uses code-generated abstract particles. VERDANT uses Three.js and Daniel Greenheck’s MIT-licensed [EZ-Tree](https://github.com/dgreenheck/ez-tree), including its bark, leaf, and ground textures. The license is included in `website/verdant/public/forest/`. The fallback fern photograph is from Unsplash.

## Accessibility

Keyboard-accessible controls, responsive layouts, and reduced-motion preferences are supported.

## 3D revision

VERDANT was rebuilt on 9 September 2026 after feedback requesting real 3D movement. This revision adds a growing textured tree, a camera orbit, travel through a grove, and an autumn sequence. See the updated project timing record.

## Loading and story update

VERDANT now has a lightweight opening animation, waits for decoded textures and the first rendered frame, and tells its story across eight scroll chapters with masked line reveals. Reduced-motion preferences are respected.  See [updated work timings and deployment notes](website/verdant/BUILD-NOTES.md).

## EMBER space journey

The separate space demo lives in `website/ember/`. Its recorded research/build/check window is 05:56:42–06:13:12 UTC on 9 September 2026 (16 min 30 sec), excluding subsequent publication and using the existing shared scaffold. It uses CC BY 4.0 Solar System Scope maps, Three.js atmospheric shaders, a ring shadow shader, and instanced rock fields. See its project README for attribution and validation.

## EMBER Kitchen restaurant

The restaurant demo lives in `website/ember-kitchen/`. The owner-corrected build duration is approximately 25 minutes. This replaces the earlier elapsed-time estimates. It uses a CC BY 4.0 burger by usp05, original Three.js fries and iced cola geometry, and Unsplash food photos. Full attribution is linked in the site footer.
