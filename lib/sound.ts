'use client';
// Generative ambient score + UI clicks with the Web Audio API — no audio files to ship.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let started = false;

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  return ctx;
}

function startPad() {
  if (started || !ctx || !master) return;
  started = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 900;
  filter.Q.value = 0.6;
  filter.connect(master);

  // slow filter sweep
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.05;
  lfoGain.gain.value = 420;
  lfo.connect(lfoGain).connect(filter.frequency);
  lfo.start();

  // A minor add9 voicing, gently detuned
  const notes = [110, 164.81, 220, 246.94, 329.63];
  notes.forEach((f, i) => {
    for (const detune of [-6, 6]) {
      const o = ctx!.createOscillator();
      o.type = i < 2 ? 'sine' : 'triangle';
      o.frequency.value = f;
      o.detune.value = detune;
      const g = ctx!.createGain();
      g.gain.value = 0.05 / (i + 1);
      o.connect(g).connect(filter);
      o.start();
    }
  });
}

export function setSound(on: boolean) {
  const c = ensure();
  if (on) {
    if (c.state === 'suspended') c.resume();
    startPad();
  }
  if (master) {
    const now = c.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(on ? 0.55 : 0, now, 0.6);
  }
}

export function click(enabled: boolean, freq = 880) {
  if (!enabled) return;
  const c = ensure();
  if (c.state === 'suspended') return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(freq, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(freq * 1.5, c.currentTime + 0.06);
  g.gain.setValueAtTime(0.06, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.12);
  o.connect(g).connect(c.destination);
  o.start();
  o.stop(c.currentTime + 0.13);
}
