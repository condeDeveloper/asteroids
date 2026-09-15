// Nave com inércia, rotação, propulsão e hiperespaço
class Ship {
  constructor() { this.reset(); }

  reset() {
    this.x = W / 2; this.y = H / 2;
    this.vx = 0; this.vy = 0;
    this.angle = -Math.PI / 2;
    this.turn = 0; this.thrusting = false;
    this.cooldown = 0;
    this.invuln = SHIP_INVULN;
    this.hyper = 0;
    this.dead = false;
  }

  update(dt) {
    if (this.dead) return;
    this.angle += this.turn * SHIP_TURN * dt;
    if (this.thrusting) {
      this.vx += Math.cos(this.angle) * SHIP_THRUST * dt;
      this.vy += Math.sin(this.angle) * SHIP_THRUST * dt;
    }
    const f = Math.pow(SHIP_FRICTION, dt * 60);
    this.vx *= f; this.vy *= f;
    const sp = Math.hypot(this.vx, this.vy);
    if (sp > SHIP_MAX) { this.vx *= SHIP_MAX / sp; this.vy *= SHIP_MAX / sp; }
    this.x += this.vx * dt; this.y += this.vy * dt;
    Vec.wrap(this, SHIP_R);
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.invuln = Math.max(0, this.invuln - dt);
    this.hyper = Math.max(0, this.hyper - dt);
  }

  canFire() { return !this.dead && this.cooldown <= 0; }
  fire() {
    this.cooldown = FIRE_COOLDOWN;
    const nx = this.x + Math.cos(this.angle) * SHIP_R, ny = this.y + Math.sin(this.angle) * SHIP_R;
    return new Bullet(nx, ny, this.vx + Math.cos(this.angle) * BULLET_SPEED, this.vy + Math.sin(this.angle) * BULLET_SPEED);
  }

  // Teleporta para um ponto aleatório, com risco e recarga
  hyperspace() {
    if (this.dead || this.hyper > 0) return false;
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.vx *= 0.2; this.vy *= 0.2;
    this.hyper = HYPER_COOLDOWN;
    this.invuln = 0.6;
    return true;
  }

  // Pontos do polígono da nave (para desenho)
  points() {
    const a = this.angle, r = SHIP_R;
    const p = (ang, k) => ({ x: this.x + Math.cos(a + ang) * r * k, y: this.y + Math.sin(a + ang) * r * k });
    return [p(0, 1.2), p(Math.PI * 0.78, 1), p(Math.PI, 0.35), p(-Math.PI * 0.78, 1)];
  }
}
