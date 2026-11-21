// Clockwork Attic, level 3: a clockmaker's attic at night, the hardest
// set. A cat sleeps on the rug under the ticking wall clock while the
// lamp burns. Seven things change on the right panel; the cobwebs,
// gears and books stay put unless a difference moves them.
import { circle, ellipse, polygon, roundRect, verticalGradient } from '../draw.js';
import { makeRandom, range } from '../random.js';

const SEED = 424242;

export const atticScene = {
  id: 'attic',
  name: 'Clockwork Attic',
  blurb: 'Night in the clockmaker’s attic. Seven things changed on the right.',
  differences: [
    { id: 'clock-hands', label: 'the clock hands moved', x: 280, y: 108, r: 34 },
    { id: 'cat-eyes', label: 'the cat opened its eyes', x: 245, y: 294, r: 24 },
    { id: 'book-color', label: 'a book spine changed colour', x: 445, y: 177, r: 22 },
    { id: 'lamp-off', label: 'the lamp went out', x: 96, y: 230, r: 30 },
    { id: 'gear-absent', label: 'a small gear is gone', x: 370, y: 66, r: 22 },
    { id: 'steam-absent', label: 'the teapot stopped steaming', x: 515, y: 212, r: 22 },
    { id: 'cobweb-absent', label: 'the cobweb is gone', x: 44, y: 44, r: 30 },
  ],

  draw(ctx, applied) {
    const random = makeRandom(SEED);
    drawRoom(ctx, random);
    drawWindow(ctx);
    drawClock(ctx, applied);
    drawGears(ctx, applied);
    drawShelf(ctx, applied);
    drawTable(ctx, applied);
    drawLamp(ctx, applied);
    drawRugAndCat(ctx, applied);
    drawCobweb(ctx, applied);
  },
};

function drawRoom(ctx, random) {
  ctx.fillStyle = verticalGradient(ctx, '#4a3626', '#2e2118', 360);
  ctx.fillRect(0, 0, 560, 360);
  // Floorboards.
  ctx.fillStyle = '#5d4630';
  ctx.fillRect(0, 296, 560, 64);
  ctx.strokeStyle = '#3a2c1c';
  ctx.lineWidth = 2;
  for (let y = 308; y < 360; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(560, y);
    ctx.stroke();
  }
  for (let i = 0; i < 8; i += 1) {
    const x = range(random, 30, 530);
    ctx.beginPath();
    ctx.moveTo(x, 296);
    ctx.lineTo(x, 360);
    ctx.stroke();
  }
  // Wall planks.
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
  for (let x = 56; x < 560; x += 56) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 296);
    ctx.stroke();
  }
}

function drawWindow(ctx) {
  // A round window with the moon in it, top right.
  ctx.fillStyle = '#8a6b46';
  circle(ctx, 452, 96, 42);
  ctx.fillStyle = '#16203a';
  circle(ctx, 452, 96, 34);
  ctx.fillStyle = '#ffeec2';
  circle(ctx, 444, 88, 13);
  ctx.fillStyle = '#e8cf9a';
  circle(ctx, 440, 84, 3);
  ctx.fillStyle = '#fff6d8';
  circle(ctx, 464, 104, 1.8);
  circle(ctx, 468, 82, 1.5);
  ctx.strokeStyle = '#8a6b46';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(418, 96);
  ctx.lineTo(486, 96);
  ctx.moveTo(452, 62);
  ctx.lineTo(452, 130);
  ctx.stroke();
}

function drawClock(ctx, applied) {
  const cx = 280;
  const cy = 108;
  ctx.fillStyle = '#8a6b46';
  circle(ctx, cx, cy, 52);
  ctx.fillStyle = '#f2ead8';
  circle(ctx, cx, cy, 46);
  ctx.fillStyle = '#33222e';
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    circle(ctx, cx + Math.sin(a) * 38, cy - Math.cos(a) * 38, i % 3 === 0 ? 3 : 1.8);
  }
  // Hands: three o'clock, or half past four when the difference applies.
  const hourAngle = applied.has('clock-hands') ? Math.PI * 0.75 : Math.PI / 2;
  const minuteAngle = applied.has('clock-hands') ? Math.PI : 0;
  ctx.strokeStyle = '#33222e';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.sin(hourAngle) * 22, cy - Math.cos(hourAngle) * 22);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.sin(minuteAngle) * 32, cy - Math.cos(minuteAngle) * 32);
  ctx.stroke();
  ctx.fillStyle = '#c0392b';
  circle(ctx, cx, cy, 4);
  // The pendulum case below the dial.
  ctx.fillStyle = '#8a6b46';
  roundRect(ctx, cx - 22, cy + 52, 44, 62, 6);
  ctx.fillStyle = '#2e2118';
  roundRect(ctx, cx - 15, cy + 58, 30, 50, 4);
  ctx.strokeStyle = '#c8a06a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy + 58);
  ctx.lineTo(cx, cy + 96);
  ctx.stroke();
  ctx.fillStyle = '#ffd98a';
  circle(ctx, cx, cy + 100, 7);
}

function drawGears(ctx, applied) {
  drawGear(ctx, 150, 92, 26, '#b08a3a', 8, 0);
  drawGear(ctx, 196, 128, 18, '#8a8a9a', 7, 0.4);
  if (!applied.has('gear-absent')) drawGear(ctx, 370, 66, 16, '#b08a3a', 7, 0.5);
  drawGear(ctx, 512, 150, 20, '#b08a3a', 8, 0.9);
  drawGear(ctx, 96, 150, 15, '#8a8a9a', 6, 0.2);
  // A spare gear leaning on the floor.
  drawGear(ctx, 380, 322, 22, '#8a8a9a', 8, 0.6);
}

