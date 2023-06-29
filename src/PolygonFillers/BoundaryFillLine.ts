import { Color } from '../interfaces/Color';
import { PolygonFiller } from '../interfaces/PolygonFiller';
import { type Screen } from '../interfaces/Screen';
import { Point } from '../interfaces/Point';

import { DRAWING_DELAY_MS } from '../constants';
import { sleep } from '../sleep';

export class BoundaryFillLine implements PolygonFiller {
  constructor(private readonly screen: Screen) {}

  checkNextLine(
    x_min: number,
    x_max: number,
    y: number,
    fillColor: Color,
    boundaryColor: Color,
    stack: Point[]
  ): void {
    let shouldBeFilled = false;
    for (let i = x_min + 1; i <= x_max; i++) {
      const currentColor = this.screen.getPixel(i, y);

      if (i === x_max && shouldBeFilled) {
        stack.push({ x: i - 1, y });
        break;
      }

      if (currentColor !== boundaryColor && currentColor !== fillColor) {
        shouldBeFilled = true;
      } else if (shouldBeFilled) {
        stack.push({ x: i - 1, y });
        shouldBeFilled = false;
      } else {
        shouldBeFilled = false;
      }
    }
  }

  public async fillPolygon(
    x: number,
    y: number,
    boundaryColor: Color,
    fillColor: Color
  ) {
    const stack: Point[] = [{ x, y }];

    while (stack.length) {
      const point = stack.pop()!;
      x = point.x;
      y = point.y;

      if (!this.screen.isInBounds(x, y)) {
        continue;
      }

      let currentColor = this.screen.getPixel(x, y);
      while (currentColor !== boundaryColor && currentColor !== fillColor) {
        this.screen.setPixel(x, y, fillColor);
        await sleep(DRAWING_DELAY_MS);
        x++;
        if (!this.screen.isInBounds(x, y)) {
          x--;
          break;
        }
        currentColor = this.screen.getPixel(x, y);
      }
      const x_max: number = x;

      x = point.x - 1;
      y = point.y;

      if (!this.screen.isInBounds(x, y)) {
        this.checkNextLine(
          point.x,
          x_max,
          y - 1,
          fillColor,
          boundaryColor,
          stack
        );
        this.checkNextLine(
          point.x,
          x_max,
          y + 1,
          fillColor,
          boundaryColor,
          stack
        );
        continue;
      }

      currentColor = this.screen.getPixel(x, y);
      while (currentColor !== boundaryColor && currentColor !== fillColor) {
        this.screen.setPixel(x, y, fillColor);
        await sleep(DRAWING_DELAY_MS);
        x--;
        if (!this.screen.isInBounds(x, y)) {
          x++;
          break;
        }
        currentColor = this.screen.getPixel(x, y);
      }
      const x_min: number = x;

      this.checkNextLine(x_min, x_max, y - 1, fillColor, boundaryColor, stack);
      this.checkNextLine(x_min, x_max, y + 1, fillColor, boundaryColor, stack);
    }
  }
}
