import { inject, injectable } from 'inversify';
import { Color } from '../interfaces/Color';
import { TYPES } from '../interfaces/ioc/types';
import { PolygonFiller } from '../interfaces/PolygonFiller';
import { type Screen } from '../interfaces/Screen';
import { Point } from '../interfaces/Point';
import { DRAWING_DELAY_MS } from '../constants';
import { sleep } from '../sleep';

@injectable()
export class BoundaryFillLine implements PolygonFiller {
  constructor(@inject(TYPES.SCREEN) private readonly screen: Screen) {}

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

    let x_max: number;
    let x_min: number;

    while (stack.length) {
      const point = stack.pop()!;
      x = point.x;
      y = point.y;
      let currentColor = this.screen.getPixel(x, y);
      while (currentColor !== boundaryColor && currentColor !== fillColor) {
        this.screen.setPixel(x, y, fillColor);
        await sleep(DRAWING_DELAY_MS);
        x++;
        currentColor = this.screen.getPixel(x, y);
      }
      x_max = x;

      x = point.x - 1;
      y = point.y;
      currentColor = this.screen.getPixel(x, y);
      while (currentColor !== boundaryColor && currentColor !== fillColor) {
        this.screen.setPixel(x, y, fillColor);
        await sleep(DRAWING_DELAY_MS);
        x--;
        currentColor = this.screen.getPixel(x, y);
      }
      x_min = x;

      this.checkNextLine(x_min, x_max, y - 1, fillColor, boundaryColor, stack);
      this.checkNextLine(x_min, x_max, y + 1, fillColor, boundaryColor, stack);
    }
  }
}
