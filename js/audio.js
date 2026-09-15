// Sons sintetizados com WebAudio
const Sound = (() => {
  let ctx, thrustNode = null, beatTimer = 0, beatLow = true;
  function ensure() { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); return ctx; }
  function tone(freq, dur, type = 'square', vol = 0.05) {
    try {
      const c = ensure(), o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + dur);
    } catch (_) {}
  }
  function noise(dur, vol = 0.1, lowpass = 800) {
    try {
      const c = ensure();
      const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const s = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter();
      s.buffer = buf; g.gain.value = vol; f.type = 'lowpass'; f.frequency.value = lowpass;
      s.connect(f).connect(g).connect(c.destination); s.start();
    } catch (_) {}
  }
  return {
    fire: () => tone(880, 0.07, 'square', 0.03),
    explode: (size) => noise(size === 'large' ? 0.5 : size === 'medium' ? 0.35 : 0.22, 0.12, size === 'large' ? 400 : 900),
    die: () => noise(1.0, 0.18, 300),
    hyper: () => [1200, 800, 400].forEach((f, i) => setTimeout(() => tone(f, 0.08, 'sine', 0.05), i * 50)),
    extra: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.12, 'square', 0.05), i * 90)),
    // batida grave alternada, acelera com a onda
    heartbeat(dt, wave) {
      beatTimer -= dt;
      if (beatTimer > 0) return;
      beatTimer = Math.max(0.35, 1.0 - wave * 0.06);
      tone(beatLow ? 55 : 65, 0.12, 'sine', 0.12);
      beatLow = !beatLow;
    },
    thrust(on) {
      try {
        const c = ensure();
        if (on && !thrustNode) {
          const buf = c.createBuffer(1, c.sampleRate, c.sampleRate);
          const d = buf.getChannelData(0);
          for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
          const s = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter();
          s.buffer = buf; s.loop = true; g.gain.value = 0.04; f.type = 'lowpass'; f.frequency.value = 250;
          s.connect(f).connect(g).connect(c.destination); s.start();
          thrustNode = s;
        } else if (!on && thrustNode) { thrustNode.stop(); thrustNode = null; }
      } catch (_) {}
    },
  };
})();
