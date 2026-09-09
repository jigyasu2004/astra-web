# astra-web

A collection of interactive websites built with GPT Astra. Each project includes its source code and an independent Hostinger-ready build.

| Website | Experience | Live demo | Recorded build-to-publish window |
| --- | --- | --- | --- |
| [Aether](website/aether) | Scroll-driven particle transformations and pointer-responsive motion | [Open Aether](https://saddlebrown-shark-315620.hostingersite.com) | 5 min 1 sec |
| [VERDANT](website/verdant) | Real-time 3D tree growth, an orbiting camera, forest travel, and falling autumn leaves | [Open VERDANT](https://antiquewhite-ant-461490.hostingersite.com) | 8 min 1 sec |

Both live demos are hosted on Hostinger. The GitHub repository is private.

## Timing notes

Recorded on 9 September 2026, measured from site registration to the first successful publication. These are observed development/publication windows, not total task times: initial research, early setup, the subsequent 3D redesign, folder organization, GitHub upload, and Hostinger migration are excluded.

- Aether: 04:26:15–04:31:16 UTC.
- VERDANT: 04:37:22–04:45:23 UTC.

## Layout

```text
website/
  aether/
  verdant/
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

Upload the **contents** of `hostinger-dist/` into the corresponding website's `public_html/` folder. The generated `index.html` must be directly inside `public_html/`. Both sites run as static HTML, JavaScript, and CSS; no Node server, database, API keys, or paid external services are needed at runtime.

Use a separate Hostinger website/domain for each project. Do not overwrite an existing website's files. If deploying through a build integration, select the relevant `website/aether` or `website/verdant` root, build with `pnpm build:hostinger`, and publish `hostinger-dist`.

The original Sites build is retained as `pnpm build`. `.openai/hosting.json` holds non-secret identifiers for those original deployments.

## Assets

Aether uses code-generated abstract particles. VERDANT uses Three.js and Daniel Greenheck’s MIT-licensed [EZ-Tree](https://github.com/dgreenheck/ez-tree), including its bark, leaf, and ground textures. The license is included in `website/verdant/public/forest/`. The fallback fern photograph is from Unsplash.

## Accessibility

Keyboard-accessible controls, responsive layouts, and reduced-motion preferences are supported.

## 3D revision

VERDANT was rebuilt on 9 September 2026 after feedback requesting real 3D movement. This revision adds a growing textured tree, a camera orbit, travel through a grove, and an autumn sequence. The 3D revision was not independently timed; the recorded build windows above refer only to the earlier versions.
