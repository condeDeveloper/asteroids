// Fragmentos de linha para explosões e rastro do motor
class Particles {
  constructor() { this.list = []; }

  // Explosão de asteroide: pequenos traços que se afastam
  burst(x, y, n = 10, speed = 90) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = speed * (0.4 + Math.random());
      this.list.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, a, len: 4 + Math.random() * 6, life: 0.6 + Math.random() * 0.5, spin: Vec.rand(-4, 4) });
    }
  }

  // Nave destruída: os quatro segmentos se separam
  shipDebris(points) {
    for (let i = 0; i < points.length; i++) {
      const a = points[i], b = points[(i + 1) % points.length];
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      this.list.push({ x: mx, y: my, vx: Vec.rand(-40, 40), vy: Vec.rand(-40, 40), a: Math.atan2(b.y - a.y, b.x - a.x), len: Math.hypot(b.x - a.x, b.y - a.y), life: 2.2, spin: Vec.rand(-2, 2) });
    }
  }

  update(dt) {
    for (const p of this.list) { p.x += p.vx * dt; p.y += p.vy * dt; p.a += p.spin * dt; p.life -= dt; }
    this.list = this.list.filter(p => p.life > 0);
  }

  draw(ctx) {
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
    for (const p of this.list) {
      ctx.globalAlpha = Math.min(1, p.life);
      ctx.beginPath();
      ctx.moveTo(p.x - Math.cos(p.a) * p.len / 2, p.y - Math.sin(p.a) * p.len / 2);
      ctx.lineTo(p.x + Math.cos(p.a) * p.len / 2, p.y + Math.sin(p.a) * p.len / 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}
