import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Procedural ambient synth driven by the Web Audio API.
 * - Two oscillators (sine + saw) through a low-pass filter modulated by an LFO
 * - AnalyserNode exposes time-domain RMS amplitude in [0..1] via getAmplitude()
 * - getAmplitude is meant to be called every animation frame (e.g. inside useFrame)
 */
export default function useAudioSynth({ baseFreq = 110 } = {}) {
  const ctxRef = useRef(null);
  const gainRef = useRef(null);
  const analyserRef = useRef(null);
  const sourcesRef = useRef([]);
  const dataRef = useRef(new Uint8Array(64));
  const [playing, setPlaying] = useState(false);

  const start = useCallback(() => {
    if (ctxRef.current) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const gain = ctx.createGain();
    gain.gain.value = 0;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;

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

    // LFO sweeping the filter frequency for a slow, breathing pad
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

    // soft fade-in
    gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.8);

    ctxRef.current = ctx;
    gainRef.current = gain;
    analyserRef.current = analyser;
    sourcesRef.current = [osc1, osc2, osc3, lfo];
  }, [baseFreq]);

  const stop = useCallback(() => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    const sources = sourcesRef.current;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    setTimeout(() => {
      try {
        sources.forEach((s) => s.stop());
      } catch (_) {}
      ctx.close();
      ctxRef.current = null;
      gainRef.current = null;
      analyserRef.current = null;
      sourcesRef.current = [];
    }, 500);
  }, []);

  const toggle = useCallback(() => {
    setPlaying((p) => {
      if (p) stop();
      else start();
      return !p;
    });
  }, [start, stop]);

  // RMS amplitude in [0..1], cheap to call every frame.
  const getAmplitude = useCallback(() => {
    const an = analyserRef.current;
    if (!an) return 0;
    an.getByteFrequencyData(dataRef.current);
    const arr = dataRef.current;
    let sum = 0;
    for (let i = 0; i < arr.length; i++) sum += arr[i];
    return sum / arr.length / 255;
  }, []);

  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        try {
          sourcesRef.current.forEach((s) => s.stop());
          ctxRef.current.close();
        } catch (_) {}
      }
    };
  }, []);

  return { playing, toggle, getAmplitude };
}
