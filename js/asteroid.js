// Asteroides com formato irregular gerado por vértices aleatórios
class Asteroid {
  constructor(x, y, size, wave = 1) {
    const cfg = AST_SIZES[size];
    this.x = x; this.y = y; this.size = size;
    this.r = cfg.r; this.pts = cfg.pts;
    const sp = cfg.speed * (0.8 + Math.random() * 0.6) * (1 + (wave - 1) * 0.08);
    const a = Math.random() * Math.PI * 2;
    this.vx = Math.cos(a) * sp; this.vy = Math.sin(a) * sp;
    this.rot = 0; this.rotSpeed = Vec.rand(-1.2, 1.2);
    const n = 9 + Math.floor(Math.random() * 5);
    this.shape = Array.from({ length: n }, (_, i) => ({ a: (i / n) * Math.PI * 2, k: 0.72 + Math.random() * 0.36 }));
  }

  update(dt) {
    this.x += this.vx * dt; this.y += this.vy * dt;
    this.rot += this.rotSpeed * dt;
    Vec.wrap(this, this.r);
  }

  // Divide em dois menores (ou nenhum se já era pequeno)
  split(wave) {
    const next = AST_NEXT[this.size];
    if (!next) return [];
    return [new Asteroid(this.x, this.y, next, wave), new Asteroid(this.x, this.y, next, wave)];
  }

  points() {
    return this.shape.map(s => ({ x: this.x + Math.cos(s.a + this.rot) * this.r * s.k, y: this.y + Math.sin(s.a + this.rot) * this.r * s.k }));
  }
}
