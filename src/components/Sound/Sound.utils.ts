import { SynthOscillatorTypeOptions } from "../Aleadotric/Aleadotric.constants";
import { harmonyColorLookup, harmonyLookup } from "./Sound.constants";
import {
  filter,
  master,
  monoSynths,
  polySynth,
  reverb,
} from "./SoundInstances";

/**
 * generates a series of wider octave ranges, going "middle out" from 4
 */
export const createOctaves = (chosenRange: number) => {
  const octaves: number[] = [];
  const centerOctave = 4;
  for (let i = 0; i <= chosenRange; i++) {
    if (i % 2 === 0) {
      octaves.push(centerOctave + Math.ceil(i / 2));
    } else {
      octaves.push(centerOctave - Math.ceil(i / 2));
    }
  }
  return octaves.map((num) => num.toString());
};

/**
 * get notes and base color for sound dot given harmony, range, and filterFrequency
 */
export const getNotesAndColor = ({
  newHarmony,
  newRange,
  filterFrequency,
}: {
  newHarmony: keyof typeof harmonyLookup;
  newRange: number;
  filterFrequency: number;
}) => {
  const possibleHarmony = harmonyLookup[newHarmony];
  const octaves = createOctaves(newRange);
  // only include notes from specified octaves
  const possibleNotes = possibleHarmony.filter((note) =>
    octaves.some((octave) => note.indexOf(octave) >= 0)
  );
  // a range of -15 to +22 depending on filter frequency knob setting
  const adjustLightAmountFromFrequency = Math.floor(
    Math.log(filterFrequency) * 10 - 70
  );
  // do a deep copy so adjusting light doesn't affect "true" harmonyColorLookup const
  const colorPalette = { ...harmonyColorLookup[newHarmony] };
  // make lightness of color dependent on filter frequency
  colorPalette.light += adjustLightAmountFromFrequency;
  return {
    possibleNotes,
    colorPalette,
  };
};

export const updateReverbWet = (trail: number) => {
  const newReverbWet = -0.0085 * Math.abs(trail) + 0.95; // convert range of 1 - 131 into normal range
  reverb.wet.rampTo(newReverbWet, 0.5);
};

export const updateSynthWaveforms = (waveform: SynthOscillatorTypeOptions) => {
  monoSynths.forEach((synth) => synth.set({ oscillator: { type: waveform } }));
  polySynth.set({
    oscillator: {
      type: waveform,
    },
  });
};

export const updateMasterGain = (volume: number) => {
  master.gain.rampTo(volume, 0.1);
};

export const updateFilterFrequency = (filterValue: number) => {
  filter.frequency.rampTo(filterValue, 0.75);
};

/**
 * set disposeSynths to true if we want to clean up synth instances (irreversible)
 */
export const teardownSound = (_?: unknown, disposeSynths?: boolean) => {
  master.gain.rampTo(0, 0.1);
  master.disconnect();
  if (disposeSynths) {
    polySynth.dispose();
    monoSynths.forEach((synth) => synth.dispose());
  }
};

export const setupSound = () => {
  master.gain.rampTo(1, 0.5);
  master.toDestination();
};
