import { injectable, inject } from 'tsyringe';

import { LineDrawer } from '../interfaces/LineDrawer';
import { type Screen } from '../interfaces/Screen';

import { DRAWING_DELAY_MS } from '../constants';
import { sleep } from '../sleep';
import { TYPES } from '../interfaces/ioc/types';
import { Color } from '../interfaces/Color';

@injectable()
export class Brezenham implements LineDrawer {
  protected screen: Screen;
  protected color: Color = '#000000';

  constructor(@inject(TYPES.SCREEN) screen: Screen) {
    this.screen = screen;
  }

  public setLineColor(color: Color) {
    this.color = color;
  }

  public async drawLine(x1: number, y1: number, x2: number, y2: number) {
    let x = x1;
    let y = y1;
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sDx = Math.sign(x2 - x1);
    const sDy = Math.sign(y2 - y1);

    if (0 == dx && 0 == dy) {
      this.screen.setPixel(x, y, this.color);
      return;
    }

    if (dx > dy) {
      // < 45deg
      let err = 2 * dy - dx; // e = dy/dx - 1/2 => e = 2dy - dx
      for (let i = 0; i <= dx; i++) {
        this.screen.setPixel(x, y, this.color);

        await sleep(DRAWING_DELAY_MS);

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
        this.screen.setPixel(x, y, this.color);
        await sleep(DRAWING_DELAY_MS);

        while (err >= 0) {
          x = x + sDx;
          err = err - 2 * dy;
        }
        y = y + sDy;
        err = err + 2 * dx;
      }
    }
  }
}
