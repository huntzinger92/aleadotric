import * as Tone from "tone";
import { synthConfiguration } from "./Sound.constants";

export const master = new Tone.Gain(0.4).toDestination();

export const compressor = new Tone.Compressor(-40, 2).connect(master);

export const filter = new Tone.Filter(1000, "lowpass", -24).connect(compressor);

export const reverb = new Tone.Reverb({
  decay: 11,
  preDelay: 0.01,
  wet: 0.5,
}).connect(filter);

/**
 * use array of monosynths when in low performance node
 *
 * this occasionally causes notes to be abruptly cut off, audible in a few use cases
 *
 * Using poly synth is better, but given the density of notes that sometimes occurs, it becomes
 * unusable on mobile
 */
export const monoSynths = [...Array(6)].map(() =>
  new Tone.MonoSynth({ ...synthConfiguration, volume: -4.5 }).connect(reverb)
);

// noticed some muted highs on polysynth, not sure why
export const polySynthHighBoost = new Tone.EQ3({
  high: 2,
  highFrequency: 10000,
}).connect(reverb);

/**
 * use polySynth when not in low performance mode for max polyphony (and cpu usage)
 */
export const polySynth = new Tone.PolySynth(
  Tone.MonoSynth,
  synthConfiguration
).connect(polySynthHighBoost);
