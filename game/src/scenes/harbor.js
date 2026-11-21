// Lantern Harbor, level 1: a fishing harbour at dusk. The left panel is
// the original; the right panel applies seven small changes. Every
// decoration is drawn from a fixed seed, so the two panels match exactly
// everywhere the differences do not touch.
import { circle, cloud, ellipse, polygon, star, verticalGradient } from '../draw.js';
import { makeRandom, range } from '../random.js';

const SEED = 20261121;

export const harborScene = {
  id: 'harbor',
  name: 'Lantern Harbor',
  blurb: 'Dusk over the fishing harbour. Seven things changed on the right.',
  differences: [
    { id: 'moon-phase', label: 'the moon turned crescent', x: 480, y: 55, r: 34 },
    { id: 'lamp-color', label: 'the lighthouse lamp changed colour', x: 90, y: 82, r: 26 },
    { id: 'gull-missing', label: 'a gull flew away', x: 262, y: 46, r: 22 },
    { id: 'flag-color', label: 'the boat flag changed colour', x: 432, y: 234, r: 24 },
    { id: 'lantern-unlit', label: 'a dock lantern went dark', x: 522, y: 292, r: 24 },
    { id: 'fish-absent', label: 'the jumping fish is gone', x: 372, y: 248, r: 26 },
    { id: 'window-dark', label: 'a cottage window went dark', x: 209, y: 217, r: 22 },
  ],

  draw(ctx, applied) {
    const random = makeRandom(SEED);
    drawSky(ctx, random, applied);
    drawShore(ctx, applied);
    drawSea(ctx, random, applied);
    drawLighthouse(ctx, applied);
    drawBoats(ctx, applied);
    drawDock(ctx, applied);
    drawGulls(ctx, applied);
    drawFish(ctx, applied);
  },
};

function drawSky(ctx, random, applied) {
  ctx.fillStyle = verticalGradient(ctx, '#2b2350', '#e07856', 240);
  ctx.fillRect(0, 0, 560, 240);
  // Seeded stars, only in the upper sky so they never crowd the sea.
  ctx.fillStyle = '#fff6d8';
  for (let i = 0; i < 42; i += 1) {
    const x = range(random, 8, 552);
    const y = range(random, 8, 120);
    const size = range(random, 0.7, 1.9);
    circle(ctx, x, y, size);
  }
  // One bright star the player can anchor on.
  star(ctx, 420, 34, 7, 3);
  cloud(ctx, 150, 58, 0.9, 'rgba(255, 214, 180, 0.55)');
  cloud(ctx, 330, 92, 0.7, 'rgba(255, 200, 170, 0.45)');
  // The moon: full with craters, or a crescent when the difference applies.
  ctx.fillStyle = '#ffeec2';
  circle(ctx, 480, 55, 26);
  if (applied.has('moon-phase')) {
    ctx.fillStyle = '#2b2350';
    circle(ctx, 492, 48, 23);
  } else {
    ctx.fillStyle = '#e8cf9a';
    circle(ctx, 472, 48, 5);
    circle(ctx, 488, 62, 4);
    circle(ctx, 478, 68, 3);
  }
}

function drawShore(ctx, applied) {
  // A low dark headland the cottages sit on.
  ctx.fillStyle = '#241d33';
  ctx.beginPath();
  ctx.moveTo(0, 236);
  ctx.quadraticCurveTo(140, 196, 280, 228);
  ctx.quadraticCurveTo(400, 252, 560, 222);
  ctx.lineTo(560, 240);
  ctx.lineTo(0, 240);
  ctx.closePath();
  ctx.fill();
  drawCottage(ctx, 150, 196, '#7a4a3a', false);
  drawCottage(ctx, 196, 204, '#4a5a7a', applied.has('window-dark'));
}

function drawCottage(ctx, x, y, wall, windowDark) {
  ctx.fillStyle = wall;
  ctx.fillRect(x, y, 52, 30);
  ctx.fillStyle = '#33222e';
  polygon(ctx, [[x - 4, y], [x + 26, y - 18], [x + 56, y]]);
  ctx.fillStyle = '#3a2c22';
  ctx.fillRect(x + 22, y + 12, 10, 18);
  ctx.fillStyle = windowDark ? '#2c3550' : '#ffd98a';
  ctx.fillRect(x + 8, y + 8, 10, 10);
}

function drawSea(ctx, random, applied) {
  ctx.fillStyle = verticalGradient(ctx, '#1d5a6b', '#0f3547', 360);
  ctx.fillRect(0, 230, 560, 130);
  // Moonlight shimmering on the water.
  ctx.fillStyle = 'rgba(255, 238, 194, 0.35)';
  for (let i = 0; i < 12; i += 1) {
    const y = 238 + i * 10;
    const width = 46 - i * 2;
    ctx.fillRect(480 - width / 2 + range(random, -4, 4), y, width, 3);
  }
  // Wave lines.
  ctx.strokeStyle = 'rgba(190, 230, 235, 0.5)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 9; i += 1) {
    const y = 252 + i * 12;
    const x = range(random, 20, 500);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 14, y - 5, x + 30, y);
    ctx.stroke();
  }
  // A red buoy bobbing between the boats.
  ctx.fillStyle = '#c0392b';
  ellipse(ctx, 180, 302, 12, 7);
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(176, 288, 8, 8);
  ctx.fillStyle = '#ffd98a';
  circle(ctx, 180, 286, 3);
}

