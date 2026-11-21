// Everything the player sees: the two panels, their frames, the markers
// on found differences, the HUD with its counter and clock, and the
// title, pause and end screens. The panels themselves are drawn once per
// level onto offscreen canvases; every frame after that just blits them
// and paints the markers on top.
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLORS,
  CONTROLS_Y,
  HUD_HEIGHT,
  LEFT_PANEL_X,
  MESSAGE_Y,
  PANEL_HEIGHT,
  PANEL_WIDTH,
  PANEL_Y,
  RIGHT_PANEL_X,
} from './config.js';
import { roundRect, roundRectStroke } from './draw.js';
import { SCENES, zoneInPanel } from './scenes.js';
import {
  SCREEN_GAME_OVER,
  SCREEN_LEVEL_DONE,
  SCREEN_PAUSED,
  SCREEN_PLAY,
  SCREEN_TITLE,
  SCREEN_WIN,
  currentScene,
  foundCount,
  remainingCount,
} from './state.js';

export const HINT_BUTTON = { x: 560, y: 556, w: 160, h: 40 };
export const CENTER_BUTTON = { x: 540, y: 500, w: 200, h: 48 };

export function pointInRect(x, y, rect) {
  return x >= rect.x && x < rect.x + rect.w && y >= rect.y && y < rect.y + rect.h;
}

let cachedLevel = -1;
let leftPanel = null;
let rightPanel = null;

/** Draw both panels for the current level onto offscreen canvases. */
export function ensurePanels(state) {
  if (state.levelIndex === cachedLevel && leftPanel !== null) return;
  const scene = currentScene(state);
  leftPanel = document.createElement('canvas');
  leftPanel.width = PANEL_WIDTH;
  leftPanel.height = PANEL_HEIGHT;
  rightPanel = document.createElement('canvas');
  rightPanel.width = PANEL_WIDTH;
  rightPanel.height = PANEL_HEIGHT;
  scene.draw(leftPanel.getContext('2d'), new Set());
  const changed = new Set(scene.differences.map((d) => d.id));
  scene.draw(rightPanel.getContext('2d'), changed);
  cachedLevel = state.levelIndex;
}

