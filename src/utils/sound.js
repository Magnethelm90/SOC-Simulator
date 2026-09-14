// Tiny procedural sound engine built on the Web Audio API - no audio files
// needed, everything is synthesized on the fly. Kept deliberately defensive:
// audio is a nice-to-have and must never throw or block gameplay (autoplay
// restrictions, missing Web Audio support, etc. are all just silently
// ignored).

let audioCtx = null;
let enabled = true;

const getContext = () => {
  const AudioContextClass = typeof window !== 'undefined'
    ? (window.AudioContext || window.webkitAudioContext)
    : null;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const setSoundEnabled = (value) => {
  enabled = value;
};

const beep = (ctx, { freqStart, freqEnd, duration, type = 'sine', volume = 0.12, startAt = 0 }) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  const t0 = ctx.currentTime + startAt;
  osc.frequency.setValueAtTime(freqStart, t0);
  if (freqEnd && freqEnd !== freqStart) {
    osc.frequency.linearRampToValueAtTime(freqEnd, t0 + duration);
  }
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.linearRampToValueAtTime(0, t0 + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
};

const SOUND_TYPES = {
  // A new incident coming in - two short rising blips, like a pager.
  alarm: (ctx) => {
    beep(ctx, { freqStart: 440, freqEnd: 880, duration: 0.12, type: 'square', volume: 0.07 });
    beep(ctx, { freqStart: 440, freqEnd: 880, duration: 0.12, type: 'square', volume: 0.07, startAt: 0.16 });
  },
  // A cheerful two-note ascending chime.
  correct: (ctx) => {
    beep(ctx, { freqStart: 660, freqEnd: 660, duration: 0.09, type: 'sine', volume: 0.12 });
    beep(ctx, { freqStart: 880, freqEnd: 880, duration: 0.14, type: 'sine', volume: 0.12, startAt: 0.1 });
  },
  // A descending buzz.
  wrong: (ctx) => {
    beep(ctx, { freqStart: 320, freqEnd: 140, duration: 0.28, type: 'sawtooth', volume: 0.1 });
  },
  // A longer, harsher descending tone for a critical/game-over mistake.
  gameover: (ctx) => {
    beep(ctx, { freqStart: 320, freqEnd: 70, duration: 0.7, type: 'sawtooth', volume: 0.14 });
  },
  // A short, quiet tick for the last few seconds of a countdown.
  tick: (ctx) => {
    beep(ctx, { freqStart: 1000, freqEnd: 1000, duration: 0.04, type: 'square', volume: 0.05 });
  },
};

export const playSound = (type) => {
  if (!enabled) return;
  const play = SOUND_TYPES[type];
  if (!play) return;
  const ctx = getContext();
  if (!ctx) return;
  try {
    play(ctx);
  } catch {
    // Never let audio glitches break the game.
  }
};
