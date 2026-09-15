// Estados, regras e loop
class Game {
  constructor() {
    this.ctx = document.getElementById('game').getContext('2d');
    this.overlayEl = document.getElementById('overlay');
    this.best = Number(localStorage.getItem('asteroids-best') || 0);
    this.ship = new Ship();
    this.particles = new Particles();
    this.state = 'ready';
    this.firing = false;
    this.newGame();
    bindInput(this);
    this.last = performance.now();
    requestAnimationFrame(t => this.loop(t));
  }

  newGame() {
    this.score = 0; this.lives = LIVES; this.wave = 1; this.nextExtra = EXTRA_LIFE_EVERY;
    this.bullets = []; this.respawn = 0;
    this.ship.reset();
    this.spawnWave();
  }

  spawnWave() {
    this.asteroids = [];
    const n = START_ASTEROIDS + Math.min(this.wave - 1, 7);
    for (let i = 0; i < n; i++) {
      const p = Vec.spawnPoint(this.ship, 200);
      this.asteroids.push(new Asteroid(p.x, p.y, 'large', this.wave));
    }
  }

  onAny() {
    if (this.state === 'ready') this.start();
    else if (this.state === 'over') { this.newGame(); this.start(); }
    else if (this.state === 'paused') this.start();
  }
  start() { this.state = 'playing'; this.overlayEl.classList.add('hidden'); }
  togglePause() {
    if (this.state === 'playing') { this.state = 'paused'; Sound.thrust(false); this.overlay('PAUSA', 'Toque ou pressione uma tecla para continuar'); }
    else this.onAny();
  }

  hyperspace() {
    if (this.ship.hyperspace()) Sound.hyper();
  }

  update(dt) {
    const s = this.ship;
    s.update(dt);
    Sound.thrust(s.thrusting && !s.dead);
    Sound.heartbeat(dt, this.wave);
    this.particles.update(dt);

    if (this.firing && s.canFire() && this.bullets.length < MAX_BULLETS) { this.bullets.push(s.fire()); Sound.fire(); }

    for (const b of this.bullets) b.update(dt);
    this.bullets = this.bullets.filter(b => b.alive);
    for (const a of this.asteroids) a.update(dt);

    // tiros x asteroides
    const spawned = [];
    for (const b of this.bullets) {
      for (const a of this.asteroids) {
        if (a.dead || !Vec.hit(b, 1, a, a.r * 0.9)) continue;
        a.dead = true; b.life = 0;
        this.addScore(a.pts);
        this.particles.burst(a.x, a.y, a.size === 'large' ? 14 : 8);
        Sound.explode(a.size);
        spawned.push(...a.split(this.wave));
        break;
      }
    }
    this.asteroids = this.asteroids.filter(a => !a.dead).concat(spawned);
    this.bullets = this.bullets.filter(b => b.alive);

    // nave x asteroides
    if (!s.dead && s.invuln <= 0) {
      for (const a of this.asteroids) {
        if (Vec.hit(s, SHIP_R * 0.8, a, a.r * 0.85)) { this.die(); break; }
      }
    }

    // renascer
    if (s.dead) {
      this.respawn -= dt;
      if (this.respawn <= 0) {
        if (this.lives <= 0) return this.gameOver();
        s.reset();
        // garante área livre no centro
        this.asteroids = this.asteroids.filter(a => Vec.dist(a, s) > a.r + 60 || (a.x += 160, true));
      }
    }

    if (this.asteroids.length === 0) { this.wave++; this.spawnWave(); }
  }

  addScore(pts) {
    this.score += pts;
    if (this.score >= this.nextExtra) { this.lives++; this.nextExtra += EXTRA_LIFE_EVERY; Sound.extra(); }
    if (this.score > this.best) { this.best = this.score; localStorage.setItem('asteroids-best', this.best); }
  }

  die() {
    const s = this.ship;
    this.particles.shipDebris(s.points());
    Sound.die(); Sound.thrust(false);
    s.dead = true; s.thrusting = false;
    this.lives--;
    this.respawn = RESPAWN_DELAY;
  }

  gameOver() {
    this.state = 'over';
    this.overlay('GAME OVER', `<span class="big">${this.score}</span><br>Onda ${this.wave} · Toque para jogar de novo`);
  }

  loop(now) {
    const dt = Math.min(0.033, (now - this.last) / 1000);
    this.last = now;
    if (this.state === 'playing') this.update(dt);
    drawScene(this.ctx, this, now);
    requestAnimationFrame(t => this.loop(t));
  }

  overlay(title, html) {
    this.overlayEl.innerHTML = `<h1>${title}</h1><p>${html}</p>`;
    this.overlayEl.classList.remove('hidden');
  }
}

window.addEventListener('DOMContentLoaded', () => { window.game = new Game(); });