function drawLighthouse(ctx, applied) {
  // Beam first so the tower paints over its root.
  ctx.fillStyle = 'rgba(255, 240, 180, 0.20)';
  polygon(ctx, [[96, 86], [330, 30], [330, 130]]);
  // Tapered tower with red bands.
  ctx.fillStyle = '#f2ead8';
  polygon(ctx, [[62, 232], [70, 96], [110, 96], [118, 232]]);
  ctx.fillStyle = '#c0392b';
  polygon(ctx, [[65, 196], [115, 196], [117, 214], [63, 214]]);
  polygon(ctx, [[68, 140], [112, 140], [114, 158], [66, 158]]);
  // Gallery and lamp room.
  ctx.fillStyle = '#33222e';
  ctx.fillRect(66, 92, 48, 6);
  ctx.fillRect(72, 70, 36, 22);
  ctx.fillStyle = applied.has('lamp-color') ? '#9fd8ff' : '#ffe27a';
  ctx.fillRect(76, 74, 28, 14);
  ctx.fillStyle = '#33222e';
  polygon(ctx, [[70, 70], [90, 56], [110, 70]]);
  // Warm glow around the lamp when it burns yellow.
  if (!applied.has('lamp-color')) {
    ctx.fillStyle = 'rgba(255, 226, 122, 0.25)';
    circle(ctx, 90, 81, 22);
  }
}

function drawBoats(ctx, applied) {
  drawBoat(ctx, 296, 268, 0.9, '#e8e0c8', false);
  drawBoat(ctx, 418, 296, 1.1, '#d8c8a8', applied.has('flag-color'));
  // A second sail catching the last light.
  ctx.fillStyle = 'rgba(255, 214, 180, 0.6)';
  polygon(ctx, [[432, 244], [432, 278], [458, 278]]);
}

function drawBoat(ctx, x, y, scale, sail, flagBlue) {
  ctx.strokeStyle = '#33222e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y - 52 * scale);
  ctx.lineTo(x, y);
  ctx.stroke();
  // Flag on the masthead: red, or blue when the difference applies.
  ctx.fillStyle = flagBlue ? '#3a6fd8' : '#d83a3a';
  polygon(ctx, [[x, y - 52 * scale], [x + 16, y - 48 * scale], [x, y - 44 * scale]]);
  ctx.fillStyle = sail;
  polygon(ctx, [[x + 2, y - 50 * scale], [x + 2, y - 8], [x + 34 * scale, y - 8]]);
  ctx.fillStyle = '#5d3a28';
  polygon(ctx, [[x - 26 * scale, y - 6], [x + 40 * scale, y - 6], [x + 32 * scale, y + 8], [x - 18 * scale, y + 8]]);
  ctx.fillStyle = '#3a2c22';
  ctx.fillRect(x - 8, y - 4, 16, 4);
}

function drawDock(ctx, applied) {
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(448, 312, 112, 48);
  ctx.strokeStyle = '#4a3018';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(448, 322 + i * 9);
    ctx.lineTo(560, 322 + i * 9);
    ctx.stroke();
  }
  drawDockLantern(ctx, 462, 306, true);
  drawDockLantern(ctx, 522, 306, !applied.has('lantern-unlit'));
}

function drawDockLantern(ctx, x, y, lit) {
  ctx.fillStyle = '#33222e';
  ctx.fillRect(x - 2, y - 22, 4, 22);
  ctx.fillStyle = '#2c2118';
  ctx.fillRect(x - 8, y - 34, 16, 14);
  ctx.fillStyle = lit ? '#ffe27a' : '#4a4038';
  ctx.fillRect(x - 5, y - 31, 10, 8);
  if (lit) {
    ctx.fillStyle = 'rgba(255, 226, 122, 0.28)';
    circle(ctx, x, y - 27, 15);
  }
}

function drawGulls(ctx, applied) {
  ctx.strokeStyle = '#1c2438';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  drawGull(ctx, 204, 62);
  if (!applied.has('gull-missing')) drawGull(ctx, 262, 46);
  drawGull(ctx, 330, 70);
}

function drawGull(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(x - 9, y);
  ctx.quadraticCurveTo(x - 4, y - 7, x, y);
  ctx.quadraticCurveTo(x + 4, y - 7, x + 9, y);
  ctx.stroke();
}

function drawFish(ctx, applied) {
  if (applied.has('fish-absent')) return;
  // A fish leaping out of the water, mid-arc.
  ctx.fillStyle = '#9fd8e8';
  ctx.beginPath();
  ctx.moveTo(352, 252);
  ctx.quadraticCurveTo(372, 226, 392, 250);
  ctx.quadraticCurveTo(372, 244, 352, 252);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7ab8c8';
  polygon(ctx, [[388, 248], [398, 240], [396, 254]]);
  ctx.fillStyle = '#1c2438';
  circle(ctx, 360, 246, 2);
  // The splash it left behind.
  ctx.strokeStyle = 'rgba(220, 245, 250, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(352, 258, 8, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(392, 258, 8, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
}
