import * as Tone from "tone";
import p5Types from "p5";
import { pitchMap } from "./Sound.constants";
import { BorderTouchAnimation } from "./BorderTouchAnimation";

/**
 * each "sound dot" rendered to the canvas
 */
export class SoundDot {
  // sound stuff
  synth: Tone.MonoSynth | Tone.PolySynth<Tone.MonoSynth>;
  noteVelocity: number;
  /**
   * in the form of C4, D4, E4, etc.
   */
  possibleNotes: string[];
  note: string;
  // positional and directional stuff
  xPosition: number;
  yPosition: number;
  speedFactor: number;
  xSpeed: number;
  ySpeed: number;
  /**
   * whether or not dot is increasing in x dimension
   */
  increasingX = Math.random() > 0.5;
  /**
   * whether or not dot is increasing in y dimension
   */
  increasingY = Math.random() > 0.5;
  circleDiameter: number;
  /**
   * note: assumptions are made about canvas being a square with all sides equal
   */
  sketchBorderLength: number;
  numberOfBorderEvents = 0;
  // color stuff
  hue: number;
  colorVariance: number;
  saturation: number;
  defaultLightAmount: number;
  /**
   * this variable is responsible for the "lightening" event that happens on border touch
   */
  currentLightAmount: number;
  soundEnabled: boolean;
  /**
   * every time dot touches border, a new border animation is added, then removed when it "dies" (see BorderTouchAnimation class)
   */
  borderAnimationSystems: BorderTouchAnimation[] = [];
  frameRate: 30 | 60;

  constructor({
    frameRate,
    sketchBorderLength,
    speedFactor,
    possibleNotes,
    colorPalette: { hue, light, colorVariance },
    soundEnabled,
    synth,
    noteVelocity,
  }: {
    frameRate: 30 | 60;
    sketchBorderLength: number;
    speedFactor: number;
    possibleNotes: string[];
    colorPalette: { hue: number; light: number; colorVariance: number };
    soundEnabled: boolean;
    synth: Tone.MonoSynth | Tone.PolySynth<Tone.MonoSynth>;
    noteVelocity: number;
  }) {
    // positional and directional stuff
    this.sketchBorderLength = sketchBorderLength;
    this.speedFactor = speedFactor;
    this.frameRate = frameRate;
    this.xPosition = Math.random() * (sketchBorderLength - 5);
    this.yPosition = Math.random() * (sketchBorderLength - 5);
    this.xSpeed = Math.random() * 2 + (speedFactor * 30) / this.frameRate;
    this.ySpeed = Math.random() * 2 + (speedFactor * 30) / this.frameRate;
    this.increasingX = Math.random() > 0.5;
    this.increasingY = Math.random() > 0.5;
    // sound stuff
    this.soundEnabled = soundEnabled;
    this.synth = synth;
    this.noteVelocity = noteVelocity;
    this.possibleNotes = possibleNotes;
    // choose a random note from possible notes
    this.note =
      this.possibleNotes[Math.floor(Math.random() * this.possibleNotes.length)];
    // see this.setDiameter below for details on this
    const diameterCoeffienct = this.sketchBorderLength / 500;
    this.circleDiameter = Math.ceil(
      (-0.46 * pitchMap[this.note] + 70) * diameterCoeffienct
    );
    // color stuff
    // randomize hue by colorVariance property, below and above original hue
    // the more dissonant or unusual the mode, the greater the colorVariance value
    this.colorVariance = colorVariance;
    // generate random hue
    const randomHue = Math.floor(
      hue + Math.random() * this.colorVariance - this.colorVariance / 2
    );
    // bottom out hue property at 5
    const variedHue = Math.max(randomHue, 5);
    this.hue = variedHue;
    // given random note velocity, output of 25% to 90%
    this.saturation = Math.floor(8.125 * this.noteVelocity + 171.25);
    this.defaultLightAmount = light;
    this.currentLightAmount = light;
  }

