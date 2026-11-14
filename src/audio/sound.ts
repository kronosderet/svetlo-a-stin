/**
 * Procedurální zvuk přes Web Audio API. Žádné zvukové soubory.
 * Každá pozice krystalu má tón pentatonické stupnice, takže každá
 * kombinace zní souzvučně a číslo se dá „slyšet“ jako akord.
 */
import { settings } from '../game/settings.svelte.ts';

interface Graph {
  ctx: AudioContext;
  master: GainNode;
  send: GainNode;
}

let graph: Graph | null = null;

function audio(): Graph | null {
  if (!settings.sound || typeof window === 'undefined') return null;
  if (!graph) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    let ctx: AudioContext;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);

    // Ozvěna observatoře: zpoždění se zpětnou vazbou přes dolní propust.
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.27;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.33;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1800;
    const send = ctx.createGain();
    send.gain.value = 0.32;
    send.connect(delay);
    delay.connect(lowpass);
    lowpass.connect(feedback);
    feedback.connect(delay);
    lowpass.connect(master);

    graph = { ctx, master, send };
  }
  if (graph.ctx.state === 'suspended') void graph.ctx.resume();
  return graph;
}

interface ToneOptions {
  at?: number;
  dur?: number;
  gain?: number;
  type?: OscillatorType;
  attack?: number;
}

function tone(freq: number, { at = 0, dur = 0.8, gain = 0.15, type = 'sine', attack = 0.008 }: ToneOptions = {}): void {
  const g = audio();
  if (!g) return;
  const t0 = g.ctx.currentTime + at;
  const osc = g.ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  const env = g.ctx.createGain();
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(gain, t0 + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(env);
  env.connect(g.master);
  env.connect(g.send);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

let noiseBuffer: AudioBuffer | null = null;
const NOISE_SECONDS = 3;

function noise(ctx: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * NOISE_SECONDS, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    // Hnědý šum: tlumenější a „těžší“ než bílý, zní jako kámen.
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      last = (last + 0.04 * (Math.random() * 2 - 1)) / 1.04;
      data[i] = last * 3.2;
    }
  }
  return noiseBuffer;
}

interface NoiseOptions {
  at?: number;
  dur?: number;
  gain?: number;
  freq?: number;
  q?: number;
  type?: BiquadFilterType;
  attack?: number;
  wet?: boolean;
}

function noiseBurst({
  at = 0,
  dur = 0.2,
  gain = 0.2,
  freq = 800,
  q = 0.8,
  type = 'bandpass',
  attack = 0.005,
  wet = true,
}: NoiseOptions = {}): void {
  const g = audio();
  if (!g) return;
  const t0 = g.ctx.currentTime + at;
  const src = g.ctx.createBufferSource();
  src.buffer = noise(g.ctx);
  src.playbackRate.value = 0.8 + Math.random() * 0.4;
  const filter = g.ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;
  const env = g.ctx.createGain();
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(gain, t0 + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filter);
  filter.connect(env);
  env.connect(g.master);
  if (wet) env.connect(g.send);
  // Náhodný začátek v bufferu, ale tak, aby šum nedošel před koncem.
  const span = (dur + 0.1) * 1.25;
  src.start(t0, Math.random() * Math.max(0, NOISE_SECONDS - span));
  src.stop(t0 + dur + 0.05);
}

/** Zvonivý tón: základ a dva slabší alikvóty. */
function bell(freq: number, opts: ToneOptions = {}): void {
  const gain = opts.gain ?? 0.15;
  const dur = opts.dur ?? 0.8;
  tone(freq, opts);
  tone(freq * 2.01, { ...opts, gain: gain * 0.22, dur: dur * 0.6 });
  tone(freq * 3.02, { ...opts, gain: gain * 0.07, dur: dur * 0.4 });
}

const PENTATONIC = [0, 2, 4, 7, 9];
const BASE = 261.63; // C4

export function bitFrequency(i: number): number {
  const semis = PENTATONIC[i % 5] + 12 * Math.floor(i / 5);
  return BASE * 2 ** (semis / 12);
}

/** Vytvoří AudioContext během uživatelského gesta. */
export function unlock(): void {
  audio();
}

/** Krystal dosedne do kamenného lůžka: cvaknutí a tupý úder. */
export function playStone(): void {
  noiseBurst({ dur: 0.08, gain: 0.5, freq: 1700, q: 1.4, type: 'bandpass', wet: false });
  noiseBurst({ dur: 0.16, gain: 0.35, freq: 320, q: 0.9, type: 'lowpass' });
  tone(82, { dur: 0.14, gain: 0.12 });
}

/** Skřípění otáčeného kamenného kola. */
export function playGrind(dur = 0.9): void {
  noiseBurst({ dur, gain: 0.32, freq: 240, q: 0.7, type: 'lowpass', attack: 0.12 });
  noiseBurst({ dur: dur * 0.8, gain: 0.12, freq: 900, q: 3, type: 'bandpass', attack: 0.2 });
}