function drawGear(ctx, x, y, radius, color, teeth, rotation) {
  if (radius <= 0) return;
  ctx.fillStyle = color;
  for (let i = 0; i < teeth; i += 1) {
    const a = rotation + (i / teeth) * Math.PI * 2;
    const tx = x + Math.cos(a) * (radius + 5);
    const ty = y + Math.sin(a) * (radius + 5);
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(a);
    ctx.fillRect(-4, -4, 8, 8);
    ctx.restore();
  }
  circle(ctx, x, y, radius);
  ctx.fillStyle = '#2e2118';
  circle(ctx, x, y, radius * 0.35);
  ctx.fillStyle = color;
  circle(ctx, x, y, radius * 0.16);
}

function drawShelf(ctx, applied) {
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(380, 196, 160, 10);
  ctx.fillRect(384, 206, 8, 40);
  ctx.fillRect(528, 206, 8, 40);
  const spines = ['#c0392b', '#3a6fd8', '#3a8a5a', '#d8a83a', '#7a5ad8'];
  let x = 392;
  for (let i = 0; i < 5; i += 1) {
    const color = i === 2 && applied.has('book-color') ? '#d83a3a' : spines[i];
    ctx.fillStyle = color;
    ctx.fillRect(x, 158, 18, 38);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(x + 2, 164, 14, 3);
    x += 22;
  }
  // A leaning book at the end of the row.
  ctx.save();
  ctx.translate(508, 196);
  ctx.rotate(-0.22);
  ctx.fillStyle = '#8a5a3a';
  ctx.fillRect(-9, -38, 18, 38);
  ctx.restore();
}

function drawTable(ctx, applied) {
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(440, 252, 120, 10);
  ctx.fillStyle = '#4a3018';
  ctx.fillRect(448, 262, 8, 34);
  ctx.fillRect(544, 262, 8, 34);
  // The teapot, steaming or not.
  ctx.fillStyle = '#3a6fd8';
  ellipse(ctx, 516, 240, 20, 12);
  ctx.fillStyle = '#2e5aa8';
  polygon(ctx, [[500, 232], [492, 240], [500, 244]]);
  ctx.strokeStyle = '#2e5aa8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(536, 238, 8, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.fillStyle = '#2e5aa8';
  circle(ctx, 516, 226, 4);
  if (!applied.has('steam-absent')) {
    ctx.strokeStyle = 'rgba(230, 240, 245, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(510, 220);
    ctx.quadraticCurveTo(506, 210, 512, 202);
    ctx.moveTo(520, 220);
    ctx.quadraticCurveTo(524, 210, 518, 200);
    ctx.stroke();
  }
}

function drawLamp(ctx, applied) {
  const lit = !applied.has('lamp-off');
  // A pool of light on the floor when the lamp burns.
  if (lit) {
    ctx.fillStyle = 'rgba(255, 226, 122, 0.10)';
    polygon(ctx, [[96, 216], [30, 300], [170, 300]]);
  }
  ctx.fillStyle = '#33222e';
  ctx.fillRect(92, 296, 8, 8);
  ctx.fillStyle = '#8a6b46';
  ctx.fillRect(94, 246, 4, 50);
  ctx.fillStyle = lit ? '#ffe27a' : '#4a4038';
  polygon(ctx, [[78, 246], [114, 246], [106, 214], [86, 214]]);
  ctx.fillStyle = '#33222e';
  ctx.fillRect(90, 210, 12, 5);
  if (lit) {
    ctx.fillStyle = 'rgba(255, 226, 122, 0.22)';
    circle(ctx, 96, 230, 26);
  }
}

function drawRugAndCat(ctx, applied) {
  ctx.fillStyle = '#7a3a3a';
  ellipse(ctx, 240, 322, 110, 20);
  ctx.strokeStyle = '#c8a06a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(240, 322, 92, 14, 0, 0, Math.PI * 2);
  ctx.stroke();
  // A grey cat curled on the rug, asleep or awake.
  ctx.fillStyle = '#8a8a9a';
  ellipse(ctx, 226, 312, 34, 15);
  ellipse(ctx, 246, 296, 16, 13);
  polygon(ctx, [[236, 288], [239, 274], [246, 286]]);
  polygon(ctx, [[250, 286], [256, 274], [258, 288]]);
  ctx.fillStyle = '#6a6a7a';
  ellipse(ctx, 200, 318, 18, 7);
  if (applied.has('cat-eyes')) {
    ctx.fillStyle = '#ffd23d';
    circle(ctx, 240, 294, 2.5);
    circle(ctx, 250, 294, 2.5);
    ctx.fillStyle = '#1c2438';
    circle(ctx, 240, 294, 1.2);
    circle(ctx, 250, 294, 1.2);
  } else {
    ctx.strokeStyle = '#33222e';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(240, 294, 4, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(250, 294, 4, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  ctx.fillStyle = '#d86a8a';
  polygon(ctx, [[252, 300], [256, 300], [254, 303]]);
}

function drawCobweb(ctx, applied) {
  if (applied.has('cobweb-absent')) return;
  ctx.strokeStyle = 'rgba(230, 230, 240, 0.55)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 4) * (Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * 76, Math.sin(angle) * 76);
    ctx.stroke();
  }
  for (let ring = 1; ring <= 3; ring += 1) {
    ctx.beginPath();
    for (let i = 0; i <= 4; i += 1) {
      const angle = (i / 4) * (Math.PI / 2);
      const r = ring * 19;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.quadraticCurveTo(Math.cos(angle - Math.PI / 8) * (r - 4), Math.sin(angle - Math.PI / 8) * (r - 4), x, y);
    }
    ctx.stroke();
  }
}
