import { inject, injectable } from 'tsyringe';
import { Color } from '../interfaces/Color';
import { TYPES } from '../interfaces/ioc/types';
import { PolygonFiller } from '../interfaces/PolygonFiller';
import { type Screen } from '../interfaces/Screen';
import { Point } from '../interfaces/Point';
import { DRAWING_DELAY_MS } from '../constants';
import { sleep } from '../sleep';

@injectable()
export class BoundaryFill4 implements PolygonFiller {
  constructor(@inject(TYPES.SCREEN) private readonly screen: Screen) {}

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

      this.screen.setPixel(x, y, fillColor);
      await sleep(DRAWING_DELAY_MS);

      // bottom
      let currentColor = this.screen.getPixel(x, y + 1);
      if (currentColor != boundaryColor && currentColor != fillColor) {
        stack.push({ x, y: y + 1 });
      }
      // left
      currentColor = this.screen.getPixel(x - 1, y);
      if (currentColor != boundaryColor && currentColor != fillColor) {
        stack.push({ x: x - 1, y });
      }
      // top
      currentColor = this.screen.getPixel(x, y - 1);
      if (currentColor != boundaryColor && currentColor != fillColor) {
        stack.push({ x, y: y - 1 });
      }
      // right
      currentColor = this.screen.getPixel(x + 1, y);
      if (currentColor != boundaryColor && currentColor != fillColor) {
        stack.push({ x: x + 1, y });
      }
    }
  }
}
