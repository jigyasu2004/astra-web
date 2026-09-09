# VERDANT build and revision timings

**Recorded build time: 27 min.**

Updated to the project owner’s corrected timing on 9 September 2026.

## Automatic publishing

Push source changes to `main` in `jigyasu2004/astra-web`. The `Publish Hostinger websites` workflow installs locked dependencies, builds the static sites and publishes generated files to `hostinger-aether` and `hostinger-verdant`. Hostinger watches each site's corresponding branch and deploys it to that site's `public_html`. The existing source ZIP import also starts publishing after it succeeds.

Do not edit the generated deployment branches manually. The normal source remains under `website/`. A successful GitHub build precedes Hostinger deployment; a code push is not an instantaneous live update. Check both statuses when diagnosing a failed update. Each live site's `/deployment.json` records the source commit and build timestamp.

## Responsive update

VERDANT uses fluid title sizing, a horizontal chapter index on phones, constrained body copy, compact landscape spacing, a resizing WebGL camera/canvas, and reduced-motion alternatives for the loader and text transitions.
