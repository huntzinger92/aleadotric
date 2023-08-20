import { RecursivePartial } from "tone/build/esm/core/util/Interface";
import {
  chromatic,
  dorian,
  minorPentatonic,
  majorPentatonic,
  majorScale,
  minorScale,
  harmonicMinor,
  octatonic,
  lydianDominant,
  wholeTone,
  stackedFifths,
  stackedFourths,
} from "./Sound.scales";
import * as Tone from "tone";

export const harmonyLookup = {
  dorian,
  minorPentatonic,
  majorPentatonic,
  majorScale,
  minorScale,
  harmonicMinor,
  octatonic,
  chromatic,
  lydianDominant,
  wholeTone,
  stackedFifths,
  stackedFourths,
};

export const harmonyColorLookup = {
  dorian: { hue: 252, light: 40, colorVariance: 25 },
  minorPentatonic: { hue: 345, light: 25, colorVariance: 10 }, // dark red
  majorPentatonic: { hue: 184, light: 35, colorVariance: 10 }, // light blue
  majorScale: { hue: 184, light: 40, colorVariance: 20 },
  minorScale: { hue: 345, light: 30, colorVariance: 20 },
  harmonicMinor: { hue: 16, light: 27, colorVariance: 25 },
  octatonic: { hue: 58, light: 37, colorVariance: 40 },
  chromatic: { hue: 165, light: 31, colorVariance: 200 },
  lydianDominant: { hue: 270, light: 45, colorVariance: 100 },
  wholeTone: { hue: 200, light: 25, colorVariance: 50 },
  stackedFifths: { hue: 100, light: 45, colorVariance: 10 },
  stackedFourths: { hue: 20, light: 25, colorVariance: 10 },
};

const createPitchMap = () => {
  // C0 = 1, C#0 = 2, etc..., B10 = 131
  const lookup: Record<string, number> = {};
  chromatic.forEach((note, index) => (lookup[note] = index));
  return lookup;
};

export const pitchMap = createPitchMap();

export const synthConfiguration: RecursivePartial<Tone.MonoSynthOptions> = {
  detune: 0,
  portamento: 0,
  envelope: {
    attack: 0.1,
    attackCurve: "linear",
    decay: 5,
    decayCurve: "exponential",
    release: 0.1,
    releaseCurve: "exponential",
    sustain: 0,
  },
  filter: {
    Q: 1,
    detune: 0,
    frequency: 150,
    gain: 0,
    rolloff: -24,
    type: "lowpass",
  },
  filterEnvelope: {
    attack: 0.001,
    attackCurve: "linear",
    decay: 0.7,
    decayCurve: "exponential",
    release: 0.8,
    releaseCurve: "exponential",
    sustain: 0.1,
    baseFrequency: 300,
    exponent: 2,
    octaves: 4,
  },
  oscillator: {
    phase: 0,
    type: "square8",
  },
};
