# Twin Lanterns — Spot the Difference

[![make.fun bounty](https://img.shields.io/badge/make.fun-bounty-blue)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![license: MIT](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

A spot-the-difference hunt in three hand-painted scenes, built for the
[make.fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
"Make the best spot the difference game" ($50, free entry).

Two pictures, side by side — seven small changes on the right. Click a
change on either picture, or hunt with the arrow keys and Enter. Wrong
clicks cost 5 seconds; hints cost 10. Three scenes, twenty-one
differences, and a clock that never stops ticking.

## The scenes

1. **Lantern Harbor** — dusk over a fishing harbour: lighthouse, boats,
   gulls, a jumping fish and a moon that will not sit still.
2. **Foxglove Garden** — morning in a cottage garden: a napping fox, a
   butterfly on the foxgloves, a birdhouse and a bee at work.
3. **Clockwork Attic** — night in a clockmaker's attic: the hardest set,
   under a ticking wall clock while the cat sleeps on the rug.

Every scene is drawn in code on a canvas — no image files, no fonts to
fetch, no network at all. The sounds are synthesized live with the Web
Audio API.

## Play

```sh
node serve.ts
# open http://localhost:8080
```

- **Mouse:** click a difference on either picture.
- **Keyboard:** arrow keys move the crosshair, Enter/Space selects,
  Tab switches pictures, H hints, P pauses, M mutes, R restarts.
- **Goal:** find all 7 differences in a scene before the 150-second
  clock runs out. Clearing a scene banks a time bonus; clearing all
  three wins the game.

## Layout

```
game/
  index.html          the page
  style.css           the frame around the canvas
  src/
    main.js           boot, frame loop, clock
    config.js         sizes, timings, scoring
    random.js         deterministic seeded random
    draw.js           shared canvas helpers
    scenes.js         the scene registry and hit tests
    scenes/
      harbor.js       Lantern Harbor
      garden.js       Foxglove Garden
      attic.js        Clockwork Attic
    state.js          screens, finds, timer, hints
    input.js          mouse and keyboard
    render.js         panels, markers, HUD, overlays
    audio.js          synthesized sounds (Web Audio)
    shots.js          staged ?shot= scenes for screenshots
main.ts               hands the game in: copies game/ + screenshots/
                      to /output and writes /output/dossier.json
serve.ts              tiny static server for local play
screenshots/         3–4 real renders of the game
vendor/
  makefun-game.ts     the kit's dossier library, unchanged
```

## Screenshots

The four shots in `screenshots/` are real renders of the game's own
code, staged with `?shot=cover|garden|attic|win` so the frame is
deterministic: the cover shows Lantern Harbor mid-hunt with three
differences found and four still hiding, and the counter reading
"Found 3 / 7".

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `game/` and
`screenshots/` to the output directory and writes `dossier.json` with
the vendored `buildDossier`. It never removes the output directory
itself — only the files inside it — and two runs write identical bytes.

## License

MIT. See [LICENSE](./LICENSE).
