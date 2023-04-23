import { inject, injectable } from 'inversify';
import { Color } from '../interfaces/Color';
import { TYPES } from '../interfaces/ioc/types';
import { PolygonDrawer } from '../interfaces/PolygonDrawer';
import { type Screen } from '../interfaces/Screen';
import { Point } from '../interfaces/Point';

@injectable()
export class FillByEdges implements PolygonDrawer {
  constructor(@inject(TYPES.SCREEN) private readonly screen: Screen) {}

  public async drawPolygon(shape: Point[], color: Color) {
    if (shape.length < 3) return;

    let min_y = Number.MAX_SAFE_INTEGER;
    let max_y = Number.MIN_SAFE_INTEGER;

    let min_x = Number.MAX_SAFE_INTEGER;
    let max_x = Number.MIN_SAFE_INTEGER;

    shape.forEach((point) => {
      if (point.x < min_x) min_x = point.x;
      if (point.x > max_x) max_x = point.x;

      if (point.y < min_y) min_y = point.y;
      if (point.y > max_y) max_y = point.y;
    });

    const rows = max_y - min_y + 1;
    const cols = max_x - min_x + 1;

    const buffer: { old: Color; isFilled: boolean }[][] = [];
    for (let i = 0; i < cols; i++) {
      const column = [];

      for (let j = 0; j < rows; j++) {
        column.push({ old: '#ffffff', isFilled: false });
      }

      buffer.push(column);
    }

    for (let i = 0; i < shape.length - 1; i++) {
      await this.flipRight(
        shape[i],
        shape[i + 1],
        min_x,
        max_x,
        max_y,
        color,
        buffer
      );
    }
    await this.flipRight(
      shape[shape.length - 1],
      shape[0],
      min_x,
      max_x,
      max_y,
      color,
      buffer
    );
  }

  protected async sleep(duration: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }

  private async flipRight(
    p1: Point,
    p2: Point,
    min_x: number,
    max_x: number,
    max_y: number,
    color: Color,
    buffer: { old: Color; isFilled: boolean }[][]
  ) {
    let { x, y } = p1;
    const dx = Math.abs(p2.x - p1.x);
    const dy = Math.abs(p2.y - p1.y);
    const sDx = Math.sign(p2.x - p1.x);
    const sDy = Math.sign(p2.y - p1.y);

    if (dy == 0) return;

    let lastY = y - 1;
    if (dx > dy) {
      // < 45deg
      let err = 2 * dy - dx; // e = dy/dx - 1/2 => e = 2dy - dx
      for (let i = 0; i <= dx; i++) {
        if (lastY != y) {
          await this.flipRow(y, max_y, x, min_x, max_x, color, buffer);
        }

        lastY = y;
        while (err >= 0) {
          y = y + sDy;
          err = err - 2 * dx; // e = e - 1 => e = e - 2dx
        }
        x = x + sDx;
        err = err + 2 * dy; // e = e + dy/dx => e = e + 2dy
      }
    } else {
      // >= 45deg
      let err = 2 * dx - dy;
      for (let i = 0; i <= dy; i++) {
        if (lastY != y) {
          await this.flipRow(y, max_y, x, min_x, max_x, color, buffer);
        }

        while (err >= 0) {
          x = x + sDx;
          err = err - 2 * dy;
        }
        lastY = y;
        y = y + sDy;
        err = err + 2 * dx;
      }
    }
  }

  private async flipRow(
    y: number,
    max_y: number,
    x1: number,
    min_x: number,
    max_x: number,
    color: Color,
    buffer: { old: Color; isFilled: boolean }[][]
  ) {
    const screenBuffer = this.screen.getScreenBuffer();

    const y_n = max_y - y;

    // const oldColor = screenBuffer[x1][y];
    this.screen.setPixel(x1, y, color);
    buffer[x1 - min_x][y_n].isFilled = true;
    buffer[x1 - min_x][y_n].old = color;

    await this.sleep(20);

    for (let xi = x1 + 1; xi <= max_x; xi++) {
      const x_n = xi - min_x;
      const isFilled = buffer[x_n][y_n].isFilled;
      const oldColor = screenBuffer[xi][y];

      if (!isFilled) {
        this.screen.setPixel(xi, y, color);
      } else {
        this.screen.setPixel(xi, y, buffer[x_n][y_n].old);
      }

      buffer[x_n][y_n].isFilled = !isFilled;
      buffer[x_n][y_n].old = oldColor;
      await this.sleep(20);
    }
  }
}
