# VERDANT build and revision timings

Updated 2026-09-09 06:15:49 UTC.

**Recorded work so far: 47 min 20 sec**, including the current publishing/responsiveness session through the timestamp above. These are elapsed task work windows, including tool/build waits, excluding gaps between user messages. They are not loading times.

| Work window | Recorded duration |
| --- | --- |
| Planning and research | 53 sec |
| Initial plant website and organization | 11 min 54 sec |
| 3D forest revision and initial Hostinger/GitHub setup | 15 min 48 sec |
| Loading screen and eight scroll chapters | 9 min 31 sec |
| Responsive refinements and automatic publishing, through this update | 9 min 14 sec |
| **Total recorded through this update** | **47 min 20 sec** |

Aether's initial full task window was 7 min 21 sec. The earlier 5 min 1 sec (Aether) and 8 min 1 sec (VERDANT) figures measured registration-to-first-publication only, not all work.

## Automatic publishing

Push source changes to `main` in `jigyasu2004/astra-web`. The `Publish Hostinger websites` workflow installs locked dependencies, builds the static sites and publishes generated files to `hostinger-aether` and `hostinger-verdant`. Hostinger watches each site's corresponding branch and deploys it to that site's `public_html`. The existing source ZIP import also starts publishing after it succeeds.

Do not edit the generated deployment branches manually. The normal source remains under `website/`. A successful GitHub build precedes Hostinger deployment; a code push is not an instantaneous live update. Check both statuses when diagnosing a failed update. Each live site's `/deployment.json` records the source commit and build timestamp.

## Responsive update

VERDANT uses fluid title sizing, a horizontal chapter index on phones, constrained body copy, compact landscape spacing, a resizing WebGL camera/canvas, and reduced-motion alternatives for the loader and text transitions.
