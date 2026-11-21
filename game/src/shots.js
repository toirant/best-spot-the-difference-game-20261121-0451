// The staged scenes behind ?shot=cover|garden|attic|win. Each one sets a
// real game state — a level in mid-play with some differences found and
// some still hiding — and freezes the clock, so the frame a screenshot
// takes is the same frame every time, and is what a player really sees.
import { SCREEN_PLAY, SCREEN_WIN, startLevel } from './state.js';

/** Freeze animations at a fixed moment so the shot never depends on luck. */
function freeze(state) {
  state.frozenTime = 1.6;
  state.time = 1.6;
  state.shotMode = true;
}

function stageMidPlay(state, levelIndex, foundIds, timeLeft) {
  startLevel(state, levelIndex);
  state.found = new Set(foundIds);
  state.timeLeft = timeLeft;
  state.score = foundIds.length * 100;
  state.levelScore = foundIds.length * 100;
  const remaining = 7 - foundIds.length;
  state.message = `${foundIds.length} found — ${remaining} still hiding. Look closely!`;
  state.messageAt = state.time;
  state.screen = SCREEN_PLAY;
  freeze(state);
}

/**
 * Set `state` to the named shot (cover, garden, attic, win; anything else
 * is the cover) and return the shot's name.
 */
export function stageShot(name, state) {
  if (name === 'garden') {
    stageMidPlay(state, 1, ['sun-face', 'butterfly-absent'], 122);
    return 'garden';
  }
  if (name === 'attic') {
    stageMidPlay(state, 2, ['clock-hands', 'cat-eyes', 'book-color', 'lamp-off', 'gear-absent'], 64);
    return 'attic';
  }
  if (name === 'win') {
    startLevel(state, 2);
    state.found = new Set(['clock-hands', 'cat-eyes', 'book-color', 'lamp-off', 'gear-absent', 'steam-absent', 'cobweb-absent']);
    state.timeLeft = 64;
    state.score = 2450;
    state.levelScore = 950;
    state.best = 2450;
    state.screen = SCREEN_WIN;
    freeze(state);
    return 'win';
  }
  stageMidPlay(state, 0, ['moon-phase', 'lamp-color', 'gull-missing'], 107);
  return 'cover';
}
