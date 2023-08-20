import { ISketchConfigType } from "./Aleadotric";

export const harmonyOptions = {
  chromatic: "Chromatic",
  dorian: "Dorian",
  harmonicMinor: "Harmonic Minor",
  lydianDominant: "Lydian Dominant",
  majorScale: "Major Scale",
  majorPentatonic: "Major Pentatonic",
  minorScale: "Minor Scale",
  minorPentatonic: "Minor Pentatonic",
  octatonic: "Octatonic",
  stackedFifths: "Stacked Fifth",
  stackedFourths: "Stacked Fourths",
  wholeTone: "Whole Tone",
};

export type HarmonyOptions = keyof typeof harmonyOptions;

export const synthOscillatorTypeOptions = {
  amsine: "Sine",
  amsquare: "Square",
  amsawtooth: "Sawtooth",
  amtriangle: "Triangle",
  pulse: "Pulse",
  pwm: "PWM",
  fmsawtooth30: "FM Sawtooth",
};

export type SynthOscillatorTypeOptions =
  keyof typeof synthOscillatorTypeOptions;

export const maxTrail = 110;
export const maxDensityHighPerformance = 9;
export const maxDensityLowPerformance = 7;
export const maxSpeedHighPerformance = 14;
export const maxSpeedLowPerformance = 13;

export interface IFavoriteSetting extends Partial<ISketchConfigType> {
  name: string;
}

export const favoritesList: IFavoriteSetting[] = [
  {
    density: 3,
    filterFrequency: 750,
    harmony: "majorPentatonic",
    range: 0,
    speed: 1,
    trail: -55,
    waveform: "amsquare",
    name: "Default",
    volume: 0.4,
  },
  {
    density: 2,
    filterFrequency: 7500,
    harmony: "chromatic",
    name: "Blaze's Two Brain Cells",
    range: 3,
    speed: 45, // easter egg - this amount significantly exceeds the speed limit imposed by the UI (just Blaze things)
    trail: -109,
    waveform: "fmsawtooth30",
    volume: 0.5,
  },
  {
    density: 10,
    filterFrequency: 7728.52350000832,
    harmony: "wholeTone",
    range: 6,
    speed: 20,
    trail: -5,
    volume: 0.5,
    waveform: "amtriangle",
    name: "Kaleidoscope",
  },
  {
    density: 8,
    filterFrequency: 500,
    harmony: "lydianDominant",
    range: 0,
    speed: 12,
    trail: -60,
    volume: 0.4,
    waveform: "amsine",
    name: "Krista",
  },
  {
    density: 12,
    filterFrequency: 424,
    harmony: "majorScale",
    range: 6,
    speed: 0.1,
    trail: -5,
    volume: 0.65,
    waveform: "pwm",
    name: "Ocean",
  },
  {
    density: 7,
    filterFrequency: 2095.024754449904,
    harmony: "harmonicMinor",
    range: 3,
    speed: 4,
    trail: -36,
    volume: 0.5,
    waveform: "fmsawtooth30",
    name: "Rough in the Diamond",
  },
  {
    density: 6,
    filterFrequency: 489.20667245748473,
    harmony: "minorScale",
    range: 0,
    soundEnabled: true,
    speed: 16,
    trail: -36,
    volume: 0.8,
    waveform: "amsawtooth",
    name: "Rust Cohle",
  },
  {
    density: 7,
    filterFrequency: 500,
    harmony: "harmonicMinor",
    name: "Shorty",
    range: 2,
    speed: 3,
    trail: -55,
    waveform: "amtriangle",
    volume: 0.65,
  },
  {
    density: 6,
    filterFrequency: 10415.385763505483,
    harmony: "chromatic",
    range: 1,
    soundEnabled: true,
    speed: 2,
    trail: -83,
    volume: 0.8,
    waveform: "amsine",
    name: "True Neutral",
  },
  {
    density: 8,
    filterFrequency: 6657.437803392279,
    harmony: "minorPentatonic",
    range: 6,
    soundEnabled: true,
    speed: 19,
    trail: -13,
    volume: 0.25,
    waveform: "pwm",
    name: "Waimea Canyon",
  },
];
