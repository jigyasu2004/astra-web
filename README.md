# astra-web

A collection of interactive websites built with GPT Astra. Each project includes its source code and an independent Hostinger-ready build.

| Website | Experience | Live demo | Duration |
| --- | --- | --- | --- |
| [Aether](website/aether) | Scroll-driven particle transformations and pointer-responsive motion | [Open Aether](https://saddlebrown-shark-315620.hostingersite.com) | 7 min 21 sec |
| [VERDANT](website/verdant) | Real-time 3D tree growth, an orbiting camera, forest travel, and falling autumn leaves | [Open VERDANT](https://antiquewhite-ant-461490.hostingersite.com) | 27 min |
| [EMBER — Space Journey](website/ember) | 3D Earth and Moon flybys, drifting asteroids, and travel through Saturn’s rings | [Open EMBER](https://peru-rat-318520.hostingersite.com) | 16 min 30 sec |
| [EMBER Kitchen](website/ember-kitchen) | A 3D burger unstacking on scroll, tumbling fries, rising iced cola, and a demo tasting tray | [Open EMBER Kitchen](https://firebrick-reindeer-525697.hostingersite.com) | 25 min |
| [PRISM](website/prism) | Chrome portal, curved 3D project gallery, and immersive world previews | [Open PRISM](https://palegreen-hyena-221826.hostingersite.com) | 10 min 12 sec |

Live demos are hosted on Hostinger. The GitHub repository is public.

## Layout

```text
website/
  aether/
  verdant/
  ember/
  ember-kitchen/
  prism/
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

VERDANT was rebuilt on 9 September 2026 after feedback requesting real 3D movement. This revision adds a growing textured tree, a camera orbit, travel through a grove, and an autumn sequence.

## Loading and story update

VERDANT now has a lightweight opening animation, waits for decoded textures and the first rendered frame, and tells its story across eight scroll chapters with masked line reveals. Reduced-motion preferences are respected.

## EMBER space journey

The separate space demo lives in `website/ember/`. It uses CC BY 4.0 Solar System Scope maps, Three.js atmospheric shaders, a ring shadow shader, and instanced rock fields. See its project README for attribution and validation.

## EMBER Kitchen restaurant

The restaurant demo lives in `website/ember-kitchen/`. It uses a CC BY 4.0 burger by usp05, original Three.js fries and iced cola geometry, and Unsplash food photos. Full attribution is linked in the site footer.

## PRISM spatial gallery

A separate site inspired by the Alche portfolio shown in the supplied Instagram reference, with an original PRISM identity. Scroll from a chrome portal into six image panels arranged in 3D. Project previews link to the other Astra demos. See [PRISM documentation](website/prism/README.md) for credits.
