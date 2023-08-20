import { useCallback, useEffect, useMemo, useState } from "react";
import { SoundDot } from "./SoundDot";
import { ISketchConfigType } from "../Aleadotric/Aleadotric";
import { getNotesAndColor, setupSound, teardownSound } from "./Sound.utils";
import { HarmonyOptions } from "../Aleadotric/Aleadotric.constants";
import { monoSynths, polySynth } from "./SoundInstances";

export interface IUseSoundProps {
  /**
   * we use a different frame rate depending on performance mode
   */
  frameRate: 30 | 60;
  /**
   * given cpu intensive animations and sound, provide flag to tweak settings for slower devices
   * defaults to true on small screen widths
   */
  highPerformanceMode: boolean;
  sketchSize: number;
  sketchConfig: ISketchConfigType;
}

/**
 * a hook for initializing sound and sound dots
 *
 * holds all of the complex logic around updating sound dots following config updates
 */
export const useSoundDots = ({
  frameRate,
  highPerformanceMode,
  sketchConfig,
  sketchSize,
}: IUseSoundProps) => {
  const [soundDots, setSoundDots] = useState<SoundDot[]>([]);

  // more gracefully handle user navigating away from the page with browser events that fade out master volume
  useEffect(() => {
    window.addEventListener("visibilitychange", () => {
      document.hidden ? teardownSound() : setupSound();
    });
    window.addEventListener("beforeunload", (e) => teardownSound(e, true));
    return () => {
      window.removeEventListener("visibilitychange", teardownSound);
      window.removeEventListener("beforeunload", teardownSound);
    };
  }, []);

  const formattedSketchConfig = useMemo(
    () => ({
      ...sketchConfig,
      density: Math.ceil(sketchConfig.density),
      range: Math.ceil(sketchConfig.range),
      speed: Math.ceil(sketchConfig.speed),
    }),
    [sketchConfig]
  );

  // dot focused config updates
  const createNewDots = useCallback(
    ({
      amountToAdd,
      harmony,
      filterFrequency,
      frameRate,
      highPerformanceMode,
      range,
      sketchSize,
      soundEnabled,
      speed,
    }: {
      amountToAdd: number;
      harmony: HarmonyOptions;
      filterFrequency: number;
      frameRate: 30 | 60;
      highPerformanceMode: boolean;
      range: number;
      sketchSize: number;
      soundEnabled: boolean;
      speed: number;
    }) => {
      const newDots: SoundDot[] = [];
      for (let i = 0; i < amountToAdd; i++) {
        // share monoSynths among dots in low performance mode
        const currentSynth = highPerformanceMode
          ? polySynth
          : monoSynths[i % monoSynths.length];
        // random number between .3 and .7, provides more "depth" in the chime texture
        const noteVelocity = (Math.random() * 4 + 3) / 10;
        const { possibleNotes, colorPalette } = getNotesAndColor({
          newHarmony: harmony,
          newRange: range,
          filterFrequency,
        });
        newDots.push(
          new SoundDot({
            sketchBorderLength: sketchSize,
            speedFactor: speed,
            possibleNotes,
            colorPalette,
            soundEnabled,
            synth: currentSynth,
            noteVelocity,
            frameRate,
          })
        );
      }
      // note we keep the previous dots when adding new ones
      setSoundDots((prev) => prev.concat(newDots));
    },
    []
  );

  const updateDots = useCallback(
    ({
      harmony,
      filterFrequency,
      frameRate,
      highPerformanceMode,
      range,
      soundDots,
      soundEnabled,
      speed,
    }: {
      harmony: HarmonyOptions;
      filterFrequency: number;
      frameRate: 30 | 60;
      highPerformanceMode: boolean;
      range: number;
      soundDots: SoundDot[];
      soundEnabled: boolean;
      speed: number;
    }) => {
      // when harmony, range, or filter freq updates, update possible notes and color of each dot
      const { possibleNotes, colorPalette } = getNotesAndColor({
        newHarmony: harmony,
        newRange: range,
        filterFrequency,
      });
      soundDots.forEach((soundDot, index) => {
        const currentSynth = highPerformanceMode
          ? polySynth
          : monoSynths[index % monoSynths.length];
        soundDot.setSoundEnabled(soundEnabled);
        soundDot.setSynth(currentSynth);
        soundDot.setNewNoteAndColorProperties({ possibleNotes, colorPalette });
        soundDot.setSpeedAndFrameRate(speed, frameRate);
      });
    },
    []
  );

  useEffect(() => {
    const { density, harmony, filterFrequency, range, soundEnabled, speed } =
      formattedSketchConfig;
    if (soundDots.length > density) {
      // remove dots
      setSoundDots((prev) => prev.slice(0, density));
    }
    updateDots({
      soundDots,
      harmony,
      filterFrequency,
      frameRate,
      highPerformanceMode,
      range,
      soundEnabled,
      speed,
    });
    if (density > soundDots.length) {
      const amountToAdd = density - soundDots.length;
      createNewDots({
        amountToAdd,
        filterFrequency,
        frameRate,
        harmony,
        highPerformanceMode,
        range,
        sketchSize,
        soundEnabled,
        speed,
      });
    }
  }, [
    createNewDots,
    frameRate,
    highPerformanceMode,
    formattedSketchConfig,
    sketchSize,
    soundDots,
    updateDots,
  ]);

  return { soundDots };
};
