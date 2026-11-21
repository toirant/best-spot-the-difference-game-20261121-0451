// Mouse and keyboard input. A click on either panel hunts for a
// difference; the arrow keys drive a crosshair for players who prefer
// the keyboard, and H asks for a hint. Buttons live in render.js so the
// click test and the drawing can never drift apart.
import { LEFT_PANEL_X, PANEL_HEIGHT, PANEL_WIDTH, PANEL_Y, RIGHT_PANEL_X } from './config.js';
import { playFind, playHint, playLevelClear, playMiss, playWin, toggleMuted } from './audio.js';
import { differenceAt, SCENES } from './scenes.js';
import {
  SCREEN_GAME_OVER,
  SCREEN_LEVEL_DONE,
  SCREEN_PAUSED,
  SCREEN_PLAY,
  SCREEN_TITLE,
  SCREEN_WIN,
  currentScene,
  markFound,
  markMiss,
  startGame,
  startLevel,
  useHint,
} from './state.js';
import { CENTER_BUTTON, HINT_BUTTON, pointInRect } from './render.js';

const PANELS = [
  { name: 'left', x: LEFT_PANEL_X, y: PANEL_Y },
  { name: 'right', x: RIGHT_PANEL_X, y: PANEL_Y },
];

function panelAt(x, y) {
  for (const panel of PANELS) {
    if (x >= panel.x && x < panel.x + PANEL_WIDTH && y >= panel.y && y < panel.y + PANEL_HEIGHT) {
      return { panel, localX: x - panel.x, localY: y - panel.y };
    }
  }
  return null;
}

function clickAt(state, x, y) {
  if (state.screen === SCREEN_TITLE) {
    startGame(state);
    return;
  }
  if (state.screen === SCREEN_LEVEL_DONE) {
    if (pointInRect(x, y, CENTER_BUTTON)) advanceLevel(state);
    return;
  }
  if (state.screen === SCREEN_GAME_OVER) {
    if (pointInRect(x, y, CENTER_BUTTON)) startLevel(state, state.levelIndex);
    return;
  }
  if (state.screen === SCREEN_WIN) {
    if (pointInRect(x, y, CENTER_BUTTON)) startGame(state);
    return;
  }
  if (state.screen === SCREEN_PAUSED) {
    state.screen = SCREEN_PLAY;
    return;
  }
  if (state.screen !== SCREEN_PLAY) return;
  if (pointInRect(x, y, HINT_BUTTON)) {
    if (useHint(state) !== null) playHint();
    return;
  }
  const hit = panelAt(x, y);
  if (hit === null) return;
  const scene = currentScene(state);
  const difference = differenceAt(scene, hit.localX, hit.localY);
  if (difference === null) {
    markMiss(state, hit.localX, hit.localY, hit.panel.name);
    playMiss();
    return;
  }
  if (state.found.has(difference.id)) {
    state.message = 'Already found that one.';
    state.messageAt = state.time;
    return;
  }
  markFound(state, difference);
  playFind();
  if (state.found.size === scene.differences.length) {
    if (state.levelIndex + 1 >= SCENES.length) {
      state.screen = SCREEN_WIN;
      state.best = Math.max(state.best, state.score);
      playWin();
    } else {
      state.screen = SCREEN_LEVEL_DONE;
      playLevelClear();
    }
  }
}

function advanceLevel(state) {
  startLevel(state, state.levelIndex + 1);
}

function moveCursor(state, dx, dy) {
  const cursor = state.cursor;
  cursor.visible = true;
  cursor.x = Math.max(0, Math.min(1279, cursor.x + dx));
  cursor.y = Math.max(0, Math.min(719, cursor.y + dy));
  const hit = panelAt(cursor.x, cursor.y);
  cursor.panel = hit !== null ? hit.panel.name : cursor.panel;
}

export function attachInput(canvas, state) {
  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    state.cursor.visible = false;
    clickAt(state, x, y);
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const step = event.shiftKey ? 42 : 14;
    switch (event.key) {
      case 'ArrowLeft':
        moveCursor(state, -step, 0);
        event.preventDefault();
        break;
      case 'ArrowRight':
        moveCursor(state, step, 0);
        event.preventDefault();
        break;
      case 'ArrowUp':
        moveCursor(state, 0, -step);
        event.preventDefault();
        break;
      case 'ArrowDown':
        moveCursor(state, 0, step);
        event.preventDefault();
        break;
      case 'Tab': {
        const cursor = state.cursor;
        cursor.visible = true;
        if (cursor.panel === 'left') {
          cursor.x = RIGHT_PANEL_X + (cursor.x - LEFT_PANEL_X);
          cursor.panel = 'right';
        } else {
          cursor.x = LEFT_PANEL_X + (cursor.x - RIGHT_PANEL_X);
          cursor.panel = 'left';
        }
        event.preventDefault();
        break;
      }
      case 'Enter':
      case ' ':
        state.cursor.visible = true;
        clickAt(state, state.cursor.x, state.cursor.y);
        event.preventDefault();
        break;
      case 'h':
      case 'H':
        if (state.screen === SCREEN_PLAY && useHint(state) !== null) playHint();
        break;
      case 'p':
      case 'P':
      case 'Escape':
        if (state.screen === SCREEN_PLAY) state.screen = SCREEN_PAUSED;
        else if (state.screen === SCREEN_PAUSED) state.screen = SCREEN_PLAY;
        break;
      case 'm':
      case 'M':
        toggleMuted();
        break;
      case 'n':
      case 'N':
        if (state.screen === SCREEN_LEVEL_DONE) advanceLevel(state);
        break;
      case 'r':
      case 'R':
        if (state.screen === SCREEN_GAME_OVER || state.screen === SCREEN_WIN) startGame(state);
        break;
      default:
        break;
    }
  });
}
