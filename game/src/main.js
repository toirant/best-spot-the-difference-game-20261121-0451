// Twin Lanterns: boot, the frame loop and the clock. The game itself
// lives in state.js (what is true), render.js (what it looks like) and
// input.js (what a click or a key does); this file only wires them
// together and keeps time.
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './config.js';
import { attachInput } from './input.js';
import { renderGame } from './render.js';
import { playTick } from './audio.js';
import { createState, tick } from './state.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const state = createState();
const status = document.getElementById('status');

attachInput(canvas, state);

// A ?shot=cover|garden|attic|win query stages a fixed mid-play frame for
// screenshots; without it the game opens on its title screen.
const shot = new URLSearchParams(window.location.search).get('shot');
if (shot !== null) stageShot(shot, state);

let lastNow = performance.now();
let lastWholeSecond = Math.ceil(state.timeLeft);

function frame(now) {
  const seconds = Math.min(0.1, Math.max(0, (now - lastNow) / 1000));
  lastNow = now;
  if (state.frozenTime !== null) {
    state.time = state.frozenTime;
  } else {
    state.time += seconds;
    tick(state, seconds);
    const whole = Math.ceil(state.timeLeft);
    if (whole !== lastWholeSecond) {
      lastWholeSecond = whole;
      if (state.timeLeft <= 10.5 && state.timeLeft > 0) playTick();
    }
  }
  renderGame(ctx, state);
  if (status !== null) {
    const found = state.found.size;
    const total = 7;
    status.textContent =
      state.screen === 'play'
        ? `Found ${found} of ${total} differences. ${Math.ceil(state.timeLeft)} seconds left. ${state.message}`
        : state.message;
  }
  requestAnimationFrame(frame);
}

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
requestAnimationFrame(frame);
