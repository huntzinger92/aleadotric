import p5Types from "p5";

/**
 * an animation for a given dot touching a border
 */
export class BorderTouchAnimation {
  xPosition: number;
  yPosition: number;
  // in units of thousandths (1000 = 1 alpha value, which is fully opaque in hsla)
  colorAlpha = 200;
  hue: number;
  saturation: number;
  circleDiameter: number;
  light: number;

  constructor({
    sideLength,
    circleDiameter,
    xPosition,
    yPosition,
    hue,
    saturation,
    light,
  }: {
    sideLength: number;
    circleDiameter: number;
    xPosition: number;
    yPosition: number;
    hue: number;
    saturation: number;
    light: number;
  }) {
    this.circleDiameter = circleDiameter;
    const circleRadius = circleDiameter / 2;
    // determine position of animation
    this.xPosition =
      xPosition <= circleRadius
        ? 0 // if we have a left x event, render animation directly on left x border
        : xPosition >= sideLength - circleRadius
        ? sideLength // else if we have a right x event, render animation directly on right  border
        : xPosition; // else, keep x position where it is (had a y border event)
    // do the same calculation for y
    this.yPosition =
      yPosition <= circleRadius
        ? 0
        : yPosition >= sideLength - circleRadius
        ? sideLength
        : yPosition;
    this.hue = hue;
    this.saturation = saturation;
    this.light = light;
  }

  /**
   * system is "dead" when color has completely faded
   */
  isDead() {
    return this.colorAlpha < 0;
  }

  run(p5: p5Types) {
    p5.noStroke();
    const amountOfEllipses = 20;
    // this ration ensures by the last ellipses, we have the same size dot as what caused the border animation
    const diameterIncrement = this.circleDiameter / amountOfEllipses;
    let diameterSize = 1;
    // draw ellipses that get successively bigger and more transparent
    for (let i = 0; i < amountOfEllipses; i++) {
      const decrementAlphaSpeed = i * 0.5;
      const currentAlpha = this.colorAlpha - decrementAlphaSpeed;
      // only draw those ellipses whose calculated alpha is greater than 0 to be performant
      if (currentAlpha > 0) {
        p5.fill(
          `hsla(${this.hue}, ${this.saturation}%, ${this.light}%, ${
            currentAlpha / 1000
          })`
        );
        p5.ellipse(this.xPosition, this.yPosition, diameterSize);
      }
      diameterSize += diameterIncrement;
    }
    // how fast the border animation fades
    this.colorAlpha -= 5;
  }
}
