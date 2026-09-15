// Teclado e botões de toque
function bindInput(g) {
  const keys = new Set();
  const apply = () => {
    g.ship.turn = (keys.has('ArrowRight') || keys.has('KeyD') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('KeyA') ? 1 : 0);
    g.ship.thrusting = keys.has('ArrowUp') || keys.has('KeyW');
    g.firing = keys.has('Space');
  };

  window.addEventListener('keydown', e => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) e.preventDefault();
    if (e.code === 'KeyP' || e.code === 'Escape') { if (!e.repeat) g.togglePause(); return; }
    if (g.state !== 'playing') { if (!e.repeat) g.onAny(); return; }
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyH') { if (!e.repeat) g.hyperspace(); return; }
    keys.add(e.code); apply();
  });
  window.addEventListener('keyup', e => { keys.delete(e.code); apply(); });
  window.addEventListener('blur', () => { keys.clear(); apply(); });

  document.querySelectorAll('#touch button').forEach(b => {
    const a = b.dataset.action;
    const set = on => {
      if (a === 'left') g.ship.turn = on ? -1 : (g.ship.turn === -1 ? 0 : g.ship.turn);
      if (a === 'right') g.ship.turn = on ? 1 : (g.ship.turn === 1 ? 0 : g.ship.turn);
      if (a === 'thrust') g.ship.thrusting = on;
      if (a === 'fire') g.firing = on;
      if (a === 'hyper' && on) g.hyperspace();
    };
    b.addEventListener('pointerdown', e => { e.preventDefault(); if (g.state !== 'playing') return g.onAny(); set(true); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, () => set(false)));
  });

  document.getElementById('overlay').addEventListener('pointerdown', e => { e.preventDefault(); g.onAny(); });
}
