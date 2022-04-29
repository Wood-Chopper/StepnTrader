export function scoreToRgb(score: number, base: number) {
  let r, g: number = 0;
  let middleBase = base/2;

  if (score >= middleBase) {
    g = 255;
    r = 255 - ((score - middleBase)/middleBase * 255);
  }
  if (score < middleBase) {
    r = 255;
    g = score/middleBase * 255;
  }

  return `rgb(${r}, ${g}, 0)`;
}