function formatTime(seconds) {
  const total = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function drawHud(ctx, state) {
  ctx.fillStyle = COLORS.hud;
  ctx.fillRect(0, 0, CANVAS_WIDTH, HUD_HEIGHT);
  ctx.fillStyle = COLORS.hudEdge;
  ctx.fillRect(0, HUD_HEIGHT - 2, CANVAS_WIDTH, 2);

  ctx.textBaseline = 'middle';
  ctx.fillStyle = COLORS.title;
  ctx.font = '700 30px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'left';
  ctx.fillText('Twin Lanterns', 24, 34);

  const scene = currentScene(state);
  ctx.fillStyle = COLORS.muted;
  ctx.font = '16px Georgia, serif';
  ctx.fillText(`Level ${state.levelIndex + 1} of ${SCENES.length} — ${scene.name}`, 24, 58);

  // The clock, dead centre.
  const low = state.timeLeft <= 10 && state.screen === SCREEN_PLAY;
  ctx.fillStyle = low ? COLORS.timerLow : COLORS.timer;
  ctx.font = '700 34px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(formatTime(state.timeLeft), CANVAS_WIDTH / 2, 32);
  ctx.fillStyle = COLORS.muted;
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText('time left', CANVAS_WIDTH / 2, 58);

  // The found counter: the number the bounty asks the screenshots to show.
  const found = foundCount(state);
  const total = scene.differences.length;
  ctx.textAlign = 'right';
  ctx.fillStyle = COLORS.found;
  ctx.font = '700 30px Georgia, serif';
  ctx.fillText(`Found ${found} / ${total}`, CANVAS_WIDTH - 24, 30);
  ctx.fillStyle = COLORS.muted;
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText(`${remainingCount(state)} still hiding  ·  Score ${state.score}`, CANVAS_WIDTH - 24, 58);
  ctx.textAlign = 'left';
}

function drawPanelFrame(ctx, x, label) {
  ctx.fillStyle = COLORS.frame;
  roundRect(ctx, x - 8, PANEL_Y - 8, PANEL_WIDTH + 16, PANEL_HEIGHT + 16, 10);
  ctx.fillStyle = COLORS.frameInner;
  roundRect(ctx, x - 4, PANEL_Y - 4, PANEL_WIDTH + 8, PANEL_HEIGHT + 8, 8);
  ctx.fillStyle = COLORS.panelLabel;
  ctx.font = '700 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + PANEL_WIDTH / 2, PANEL_Y - 26);
  ctx.textAlign = 'left';
}

function drawMarker(ctx, zone, time) {
  const pulse = 1 + Math.sin(time * 5) * 0.08;
  const radius = zone.r * 0.62 * pulse;
  ctx.strokeStyle = COLORS.found;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(zone.x, zone.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = COLORS.found;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(zone.x - 7, zone.y);
  ctx.lineTo(zone.x - 2, zone.y + 6);
  ctx.lineTo(zone.x + 8, zone.y - 6);
  ctx.stroke();
}

function drawHintRing(ctx, zone, time) {
  const radius = zone.r * 0.7 + Math.sin(time * 6) * 4;
  ctx.strokeStyle = COLORS.hint;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(zone.x, zone.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawMissMark(ctx, miss, time) {
  const age = time - miss.at;
  if (age > 1) return;
  const alpha = 1 - age;
  const x = (miss.panel === 'left' ? LEFT_PANEL_X : RIGHT_PANEL_X) + miss.x;
  const y = PANEL_Y + miss.y;
  ctx.strokeStyle = `rgba(255, 93, 93, ${alpha})`;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 9, y - 9);
  ctx.lineTo(x + 9, y + 9);
  ctx.moveTo(x + 9, y - 9);
  ctx.lineTo(x - 9, y + 9);
  ctx.stroke();
}

function drawPanels(ctx, state) {
  ensurePanels(state);
  drawPanelFrame(ctx, LEFT_PANEL_X, 'ORIGINAL');
  drawPanelFrame(ctx, RIGHT_PANEL_X, 'SPOT THE CHANGES');
  ctx.drawImage(leftPanel, LEFT_PANEL_X, PANEL_Y);
  ctx.drawImage(rightPanel, RIGHT_PANEL_X, PANEL_Y);

  const scene = currentScene(state);
  const time = state.time;
  for (const difference of scene.differences) {
    if (!state.found.has(difference.id)) continue;
    drawMarker(ctx, zoneInPanel(difference, LEFT_PANEL_X, PANEL_Y), time);
    drawMarker(ctx, zoneInPanel(difference, RIGHT_PANEL_X, PANEL_Y), time);
  }
  if (state.hint !== null && time < state.hint.until) {
    const difference = scene.differences.find((d) => d.id === state.hint.id);
    if (difference) {
      drawHintRing(ctx, zoneInPanel(difference, LEFT_PANEL_X, PANEL_Y), time);
      drawHintRing(ctx, zoneInPanel(difference, RIGHT_PANEL_X, PANEL_Y), time);
    }
  }
  for (const miss of state.misses) drawMissMark(ctx, miss, time);

  // The keyboard crosshair.
  if (state.cursor.visible && state.screen === SCREEN_PLAY) {
    const { x, y } = state.cursor;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 18, y);
    ctx.lineTo(x - 6, y);
    ctx.moveTo(x + 6, y);
    ctx.lineTo(x + 18, y);
    ctx.moveTo(x, y - 18);
    ctx.lineTo(x, y - 6);
    ctx.moveTo(x, y + 6);
    ctx.lineTo(x, y + 18);
    ctx.stroke();
  }
}

function drawBottomBar(ctx, state) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // The message line belongs to live play; the end screens say their own
  // piece in the overlay, so it stays out of their way.
  if (state.screen === SCREEN_PLAY) {
    ctx.fillStyle = COLORS.text;
    ctx.font = '18px Georgia, serif';
    ctx.fillText(state.message || currentScene(state).blurb, CANVAS_WIDTH / 2, MESSAGE_Y);
  }

  // Hint button.
  const hint = HINT_BUTTON;
  ctx.fillStyle = state.hintsLeft > 0 ? COLORS.button : '#3a3a3a';
  roundRect(ctx, hint.x, hint.y, hint.w, hint.h, 8);
  ctx.strokeStyle = COLORS.buttonEdge;
  ctx.lineWidth = 2;
  roundRectStroke(ctx, hint.x, hint.y, hint.w, hint.h, 8);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 17px system-ui, sans-serif';
  ctx.fillText(`Hint (${state.hintsLeft} left)`, hint.x + hint.w / 2, hint.y + hint.h / 2 + 1);

  ctx.fillStyle = COLORS.muted;
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText(
    `Mistakes: ${state.mistakes}  ·  Click a difference on either picture, or move with the arrow keys and press Enter. H hints, P pauses, M mutes.`,
    CANVAS_WIDTH / 2,
    CONTROLS_Y,
  );
  ctx.textAlign = 'left';
}

function drawOverlay(ctx, title, lines, buttonLabel) {
  ctx.fillStyle = 'rgba(16, 20, 32, 0.72)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = COLORS.title;
  ctx.font = '700 52px Georgia, serif';
  ctx.fillText(title, CANVAS_WIDTH / 2, 250);
  ctx.fillStyle = COLORS.text;
  ctx.font = '20px Georgia, serif';
  lines.forEach((line, index) => {
    ctx.fillText(line, CANVAS_WIDTH / 2, 320 + index * 32);
  });
  if (buttonLabel !== null) {
    const button = CENTER_BUTTON;
    ctx.fillStyle = COLORS.button;
    roundRect(ctx, button.x, button.y, button.w, button.h, 10);
    ctx.strokeStyle = COLORS.buttonEdge;
    ctx.lineWidth = 2;
    roundRectStroke(ctx, button.x, button.y, button.w, button.h, 10);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 19px system-ui, sans-serif';
    ctx.fillText(buttonLabel, button.x + button.w / 2, button.y + button.h / 2 + 1);
  }
  ctx.textAlign = 'left';
}

/** Paint one frame of the game onto the main canvas. */
export function renderGame(ctx, state) {
  ctx.fillStyle = '#141a2a';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawHud(ctx, state);
  drawPanels(ctx, state);
  drawBottomBar(ctx, state);

  if (state.screen === SCREEN_TITLE) {
    drawOverlay(ctx, 'Twin Lanterns', [
      'A spot-the-difference hunt in three hand-painted scenes.',
      'Two pictures, side by side — seven small changes on the right.',
      'Click a change on either picture, or hunt with the arrow keys.',
      'Wrong clicks cost 5 seconds. Hints cost 10. Good hunting!',
    ], null);
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.hint;
    ctx.font = '700 22px Georgia, serif';
    ctx.fillText('Click or press Enter to start', CANVAS_WIDTH / 2, 452);
    ctx.textAlign = 'left';
  } else if (state.screen === SCREEN_LEVEL_DONE) {
    drawOverlay(ctx, 'Level complete!', [
      `You found all ${currentScene(state).differences.length} differences in ${currentScene(state).name}.`,
      `Level score ${state.levelScore}  ·  Total score ${state.score}`,
      'The next scene is harder. Ready?',
    ], 'Next level  (N)');
  } else if (state.screen === SCREEN_GAME_OVER) {
    drawOverlay(ctx, 'Out of time!', [
      `You found ${foundCount(state)} of ${currentScene(state).differences.length} differences in ${currentScene(state).name}.`,
      'The harbour keeps its secrets — for now.',
    ], 'Try this level again  (R)');
  } else if (state.screen === SCREEN_WIN) {
    drawOverlay(ctx, 'You found them all!', [
      'Three scenes, twenty-one differences, and not one left hiding.',
      `Final score ${state.score}  ·  Best ${state.best}`,
      'The lanterns burn a little brighter tonight.',
    ], 'Play again  (R)');
  } else if (state.screen === SCREEN_PAUSED) {
    drawOverlay(ctx, 'Paused', ['The clock is stopped. The differences are waiting.'], null);
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.hint;
    ctx.font = '700 20px Georgia, serif';
    ctx.fillText('Press P or click to carry on', CANVAS_WIDTH / 2, 452);
    ctx.textAlign = 'left';
  }
}
