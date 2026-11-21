// Small canvas helpers shared by every scene, so the scenes read as
// "draw a hill, draw a cloud" instead of raw path arithmetic.
export function ellipse(ctx, x, y, radiusX, radiusY) {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function circle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

export function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

export function roundRectStroke(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.stroke();
}

/** A filled five-point star centred at (x, y). */
export function star(ctx, x, y, outerRadius, innerRadius, points = 5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/** A filled polygon from a flat list of [x, y] points. */
export function polygon(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

/** A soft cloud made of overlapping ellipses. */
export function cloud(ctx, x, y, scale, color) {
  ctx.fillStyle = color;
  ellipse(ctx, x, y, 34 * scale, 15 * scale);
  ellipse(ctx, x - 26 * scale, y + 6 * scale, 22 * scale, 11 * scale);
  ellipse(ctx, x + 28 * scale, y + 6 * scale, 24 * scale, 12 * scale);
  ellipse(ctx, x + 4 * scale, y - 10 * scale, 20 * scale, 12 * scale);
}

/** A vertical gradient spanning the panel, returned ready to fill with. */
export function verticalGradient(ctx, top, bottom, height) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  return gradient;
}
