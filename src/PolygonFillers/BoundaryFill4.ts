import { Color } from '../interfaces/Color';
import { PolygonFiller } from '../interfaces/PolygonFiller';
import { type Screen } from '../interfaces/Screen';
import { Point } from '../interfaces/Point';

import { DRAWING_DELAY_MS } from '../constants';
import { sleep } from '../sleep';

export class BoundaryFill4 implements PolygonFiller {
  constructor(private readonly screen: Screen) {}

  public async fillPolygon(
    x: number,
    y: number,
    boundaryColor: Color,
    fillColor: Color
  ) {
    const stack: Point[] = [];
    stack.push({ x, y });

    while (stack.length) {
      const { x, y } = stack.pop()!;

      if (!this.screen.isInBounds(x, y)) {
        continue;
      }

      this.screen.setPixel(x, y, fillColor);
      await sleep(DRAWING_DELAY_MS);

      // bottom
      if (this.screen.isInBounds(x, y + 1)) {
        const currentColor = this.screen.getPixel(x, y + 1);
        if (currentColor != boundaryColor && currentColor != fillColor) {
          stack.push({ x, y: y + 1 });
        }
      }
      // left
      if (this.screen.isInBounds(x - 1, y)) {
        const currentColor = this.screen.getPixel(x - 1, y);
        if (currentColor != boundaryColor && currentColor != fillColor) {
          stack.push({ x: x - 1, y });
        }
      }

      // top
      if (this.screen.isInBounds(x, y - 1)) {
        const currentColor = this.screen.getPixel(x, y - 1);
        if (currentColor != boundaryColor && currentColor != fillColor) {
          stack.push({ x, y: y - 1 });
        }
      }

      // right
      if (this.screen.isInBounds(x + 1, y)) {
        const currentColor = this.screen.getPixel(x + 1, y);
        if (currentColor != boundaryColor && currentColor != fillColor) {
          stack.push({ x: x + 1, y });
        }
      }
    }
  }
}
