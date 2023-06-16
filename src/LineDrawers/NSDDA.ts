import { injectable, inject } from 'tsyringe';

import { LineDrawer } from '../interfaces/LineDrawer';
import { type Screen } from '../interfaces/Screen';

import { DRAWING_DELAY_MS } from '../constants';
import { sleep } from '../sleep';
import { TYPES } from '../interfaces/ioc/types';
import { Color } from '../interfaces/Color';

function intl(x: number): number {
  return Math.floor(x);
}

@injectable()
export class NSDDA implements LineDrawer {
  protected screen: Screen;
  protected color: Color = '#000000';

  constructor(@inject(TYPES.SCREEN) screen: Screen) {
    this.screen = screen;
  }

  public setLineColor(color: Color) {
    this.color = color;
  }

  public async drawLine(x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    const x_step = dx / steps;
    const y_step = dy / steps;

    let x = x1 + 0.5;
    let y = y1 + 0.5;

    for (let i = 0; i <= steps; i++) {
      this.screen.setPixel(intl(x), intl(y), this.color);
      await sleep(DRAWING_DELAY_MS);

      x = x + x_step;
      y = y + y_step;
    }
  }
}
