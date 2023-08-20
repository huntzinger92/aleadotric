import { useEffect, useMemo, useState } from "react";
import * as Tone from "tone";
import { SketchComponent } from "../Sketch/Sketch";
import {
  HarmonyOptions,
  SynthOscillatorTypeOptions,
} from "./Aleadotric.constants";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { harmonyColorLookup } from "../Sound/Sound.constants";
import { ControlPanel } from "./ControlPanel";
import { useSoundDots } from "../Sound/useSoundDots";
import "./Aleadotric.css";
import { DefinitionText } from "./DefinitionText";

export interface ISketchConfigType {
  /**
   * the amount of sound dots to render
   */
  density: number;
  /**
   * the frequency of the filter, in logarithmic scale
   */
  filterFrequency: number;
  /**
   * the chosen harmony to pull notes from (major, minor, chromatic, etc.)
   */
  harmony: HarmonyOptions;
  /**
   * how wide of a range the notes will be chosen from
   */
  range: number;
  /**
   * whether or not the sound is enabled (audiocontext api requires this to be set to true after user action)
   */
  soundEnabled: boolean;
  /**
   * how fast the dots move (note: individual dot speed is randomized to be around this)
   */
  speed: number;
  /**
   * how much trail each dot has (in practice, how transparent each canvas render is)
   */
  trail: number;
  /**
   * how loud the dots are, in normal range
   */
  volume: number;
  /**
   * the chosen waveform of the synth to be played (sine, square, etc.)
   */
  waveform: SynthOscillatorTypeOptions;
}

export const Aleadotric = () => {
  const theme = useTheme();
  const miniMode = useMediaQuery(theme.breakpoints.down("md"));
  const sketchSize = miniMode ? 250 : 500;

  const [highPerformanceMode, setHighPerformanceMode] = useState(false);
  const [sketchConfig, setSketchConfig] = useState<ISketchConfigType>({
    density: 3,
    filterFrequency: 750,
    harmony: "majorPentatonic",
    range: 0,
    soundEnabled: false,
    speed: 1,
    trail: -55,
    volume: 0.4,
    waveform: "amsquare",
  });

  useEffect(() => {
    const startTone = async () => {
      if (!sketchConfig.soundEnabled) {
        await Tone.start();
      }
      setSketchConfig((prev) => ({ ...prev, soundEnabled: true }));
    };
    startTone();
  }, [sketchConfig.soundEnabled]);

  const frameRate = highPerformanceMode ? 60 : 30;

  const { soundDots } = useSoundDots({
    frameRate,
    highPerformanceMode,
    sketchConfig,
    sketchSize,
  });

  // memoizing the sketch allows us to update box shadow (glow effect) without rerendering sketch component
  const memoizedSketch = useMemo(() => {
    return (
      <SketchComponent
        frameRate={frameRate}
        sketchSize={sketchSize}
        soundDots={soundDots}
        trail={Math.abs(sketchConfig.trail)}
      />
    );
  }, [frameRate, sketchConfig, sketchSize, soundDots]);

  const { hue, light } = harmonyColorLookup[sketchConfig.harmony];

  // make header color's lightness be dependent on user set filter frequency
  const colorLightFromFilterFrequency =
    7 * Math.log(sketchConfig.filterFrequency);

  const sketchContainerStyle = {
    boxShadow: `0 0 20px hsl(${hue}, 50%, ${colorLightFromFilterFrequency}%)`,
  };

  const primaryColor = `hsl(${hue}, ${light}%, ${colorLightFromFilterFrequency}%)`;
  const secondaryColor = `hsl(${
    hue + 30
  }, ${light}%, ${colorLightFromFilterFrequency}%)`;

  const header1Style = {
    color: primaryColor,
    textShadow: `0 0 26px hsl(${hue}, ${light}%, 55%), 0 0 35px hsl(${hue}, ${light}%, 35%)`,
  };

  const header2Style = {
    color: secondaryColor,
    textShadow: `0 0 26px hsl(${hue}, ${light}%, 55%), 0 0 35px hsl(${hue}, ${light}%, 35%)`,
  };

  return (
    <>
      <Box sx={{ maxWidth: "85vw" }}>
        <Typography id="sketchHeader" variant={miniMode ? "h4" : "h3"}>
          <span style={header1Style}>Alea</span>
          <span style={header2Style}>dot</span>
          <span style={header1Style}>ric</span>
        </Typography>
        <DefinitionText
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      </Box>
      <Box id="sketchAndContralPanelContainer" sx={{ maxWidth: sketchSize }}>
        <Box sx={sketchContainerStyle} id="sketchContainer">
          {memoizedSketch}
        </Box>
        <Box sx={{ maxWidth: sketchSize }}>
          <ControlPanel
            sketchConfig={sketchConfig}
            setSketchConfig={setSketchConfig}
            highPerformanceMode={highPerformanceMode}
            setHighPerformanceMode={setHighPerformanceMode}
          />
        </Box>
      </Box>
    </>
  );
};
