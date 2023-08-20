import { ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  HarmonyOptions,
  SynthOscillatorTypeOptions,
  favoritesList,
  harmonyOptions,
  maxDensityHighPerformance,
  maxDensityLowPerformance,
  maxSpeedHighPerformance,
  maxSpeedLowPerformance,
  maxTrail,
  synthOscillatorTypeOptions,
} from "./Aleadotric.constants";
import {
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  MenuItem,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import * as styles from "./Aleadotric.styles";
import { ISketchConfigType } from "./Aleadotric";
import { validateSketchConfigFavorite } from "./Aleadotric.utils";
import {
  updateFilterFrequency,
  updateMasterGain,
  updateReverbWet,
  updateSynthWaveforms,
} from "../Sound/Sound.utils";

export interface IControlPanelProps {
  sketchConfig: ISketchConfigType;
  setSketchConfig: Dispatch<SetStateAction<ISketchConfigType>>;
  highPerformanceMode: boolean;
  setHighPerformanceMode: Dispatch<SetStateAction<boolean>>;
}

export const ControlPanel = ({
  sketchConfig,
  setSketchConfig,
  highPerformanceMode,
  setHighPerformanceMode,
}: IControlPanelProps) => {
  const narrowNumberOrArrayToNum = (value: number | number[]) => {
    return typeof value === "number" ? value : value[0];
  };

  const audioEffectHandlers = ({
    filterFrequency,
    trail,
    volume,
    waveform,
  }: {
    filterFrequency?: number;
    trail?: number;
    volume?: number;
    waveform?: SynthOscillatorTypeOptions;
  }) => {
    if (filterFrequency !== undefined) {
      updateFilterFrequency(filterFrequency);
    }
    if (trail !== undefined) {
      updateReverbWet(trail);
    }
    if (volume !== undefined) {
      updateMasterGain(volume);
    }
    if (waveform) {
      updateSynthWaveforms(waveform);
    }
  };

  const handleSpeed = (newSpeed: number | number[]) => {
    setSketchConfig((prev) => ({
      ...prev,
      speed: narrowNumberOrArrayToNum(newSpeed),
    }));
  };

  const handleHarmony = (e: ChangeEvent<HTMLInputElement>) => {
    const newHarmony = e.target.value as HarmonyOptions;
    setSketchConfig((prev) => ({
      ...prev,
      harmony: newHarmony,
    }));
  };

  const handleWaveform = (e: ChangeEvent<HTMLInputElement>) => {
    const newWaveform = e.target.value as SynthOscillatorTypeOptions;
    audioEffectHandlers({ waveform: newWaveform });
    setSketchConfig((prev) => ({
      ...prev,
      waveform: newWaveform,
    }));
  };

  const handleRange = (newRange: number | number[]) => {
    setSketchConfig((prev) => ({
      ...prev,
      range: narrowNumberOrArrayToNum(newRange),
    }));
  };

  const handleDensity = (newDensity: number | number[]) => {
    setSketchConfig((prev) => ({
      ...prev,
      density: narrowNumberOrArrayToNum(newDensity),
    }));
  };

  const handleVolume = async (newVolume: number | number[]) => {
    const sliderVolume = narrowNumberOrArrayToNum(newVolume);
    audioEffectHandlers({ volume: sliderVolume });
    setSketchConfig((prev) => ({
      ...prev,
      volume: sliderVolume,
      soundEnabled: true,
    }));
  };

  const handleTrail = (newTrail: number | number[]) => {
    const newTrailNumber = narrowNumberOrArrayToNum(newTrail);
    audioEffectHandlers({ trail: newTrailNumber });
    setSketchConfig((prev) => ({ ...prev, trail: newTrailNumber }));
  };

  const handleFilter = (newFilter: number | number[]) => {
    // convert linear based slider value to logarithmic frequency scale
    const logifiedFilter = 1.038 ** narrowNumberOrArrayToNum(newFilter) * 250;
    audioEffectHandlers({ filterFrequency: logifiedFilter });
    setSketchConfig((prev) => ({
      ...prev,
      filterFrequency: logifiedFilter,
    }));
  };

  const handleFavorite = async (e: ChangeEvent<HTMLInputElement>) => {
    const matchingConfig = favoritesList.find(
      (favorite) => favorite.name === e.target.value
    );
    if (matchingConfig) {
      const validatedConfig = validateSketchConfigFavorite(
        matchingConfig,
        highPerformanceMode
      );
      audioEffectHandlers(validatedConfig);
      setSketchConfig((prev) => ({
        ...prev,
        soundEnabled: true,
        ...validatedConfig,
      }));
    }
  };

  const exponentialFrequencyToLinearSliderValue =
    Math.log(sketchConfig.filterFrequency / 300) / Math.log(1.038);

  return (
    <Box sx={styles.inputsContainer}>
      <Box sx={styles.selectContainer}>
        <TextField
          select
          variant="outlined"
          defaultValue={favoritesList[0].name}
          onChange={handleFavorite}
          sx={styles.selectFirst}
          label="Favorites"
        >
          {favoritesList.map((favoriteSetting) => (
            <MenuItem key={favoriteSetting.name} value={favoriteSetting.name}>
              {favoriteSetting.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          value={sketchConfig.harmony}
          onChange={handleHarmony}
          sx={styles.select}
          label="Harmony"
        >
          {Object.entries(harmonyOptions).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          value={sketchConfig.waveform}
          onChange={handleWaveform}
          sx={styles.select}
          label="Waveform"
        >
          {Object.entries(synthOscillatorTypeOptions).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box sx={styles.inputsRow}>
        <Box sx={styles.sliderAndLabel}>
          <Typography>Density</Typography>
          <Slider
            min={1}
            max={
              !highPerformanceMode
                ? maxDensityLowPerformance
                : maxDensityHighPerformance
            }
            value={sketchConfig.density}
            onChange={(_, value) => handleDensity(value)}
          />
        </Box>
        <Box sx={styles.sliderAndLabel}>
          <Typography>Volume</Typography>
          <Slider
            step={0.01}
            min={0}
            max={0.8}
            value={sketchConfig.volume}
            onChange={(_, value) => handleVolume(value)}
          />
        </Box>
        <Box sx={styles.sliderAndLabel}>
          <Typography>Filter</Typography>
          <Slider
            min={1}
            max={100}
            value={exponentialFrequencyToLinearSliderValue}
            onChange={(_, value) => handleFilter(value)}
          />
        </Box>
        <Box sx={styles.sliderAndLabel}>
          <Typography>Speed</Typography>
          <Slider
            min={0.1}
            max={
              !highPerformanceMode
                ? maxSpeedLowPerformance
                : maxSpeedHighPerformance
            }
            value={sketchConfig.speed}
            onChange={(_, value) => handleSpeed(value)}
          />
        </Box>
        <Box sx={styles.sliderAndLabel}>
          <Typography>Range</Typography>
          <Slider
            min={0}
            max={6}
            value={sketchConfig.range}
            onChange={(_, value) => handleRange(value)}
          />
        </Box>
        <Box sx={styles.sliderAndLabel}>
          <Typography>Trail</Typography>
          <Slider
            min={maxTrail * -1}
            max={-1}
            value={sketchConfig.trail}
            onChange={(_, value) => handleTrail(value)}
          />
        </Box>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={highPerformanceMode}
                inputProps={{ "aria-label": "High Performance Mode" }}
                onChange={() => setHighPerformanceMode((prev) => !prev)}
              />
            }
            label="High Performance Mode"
          />
        </FormGroup>
      </Box>
    </Box>
  );
};
