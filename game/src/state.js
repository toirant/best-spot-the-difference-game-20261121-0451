// The game's state: which screen is showing, what the player has found,
// and the clock. Everything the renderer draws comes from here, and
// nothing here touches the canvas, so the screenshot stager can set a
// state directly and the frame it draws is exactly that state.
import {
  DIFFERENCES_PER_LEVEL,
  HINTS_PER_LEVEL,
  LEVEL_TIME_SECONDS,
} from './config.js';
import { sceneForLevel } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_LEVEL_DONE = 'level-done';
export const SCREEN_GAME_OVER = 'game-over';
export const SCREEN_WIN = 'win';
export const SCREEN_PAUSED = 'paused';

export function createState() {
  return {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    found: new Set(),
    mistakes: 0,
    hintsLeft: HINTS_PER_LEVEL,
    timeLeft: LEVEL_TIME_SECONDS,
    score: 0,
    levelScore: 0,
    best: 0,
    hint: null, // { id, until } while a hint ring is showing
    misses: [], // { x, y, panel, at } fading red marks
    message: '',
    messageAt: 0,
    // Keyboard crosshair, in whole-canvas coordinates.
    cursor: { x: 320, y: 288, panel: 'left', visible: false },
    // When set, the clock never moves and animations freeze at this time:
    // the screenshot scenes use it so every shot is deterministic.
    frozenTime: null,
    time: 0,
    shotMode: false,
  };
}

export function currentScene(state) {
  return sceneForLevel(state.levelIndex);
}

export function foundCount(state) {
  return state.found.size;
}

export function remainingCount(state) {
  return DIFFERENCES_PER_LEVEL - state.found.size;
}

export function startLevel(state, levelIndex) {
  state.levelIndex = levelIndex;
  state.screen = SCREEN_PLAY;
  state.found = new Set();
  state.mistakes = 0;
  state.hintsLeft = HINTS_PER_LEVEL;
  state.timeLeft = LEVEL_TIME_SECONDS;
  state.levelScore = 0;
  state.hint = null;
  state.misses = [];
  state.message = `Level ${levelIndex + 1}: ${currentScene(state).name} — find ${DIFFERENCES_PER_LEVEL} differences!`;
  state.messageAt = state.time;
  state.cursor = { x: 320, y: 288, panel: 'left', visible: false };
}

export function startGame(state) {
  state.score = 0;
  state.best = Math.max(state.best, 0);
  startLevel(state, 0);
}

export function markFound(state, difference) {
  if (state.found.has(difference.id)) return false;
  state.found.add(difference.id);
  state.levelScore += 100;
  state.score += 100;
  state.message = `Found it — ${difference.label}!`;
  state.messageAt = state.time;
  if (state.found.size === DIFFERENCES_PER_LEVEL) {
    const bonus = Math.ceil(state.timeLeft) * 5;
    state.score += bonus;
    state.levelScore += bonus;
    state.message = `All ${DIFFERENCES_PER_LEVEL} found! Time bonus +${bonus}.`;
    state.messageAt = state.time;
  }
  return true;
}

export function markMiss(state, x, y, panel) {
  state.mistakes += 1;
  state.timeLeft = Math.max(0, state.timeLeft - 5);
  state.misses.push({ x, y, panel, at: state.time });
  if (state.misses.length > 6) state.misses.shift();
  state.message = 'Not a difference — 5 seconds lost.';
  state.messageAt = state.time;
}

export function useHint(state) {
  if (state.screen !== SCREEN_PLAY || state.hintsLeft <= 0) return null;
  const unfound = currentScene(state).differences.filter((d) => !state.found.has(d.id));
  if (unfound.length === 0) return null;
  const difference = unfound[Math.floor(Math.random() * unfound.length)];
  state.hintsLeft -= 1;
  state.timeLeft = Math.max(0, state.timeLeft - 10);
  state.hint = { id: difference.id, until: state.time + 3 };
  state.message = `Hint: look near “${difference.label}” — 10 seconds lost.`;
  state.messageAt = state.time;
  return difference;
}

/** Advance the clock; returns 'timeout' when the level runs out of time. */
export function tick(state, seconds) {
  if (state.frozenTime !== null) return null;
  if (state.screen !== SCREEN_PLAY) return null;
  state.timeLeft -= seconds;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.screen = SCREEN_GAME_OVER;
    state.message = 'Out of time!';
    state.messageAt = state.time;
    return 'timeout';
  }
  return null;
}
