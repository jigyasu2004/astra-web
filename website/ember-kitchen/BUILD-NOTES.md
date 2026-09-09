# EMBER Kitchen build notes

Recorded on 9 September 2026. Work began at 05:51:30 UTC. These are cumulative observed wall-clock windows, including research, implementation, user-requested additions, validation, and hosting work already performed. They are not benchmarks or CPU time.

| Checkpoint | UTC | Cumulative duration |
| --- | --- | --- |
| 3D burger, falling fries, and rising iced cola | 06:16:59 | 25 min 29 sec |
| Optional food sound effects | 06:21:09 | 29 min 39 sec |
| Reference-inspired platter and phone refinements | 06:32:33 | 41 min 3 sec |

Final publishing after the last checkpoint is not included.

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
