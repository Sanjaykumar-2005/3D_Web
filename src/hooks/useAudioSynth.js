import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Procedural ambient synth driven by the Web Audio API.
 * Three oscillators (sine + saw + sine x2) through a low-pass filter
 * modulated by a slow LFO. Exposes per-frame RMS amplitude and a
 * setFreq() for retuning while playing.
 */
export default function useAudioSynth({ baseFreq = 110 } = {}) {
  const ctxRef = useRef(null);
  const gainRef = useRef(null);
  const analyserRef = useRef(null);
  const sourcesRef = useRef([]);
  const pitchedRef = useRef([]);
  const stopTimerRef = useRef(0);
  const dataRef = useRef(new Uint8Array(256));
  // Cache the per-frame amplitude so multiple useFrame consumers share one C++→JS copy.
  const ampCacheRef = useRef({ key: -1, value: 0 });
  const [playing, setPlaying] = useState(false);

  const start = useCallback(async () => {
    if (ctxRef.current) return;
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = 0;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    // Safari/iOS often returns a suspended context even from a user gesture.
    if (ctx.state === 'suspended') {
      try { await ctx.resume(); } catch (e) { if (import.meta.env.DEV) console.warn(e); }
    }

    const gain = ctx.createGain();
    gain.gain.value = 0;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 700;
    lp.Q.value = 4;

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = baseFreq;

    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.value = baseFreq * 1.5;

    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = baseFreq * 2;
    const osc3Gain = ctx.createGain();
    osc3Gain.gain.value = 0.4;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.18;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 350;

    lfo.connect(lfoGain).connect(lp.frequency);
    osc1.connect(lp);
    osc2.connect(lp);
    osc3.connect(osc3Gain).connect(lp);
    lp.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc3.start();
    lfo.start();

    gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.8);

    ctxRef.current = ctx;
    gainRef.current = gain;
    analyserRef.current = analyser;
    sourcesRef.current = [osc1, osc2, osc3, lfo];
    pitchedRef.current = [osc1, osc2, osc3];
  }, [baseFreq]);

  const stop = useCallback(() => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    const sources = sourcesRef.current;
    // Drop refs first so a fast restart can install a fresh context cleanly.
    ctxRef.current = null;
    gainRef.current = null;
    analyserRef.current = null;
    sourcesRef.current = [];
    pitchedRef.current = [];
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    stopTimerRef.current = setTimeout(() => {
      stopTimerRef.current = 0;
      try { sources.forEach((s) => s.stop()); } catch (e) { if (import.meta.env.DEV) console.warn(e); }
      ctx.close().catch(() => {});
    }, 500);
  }, []);

  const toggle = useCallback(() => {
    if (playing) stop(); else start();
    setPlaying((p) => !p);
  }, [playing, start, stop]);

  // Smoothly retune the pitched oscillators while playing.
  const setFreq = useCallback((freq) => {
    const ctx = ctxRef.current;
    const oscs = pitchedRef.current;
    if (!ctx || oscs.length !== 3) return;
    const t = ctx.currentTime;
    oscs[0].frequency.setTargetAtTime(freq, t, 0.08);
    oscs[1].frequency.setTargetAtTime(freq * 1.5, t, 0.08);
    oscs[2].frequency.setTargetAtTime(freq * 2, t, 0.08);
  }, []);

  const getAmplitude = useCallback(() => {
    const an = analyserRef.current;
    if (!an) return 0;
    // ~16ms bucket — all useFrame callbacks within one rAF tick share a result.
    const key = (performance.now() / 16) | 0;
    if (ampCacheRef.current.key === key) return ampCacheRef.current.value;
    an.getByteTimeDomainData(dataRef.current);
    const arr = dataRef.current;
    let sumSq = 0;
    for (let i = 0; i < arr.length; i++) {
      const v = (arr[i] - 128) / 128;
      sumSq += v * v;
    }
    const rms = Math.sqrt(sumSq / arr.length);
    ampCacheRef.current = { key, value: rms };
    return rms;
  }, []);

  useEffect(() => {
    return () => {
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current);
        stopTimerRef.current = 0;
      }
      const ctx = ctxRef.current;
      if (ctx) {
        try { sourcesRef.current.forEach((s) => s.stop()); } catch (e) { if (import.meta.env.DEV) console.warn(e); }
        ctx.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, []);

  return { playing, toggle, setFreq, getAmplitude };
}
