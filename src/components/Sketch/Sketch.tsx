import Sketch from "react-p5";
import p5Types from "p5";
import { SoundDot } from "../Sound/SoundDot";

export interface ISketchComponentProps {
  /**
   * we use a different frame rate depending on performance mode
   */
  frameRate: 30 | 60;
  sketchSize: number;
  soundDots: SoundDot[];
  /**
   * the opaqueness of the canvas background (more transparent produces more visual "trail")
   */
  trail: number;
}

export const SketchComponent = ({
  frameRate,
  sketchSize,
  soundDots,
  trail,
}: ISketchComponentProps) => {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(sketchSize, sketchSize).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    // set framerate down from 60 for performance
    // note that this affects the visual speed of the dots!
    p5.frameRate(frameRate);
    p5.background(0, 0, 0, trail);
    soundDots.forEach((soundDot) => {
      soundDot.callEllipse(p5);
    });
  };

  return <Sketch setup={setup} draw={draw} style={{ display: "flex" }} />;
};