  /**
   * executed when dot touches border
   */
  borderEvent() {
    // create border animation
    const newBorderAnimationSystem = new BorderTouchAnimation({
      sideLength: this.sketchBorderLength,
      circleDiameter: this.circleDiameter,
      xPosition: this.xPosition,
      yPosition: this.yPosition,
      hue: this.hue,
      saturation: this.saturation,
      // dim border animation response from original color, bottom out at lightness of 10
      light: Math.max(this.defaultLightAmount - 10, 10),
    });
    this.borderAnimationSystems.push(newBorderAnimationSystem);
    // keep track of border events
    this.numberOfBorderEvents++;
    // brighten dot on border event
    this.currentLightAmount += 20;
    // every 7 border events, change notes
    if (
      this.numberOfBorderEvents !== 0 &&
      this.numberOfBorderEvents % 7 === 0
    ) {
      this.setRandomNote();
    }
    if (this.soundEnabled) this.playSound();
  }

  /**
   * the main drawing function for the class, responsible for rendering dot to canvas
   * as well as incrementing dot position and tracking border events and direction changes
   */
  callEllipse(p5: p5Types) {
    this.runBorderAnimations(p5);
    p5.fill(this.determineColor());
    p5.ellipse(
      this.xPosition,
      this.yPosition,
      this.circleDiameter,
      this.circleDiameter
    );
    this.increasingX = this.dimensionCanIncrease(
      this.increasingX,
      this.xPosition,
      this.circleDiameter,
      this.sketchBorderLength
    );
    this.increasingY = this.dimensionCanIncrease(
      this.increasingY,
      this.yPosition,
      this.circleDiameter,
      this.sketchBorderLength
    );
    if (this.increasingX) {
      this.xPosition = this.xPosition + this.xSpeed;
    } else {
      this.xPosition = this.xPosition - this.xSpeed;
    }
    if (this.increasingY) {
      this.yPosition = this.yPosition + this.ySpeed;
    } else {
      this.yPosition = this.yPosition - this.ySpeed;
    }
  }

  /**
   * responsible for determining if dimension (x or y) can increase
   * detects and executes border events
   */
  dimensionCanIncrease = (
    isIncreasing: boolean,
    currentPosition: number,
    diameterOfCircle: number,
    canvasSize: number
  ) => {
    const canIncrease =
      isIncreasing && currentPosition <= canvasSize - diameterOfCircle / 2;
    const cannotDecrease =
      !isIncreasing && currentPosition <= diameterOfCircle / 2;
    const willIncrease = canIncrease || cannotDecrease;
    if (willIncrease !== isIncreasing) {
      this.borderEvent();
    }
    return willIncrease;
  };

  determineColor() {
    // if dot is "lightened" from border event, gradually deligthten it back down to default light amount
    if (this.currentLightAmount > this.defaultLightAmount) {
      // make delightening speed dependent on dot speed (slowest speed ~= -.4, fastest speed ~=.95)
      const delighteningSpeed =
        ((0.11 * (this.xSpeed + this.ySpeed)) / 2 + 0.18) * 2;
      this.currentLightAmount -= delighteningSpeed;
    }
    return `hsla(${this.hue}, ${this.saturation}%, ${this.currentLightAmount}%, 1)`;
  }

  playSound() {
    try {
      this.synth.triggerAttackRelease(
        this.note,
        0.65,
        undefined,
        this.noteVelocity
      );
    } catch (e) {
      // attempting to play dot on settings change will occasionally throw errors
      // a possible to do is disabling playSound on settings change for a brief instant
      // until then...
      console.error(e);
    }
  }

  /**
   * when dot hits border, handle border animation
   */
  runBorderAnimations(p5: p5Types) {
    // remove old animation systems
    this.borderAnimationSystems = this.borderAnimationSystems.filter(
      (system) => !system.isDead()
    );
    // run remaining active ones
    this.borderAnimationSystems.forEach((system) => {
      system.run(p5);
    });
  }

