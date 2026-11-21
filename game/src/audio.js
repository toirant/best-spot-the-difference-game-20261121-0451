// Every sound the game makes, synthesized live with the Web Audio API:
// no sound files, no network, nothing to download. The context is created
// on the first player gesture, as browsers require.
let audioContext = null;
let muted = false;

/** Create the shared context on first use; returns null until a gesture. */
export function ensureAudio() {
  if (audioContext === null) {
    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    if (AudioContextClass) audioContext = new AudioContextClass();
  }
  if (audioContext !== null && audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
}

export function isMuted() {
  return muted;
}

export function toggleMuted() {
  muted = !muted;
  return muted;
}

function tone(frequency, startAt, duration, type, volume) {
  if (muted) return;
  const ctx = ensureAudio();
  if (ctx === null) return;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + startAt + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(ctx.currentTime + startAt);
  oscillator.stop(ctx.currentTime + startAt + duration + 0.05);
}

/** A bright two-note chime when a difference is found. */
export function playFind() {
  tone(880, 0, 0.16, 'sine', 0.22);
  tone(1318.5, 0.09, 0.28, 'sine', 0.2);
  tone(1760, 0.18, 0.3, 'triangle', 0.1);
}

/** A low buzz for a wrong click. */
export function playMiss() {
  tone(160, 0, 0.22, 'sawtooth', 0.12);
  tone(110, 0.08, 0.24, 'sawtooth', 0.1);
}

/** A soft ping when a hint lights up. */
export function playHint() {
  tone(1174.7, 0, 0.2, 'sine', 0.16);
  tone(1568, 0.12, 0.24, 'sine', 0.12);
}

/** A short tick when the clock runs under ten seconds. */
export function playTick() {
  tone(1046.5, 0, 0.07, 'square', 0.06);
}

/** A rising arpeggio when a level is cleared. */
export function playLevelClear() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((frequency, index) => tone(frequency, index * 0.11, 0.3, 'triangle', 0.18));
}

/** A longer fanfare for finishing the whole game. */
export function playWin() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
  notes.forEach((frequency, index) => tone(frequency, index * 0.13, 0.34, 'triangle', 0.18));
  tone(261.6, 0, 0.9, 'sine', 0.1);
}
