// ============================================================
// SONS — Web Audio API para efeitos sonoros estilo Duolingo
// ============================================================

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function tone(freq: number, start: number, duration: number, vol = 0.3, type: OscillatorType = "sine") {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration);
}

export function playCorrect() {
  try {
    const t = getCtx().currentTime;
    tone(523.25, t, 0.15, 0.25);
    tone(659.25, t + 0.1, 0.15, 0.25);
    tone(783.99, t + 0.2, 0.2, 0.2);
  } catch {}
}

export function playWrong() {
  try {
    const t = getCtx().currentTime;
    tone(330, t, 0.2, 0.2, "triangle");
    tone(262, t + 0.15, 0.3, 0.2, "triangle");
  } catch {}
}

export function playComplete() {
  try {
    const t = getCtx().currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      tone(f, t + i * 0.12, 0.35, 0.2);
    });
  } catch {}
}

export function playTick() {
  try {
    const t = getCtx().currentTime;
    tone(880, t, 0.04, 0.08);
  } catch {}
}

export function playStart() {
  try {
    const t = getCtx().currentTime;
    tone(392, t, 0.12, 0.15);
    tone(523.25, t + 0.1, 0.12, 0.15);
    tone(659.25, t + 0.2, 0.2, 0.2);
  } catch {}
}
