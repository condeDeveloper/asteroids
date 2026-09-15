// Projétil com tempo de vida
class Bullet {
  constructor(x, y, vx, vy) { this.x = x; this.y = y; this.vx = vx; this.vy = vy; this.life = BULLET_LIFE; }
  update(dt) {
    this.x += this.vx * dt; this.y += this.vy * dt;
    this.life -= dt;
    Vec.wrap(this);
  }
  get alive() { return this.life > 0; }
}
