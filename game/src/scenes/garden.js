// Foxglove Garden, level 2: a cottage garden in morning light. A fox
// naps by the flower beds while a butterfly works the foxgloves. Seven
// things change on the right panel; the seeded grass, petals and clouds
// never move.
import { circle, cloud, ellipse, polygon, roundRect, verticalGradient } from '../draw.js';
import { makeRandom, range } from '../random.js';

const SEED = 777001;

export const gardenScene = {
  id: 'garden',
  name: 'Foxglove Garden',
  blurb: 'Morning in the cottage garden. Seven things changed on the right.',
  differences: [
    { id: 'sun-face', label: 'the sun lost its smile', x: 92, y: 58, r: 34 },
    { id: 'butterfly-absent', label: 'the butterfly flew away', x: 300, y: 176, r: 24 },
    { id: 'fox-tail', label: 'the fox tail tip changed colour', x: 168, y: 292, r: 26 },
    { id: 'can-absent', label: 'the watering can is gone', x: 448, y: 300, r: 26 },
    { id: 'tulip-color', label: 'a tulip changed colour', x: 356, y: 262, r: 22 },
    { id: 'roof-color', label: 'the birdhouse roof changed colour', x: 500, y: 158, r: 26 },
    { id: 'bee-absent', label: 'the bee flew away', x: 246, y: 214, r: 20 },
  ],

  draw(ctx, applied) {
    const random = makeRandom(SEED);
    drawSky(ctx, random, applied);
    drawHills(ctx, random);
    drawFence(ctx);
    drawTree(ctx, random);
    drawBirdhouse(ctx, applied);
    drawFlowerBeds(ctx, random, applied);
    drawFox(ctx, applied);
    drawButterfly(ctx, applied);
    drawBee(ctx, applied);
    drawWateringCan(ctx, applied);
  },
};

function drawSky(ctx, random, applied) {
  ctx.fillStyle = verticalGradient(ctx, '#8ec8ee', '#e8f6d8', 200);
  ctx.fillRect(0, 0, 560, 200);
  cloud(ctx, 220, 52, 1.0, 'rgba(255, 255, 255, 0.9)');
  cloud(ctx, 420, 36, 0.75, 'rgba(255, 255, 255, 0.8)');
  cloud(ctx, 90, 120, 0.6, 'rgba(255, 255, 255, 0.7)');
  // The sun, smiling or plain.
  ctx.fillStyle = '#ffd23d';
  circle(ctx, 92, 58, 30);
  ctx.fillStyle = 'rgba(255, 210, 61, 0.3)';
  circle(ctx, 92, 58, 40);
  ctx.fillStyle = '#8a6b1f';
  circle(ctx, 82, 52, 3);
  circle(ctx, 102, 52, 3);
  if (!applied.has('sun-face')) {
    ctx.strokeStyle = '#8a6b1f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(92, 60, 12, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
  }
  // Seeded birds far off.
  ctx.strokeStyle = '#3a5a7a';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i += 1) {
    const x = range(random, 260, 480);
    const y = range(random, 30, 90);
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.quadraticCurveTo(x - 4, y - 6, x, y);
    ctx.quadraticCurveTo(x + 4, y - 6, x + 8, y);
    ctx.stroke();
  }
}

function drawHills(ctx, random) {
  ctx.fillStyle = '#7fb069';
  ctx.beginPath();
  ctx.moveTo(0, 190);
  ctx.quadraticCurveTo(160, 150, 320, 186);
  ctx.quadraticCurveTo(440, 214, 560, 176);
  ctx.lineTo(560, 360);
  ctx.lineTo(0, 360);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6a9a58';
  ctx.beginPath();
  ctx.moveTo(0, 230);
  ctx.quadraticCurveTo(200, 200, 400, 232);
  ctx.quadraticCurveTo(500, 248, 560, 230);
  ctx.lineTo(560, 360);
  ctx.lineTo(0, 360);
  ctx.closePath();
  ctx.fill();
  // Seeded grass tufts.
  ctx.strokeStyle = '#4a7a3a';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 60; i += 1) {
    const x = range(random, 6, 554);
    const y = range(random, 240, 352);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 3, y - 7);
    ctx.moveTo(x, y);
    ctx.lineTo(x + 3, y - 8);
    ctx.stroke();
  }
}

