// Utilidades de geometria
const Vec = {
  wrap(o, margin = 0) {
    if (o.x < -margin) o.x += W + margin * 2;
    if (o.x > W + margin) o.x -= W + margin * 2;
    if (o.y < -margin) o.y += H + margin * 2;
    if (o.y > H + margin) o.y -= H + margin * 2;
  },
  // Distância considerando o mundo toroidal (bordas conectadas)
  dist(a, b) {
    let dx = Math.abs(a.x - b.x), dy = Math.abs(a.y - b.y);
    dx = Math.min(dx, W - dx); dy = Math.min(dy, H - dy);
    return Math.hypot(dx, dy);
  },
  hit(a, ra, b, rb) { return this.dist(a, b) < ra + rb; },
  rand(min, max) { return min + Math.random() * (max - min); },
  // Ponto longe da nave para nascer asteroide
  spawnPoint(avoid, minDist = 180) {
    for (let i = 0; i < 30; i++) {
      const p = { x: Math.random() * W, y: Math.random() * H };
      if (!avoid || this.dist(p, avoid) > minDist) return p;
    }
    return { x: 0, y: 0 };
  },
};