  setHue(newHue?: number) {
    // if we have a newHue, use original color variance
    // else, use fraction of colorVariance to let colors very gradually "drift" away from their original hue
    const variance = newHue ? this.colorVariance : this.colorVariance / 50;
    // generate random hue
    const randomHue = Math.floor(
      (newHue ?? this.hue) + Math.random() * variance - variance / 2
    );
    // bottom out at 5
    const variedHue = Math.max(5, randomHue);
    this.hue = variedHue;
  }

  /**
   * set circle diameter based on current pitch
   */
  setDiameter() {
    // make diameter dependent on pitch
    // range of note pitch integers is 1 - 131
    // when sketch canvas is 500px:
    // 40, 1 = 70
    // 40, 131 = 10
    // when sketch canvas is 250px:
    // 20, 1 = 35
    // 20, 131 = 5;
    const diameterCoeffienct = this.sketchBorderLength / 500;
    this.circleDiameter = Math.ceil(
      (-0.46 * pitchMap[this.note] + 70) * diameterCoeffienct
    );
  }

  /**
   * when user updates change possibleNotes or colorPalette, update class values
   */
  setNewNoteAndColorProperties({
    possibleNotes,
    colorPalette,
  }: {
    possibleNotes: string[];
    colorPalette: { hue: number; light: number; colorVariance: number };
  }) {
    // if incoming possible notes are different than current
    const possibleNotesAreNew =
      this.possibleNotes.join("") !== possibleNotes.join("");
    if (possibleNotesAreNew) {
      this.possibleNotes = possibleNotes;
      // choose a new note
      this.note =
        this.possibleNotes[
          Math.floor(Math.random() * this.possibleNotes.length)
        ];
      // update circle size to reflect new note
      this.setDiameter();
    }
    // update color properties of dot
    const { hue, light, colorVariance } = colorPalette;
    this.colorVariance = colorVariance;
    // given random note velocity, output of 25% to 90%
    this.saturation = Math.floor(8.125 * this.noteVelocity + 171.25);
    this.defaultLightAmount = light;
    this.currentLightAmount = light;
    this.setHue(hue);
  }

  setRandomNote() {
    this.note =
      this.possibleNotes[Math.floor(Math.random() * this.possibleNotes.length)];
    this.setDiameter();
    this.setHue();
  }

  /**
   * class setter for sound enabled toggling for user update
   */
  setSoundEnabled(newSoundEnabled: boolean) {
    if (this.soundEnabled !== newSoundEnabled) {
      this.soundEnabled = newSoundEnabled;
    }
  }

  /**
   * class setter for speed values for user update
   */
  setSpeedAndFrameRate(newSpeedFactor: number, newFrameRate: 30 | 60) {
    if (newFrameRate !== this.frameRate) {
      // update speed without changing direction of dot (like Math.random() will below)
      const oldFrameRate = this.frameRate;
      this.frameRate = newFrameRate;
      this.xSpeed = (this.xSpeed * oldFrameRate) / this.frameRate;
      this.ySpeed = (this.ySpeed * oldFrameRate) / this.frameRate;
      this.frameRate = newFrameRate;
    }
    // when speed has been changed in UI
    if (newSpeedFactor !== this.speedFactor) {
      this.speedFactor = newSpeedFactor;
      this.xSpeed =
        ((Math.random() * 2 + newSpeedFactor) * 30) / this.frameRate;
      this.ySpeed =
        ((Math.random() * 2 + newSpeedFactor) * 30) / this.frameRate;
    }
  }

  /**
   * update synth associated with sound dot (typically done on lowPerformanceMode change)
   */
  setSynth(newSynth: Tone.MonoSynth | Tone.PolySynth<Tone.MonoSynth>) {
    if (
      this.synth instanceof Tone.MonoSynth &&
      newSynth instanceof Tone.MonoSynth
    ) {
      return;
    }
    if (
      this.synth instanceof Tone.PolySynth &&
      newSynth instanceof Tone.PolySynth
    ) {
      return;
    }
    // only update synth when we need to (i.e., when switching in and out of performance mode)
    this.synth = newSynth;
  }
}