function drawFence(ctx) {
  ctx.fillStyle = '#b08a5a';
  ctx.fillRect(0, 218, 560, 8);
  ctx.fillRect(0, 240, 560, 8);
  ctx.fillStyle = '#c8a06a';
  for (let x = 14; x < 560; x += 34) {
    ctx.beginPath();
    ctx.moveTo(x, 206);
    ctx.lineTo(x + 8, 200);
    ctx.lineTo(x + 16, 206);
    ctx.lineTo(x + 16, 256);
    ctx.lineTo(x, 256);
    ctx.closePath();
    ctx.fill();
  }
}

function drawTree(ctx, random) {
  // A round apple tree on the right, behind the birdhouse pole.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(486, 150, 16, 110);
  ctx.fillStyle = '#4a8a3a';
  circle(ctx, 494, 128, 46);
  circle(ctx, 458, 148, 32);
  circle(ctx, 530, 148, 32);
  ctx.fillStyle = '#3a7a2e';
  circle(ctx, 494, 108, 30);
  ctx.fillStyle = '#d83a3a';
  for (let i = 0; i < 7; i += 1) {
    circle(ctx, range(random, 452, 536), range(random, 96, 162), 4);
  }
}

function drawBirdhouse(ctx, applied) {
  ctx.fillStyle = '#8a6b46';
  ctx.fillRect(498, 168, 6, 92);
  ctx.fillStyle = '#c8a06a';
  roundRect(ctx, 480, 158, 42, 34, 3);
  ctx.fillStyle = applied.has('roof-color') ? '#3a8a5a' : '#c0392b';
  polygon(ctx, [[476, 160], [501, 142], [526, 160]]);
  ctx.fillStyle = '#33222e';
  circle(ctx, 501, 176, 6);
  ctx.fillStyle = '#8a6b46';
  ctx.fillRect(496, 184, 10, 4);
}

function drawFlowerBeds(ctx, random, applied) {
  // Two beds of foxgloves and tulips along the bottom.
  drawFoxglove(ctx, 90, 300, '#b06ab0');
  drawFoxglove(ctx, 130, 312, '#c06ab0');
  drawFoxglove(ctx, 210, 306, '#b06ab0');
  drawFoxglove(ctx, 250, 318, '#d06ab0');
  drawTulip(ctx, 330, 300, '#e8a83a');
  drawTulip(ctx, 356, 296, applied.has('tulip-color') ? '#ffd23d' : '#d83a3a');
  drawTulip(ctx, 382, 302, '#e8a83a');
  drawTulip(ctx, 300, 318, '#d83a3a');
  // Seeded daisies scattered on the lawn.
  for (let i = 0; i < 14; i += 1) {
    const x = range(random, 20, 540);
    const y = range(random, 258, 340);
    ctx.fillStyle = '#ffffff';
    for (let p = 0; p < 5; p += 1) {
      const a = (p / 5) * Math.PI * 2;
      circle(ctx, x + Math.cos(a) * 4, y + Math.sin(a) * 4, 2.5);
    }
    ctx.fillStyle = '#ffd23d';
    circle(ctx, x, y, 3);
  }
}

function drawFoxglove(ctx, x, y, color) {
  ctx.strokeStyle = '#3a7a2e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 34);
  ctx.stroke();
  ctx.fillStyle = color;
  for (let i = 0; i < 4; i += 1) {
    ellipse(ctx, x + (i % 2 === 0 ? -5 : 5), y - 30 + i * 8, 5, 7);
  }
  circle(ctx, x, y - 36, 5);
}