/** Těžké kamenné dveře: dlouhé dunění a závěrečný úder. */
export function playDoor(): void {
  noiseBurst({ dur: 1.6, gain: 0.4, freq: 160, q: 0.7, type: 'lowpass', attack: 0.35 });
  noiseBurst({ dur: 1.3, gain: 0.1, freq: 700, q: 2.5, type: 'bandpass', attack: 0.4 });
  noiseBurst({ at: 1.45, dur: 0.4, gain: 0.45, freq: 140, q: 0.8, type: 'lowpass' });
  tone(48, { at: 1.45, dur: 0.6, gain: 0.22 });
}

/** Cvaknutí kamenného kotouče. */
export function playTick(): void {
  noiseBurst({ dur: 0.035, gain: 0.32, freq: 2600, q: 2, type: 'bandpass', wet: false });
  tone(190, { dur: 0.05, gain: 0.04, type: 'triangle' });
}

/** Dláto vyryje čárku: dva ťuky a škrábnutí. */
export function playCarve(): void {
  noiseBurst({ dur: 0.05, gain: 0.38, freq: 3200, q: 1.5, wet: false });
  noiseBurst({ at: 0.11, dur: 0.05, gain: 0.32, freq: 2800, q: 1.5, wet: false });
  noiseBurst({ at: 0.22, dur: 0.14, gain: 0.22, freq: 1500, q: 1 });
}

export function playBit(i: number, on: boolean): void {
  playStone();
  if (on) bell(bitFrequency(i), { at: 0.02, dur: 1.1, gain: 0.13 });
  else tone(bitFrequency(i) / 2, { dur: 0.3, gain: 0.05, type: 'triangle' });
}

export function playChord(mask: number, bits: number, at = 0): void {
  if (mask === 0) {
    tone(BASE / 2, { at, dur: 1.4, gain: 0.07, type: 'triangle' });
    return;
  }
  let k = 0;
  for (let i = 0; i < bits; i++) {
    if ((mask >> i) & 1) {
      bell(bitFrequency(i), { at: at + k * 0.05, dur: 1.8, gain: 0.08 });
      k++;
    }
  }
}

export function playSoft(): void {
  tone(146.83, { dur: 0.4, gain: 0.05, type: 'triangle' });
}

export function playReveal(): void {
  bell(1046.5, { dur: 1.4, gain: 0.05 });
  bell(1568, { at: 0.09, dur: 1.2, gain: 0.035 });
}

export function playChime(): void {
  [0, 2, 4].forEach((step, k) => bell(bitFrequency(step + 5), { at: k * 0.08, dur: 1.2, gain: 0.07 }));
}

export function playSolved(bits: number): void {
  const n = Math.max(bits, 3) + 3;
  tone(BASE / 2, { at: 0.25, dur: 3, gain: 0.06 });
  for (let k = 0; k < n; k++) bell(bitFrequency(k), { at: 0.25 + k * 0.09, dur: 2.2, gain: 0.07 });
}

/** Krystal přenosu dosedne do misky (nebo z ní zmizí). */
export function playSpark(on: boolean): void {
  noiseBurst({ dur: 0.03, gain: 0.25, freq: 3800, q: 2.5, wet: false });
  if (on) {
    bell(1318.5, { at: 0.01, dur: 0.6, gain: 0.05 });
    bell(1975.5, { at: 0.05, dur: 0.5, gain: 0.03 });
  } else {
    tone(659.25, { dur: 0.15, gain: 0.03, type: 'triangle' });
  }
}

/** Přijatý výsledek: světlo proteče sloupci zprava doleva. */
export function playCascade(columns: number): void {
  for (let k = 0; k < columns; k++) bell(bitFrequency(k + 2), { at: k * 0.11, dur: 1.4, gain: 0.06 });
}

/** Páka posune celou řadu: dřevo zavrže a kámen se posune. */
export function playShift(): void {
  noiseBurst({ dur: 0.07, gain: 0.3, freq: 900, q: 1.2, wet: false });
  noiseBurst({ at: 0.04, dur: 0.38, gain: 0.22, freq: 260, q: 0.7, type: 'lowpass', attack: 0.06 });
  tone(98, { at: 0.04, dur: 0.22, gain: 0.08 });
}

/** Světlo spadne přes okraj: klesající tón a dopad do tmy. */
export function playSpill(): void {
  const g = audio();
  if (!g) return;
  const t0 = g.ctx.currentTime;
  const osc = g.ctx.createOscillator();
  const env = g.ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1046.5, t0);
  osc.frequency.exponentialRampToValueAtTime(196, t0 + 0.45);
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(0.07, t0 + 0.02);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
  osc.connect(env);
  env.connect(g.master);
  env.connect(g.send);
  osc.start(t0);
  osc.stop(t0 + 0.55);
  noiseBurst({ at: 0.48, dur: 0.12, gain: 0.18, freq: 400, q: 0.8, type: 'lowpass' });
}
