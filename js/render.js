// Gráficos vetoriais em linhas brancas, como no arcade
function poly(ctx, pts, close = true) {
  ctx.beginPath();
  pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
  if (close) ctx.closePath();
  ctx.stroke();
}

function drawScene(ctx, g, now) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6; ctx.lineJoin = 'round';

  // asteroides
  for (const a of g.asteroids) poly(ctx, a.points());

  // tiros
  ctx.fillStyle = '#fff';
  for (const b of g.bullets) ctx.fillRect(b.x - 1.5, b.y - 1.5, 3, 3);

  // nave (pisca quando invulnerável)
  const s = g.ship;
  if (!s.dead && (s.invuln <= 0 || Math.floor(now / 100) % 2 === 0)) {
    poly(ctx, s.points());
    if (s.thrusting && Math.floor(now / 60) % 2 === 0) {
      // chama do motor
      const a = s.angle, r = SHIP_R;
      poly(ctx, [
        { x: s.x + Math.cos(a + Math.PI * 0.85) * r * 0.6, y: s.y + Math.sin(a + Math.PI * 0.85) * r * 0.6 },
        { x: s.x - Math.cos(a) * r * 1.4, y: s.y - Math.sin(a) * r * 1.4 },
        { x: s.x + Math.cos(a - Math.PI * 0.85) * r * 0.6, y: s.y + Math.sin(a - Math.PI * 0.85) * r * 0.6 },
      ], false);
    }
  }

  g.particles.draw(ctx);

  // HUD
  ctx.fillStyle = '#fff';
  ctx.font = '22px "Courier New", monospace';
  ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText(String(g.score).padStart(6, '0'), 16, 12);
  ctx.textAlign = 'right';
  ctx.fillText(`HI ${String(g.best).padStart(6, '0')}`, W - 16, 12);
  ctx.textAlign = 'center';
  ctx.font = '14px "Courier New", monospace';
  ctx.fillText(`ONDA ${g.wave}`, W / 2, 14);

  // vidas: pequenas naves
  for (let i = 0; i < g.lives; i++) {
    const x = 26 + i * 22, y = 52;
    poly(ctx, [{ x, y: y - 9 }, { x: x + 7, y: y + 7 }, { x, y: y + 3 }, { x: x - 7, y: y + 7 }]);
  }

  // hiperespaço recarregando
  if (g.ship.hyper > 0) {
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    ctx.fillRect(W - 16 - 80, 44, 80 * (1 - g.ship.hyper / HYPER_COOLDOWN), 3);
  }
}