function drawTulip(ctx, x, y, color) {
  ctx.strokeStyle = '#3a7a2e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 26);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 8, y - 26);
  ctx.quadraticCurveTo(x - 8, y - 40, x, y - 34);
  ctx.quadraticCurveTo(x + 8, y - 40, x + 8, y - 26);
  ctx.closePath();
  ctx.fill();
}

function drawFox(ctx, applied) {
  // A red fox sitting by the flower bed, facing right.
  ctx.fillStyle = '#d86a2a';
  ellipse(ctx, 128, 306, 42, 26);
  ellipse(ctx, 152, 272, 20, 24);
  polygon(ctx, [[138, 256], [142, 234], [152, 254]]);
  polygon(ctx, [[158, 254], [166, 234], [168, 256]]);
  ctx.fillStyle = '#f2ead8';
  ellipse(ctx, 152, 282, 12, 14);
  ellipse(ctx, 158, 296, 14, 10);
  // The tail, curled around its paws: white-tipped, or all orange.
  ctx.fillStyle = '#d86a2a';
  ctx.beginPath();
  ctx.moveTo(92, 312);
  ctx.quadraticCurveTo(150, 330, 176, 306);
  ctx.quadraticCurveTo(182, 296, 172, 290);
  ctx.quadraticCurveTo(150, 312, 96, 300);
  ctx.closePath();
  ctx.fill();
  if (!applied.has('fox-tail')) {
    ctx.fillStyle = '#f2ead8';
    ellipse(ctx, 172, 296, 10, 7);
  }
  ctx.fillStyle = '#33222e';
  circle(ctx, 164, 268, 2.5);
  ctx.fillStyle = '#1c2438';
  circle(ctx, 172, 276, 3);
  // Front paws.
  ctx.fillStyle = '#b8541f';
  roundRect(ctx, 132, 322, 10, 10, 3);
  roundRect(ctx, 146, 322, 10, 10, 3);
}

function drawButterfly(ctx, applied) {
  if (applied.has('butterfly-absent')) return;
  const x = 300;
  const y = 176;
  ctx.fillStyle = '#7a5ad8';
  ellipse(ctx, x - 8, y - 4, 9, 6);
  ellipse(ctx, x + 8, y - 4, 9, 6);
  ellipse(ctx, x - 6, y + 7, 6, 5);
  ellipse(ctx, x + 6, y + 7, 6, 5);
  ctx.fillStyle = '#ffd23d';
  circle(ctx, x - 8, y - 4, 2);
  circle(ctx, x + 8, y - 4, 2);
  ctx.strokeStyle = '#33222e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 8);
  ctx.lineTo(x, y + 10);
  ctx.stroke();
}

function drawBee(ctx, applied) {
  if (applied.has('bee-absent')) return;
  const x = 246;
  const y = 214;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ellipse(ctx, x - 2, y - 8, 7, 4);
  ellipse(ctx, x + 5, y - 8, 7, 4);
  ctx.fillStyle = '#ffd23d';
  ellipse(ctx, x, y, 8, 6);
  ctx.strokeStyle = '#33222e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 3, y - 5);
  ctx.lineTo(x - 3, y + 5);
  ctx.moveTo(x + 2, y - 5);
  ctx.lineTo(x + 2, y + 5);
  ctx.stroke();
}

function drawWateringCan(ctx, applied) {
  if (applied.has('can-absent')) return;
  const x = 448;
  const y = 300;
  ctx.fillStyle = '#5a8a9a';
  roundRect(ctx, x - 14, y - 18, 30, 28, 4);
  ctx.fillStyle = '#4a7a8a';
  polygon(ctx, [[x + 16, y - 12], [x + 30, y - 22], [x + 30, y - 14], [x + 16, y - 4]]);
  ctx.fillStyle = '#3a6a7a';
  circle(ctx, x + 32, y - 20, 5);
  ctx.strokeStyle = '#4a7a8a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x - 14, y - 4, 10, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  // A few drops falling from the spout.
  ctx.fillStyle = '#9fd8e8';
  circle(ctx, x + 34, y - 10, 2);
  circle(ctx, x + 38, y - 2, 2);
}
