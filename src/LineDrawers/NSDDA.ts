import { injectable } from 'inversify';

import { LineDrawer } from '../interfaces/LineDrawer';
import { type Screen } from '../interfaces/Screen';

import { AbstractLineDrawer } from './AbstractLineDrawer';
import { DRAWING_DELAY_MS } from './constants';

function intl(x: number): number {
  return Math.floor(x);
}

@injectable()
export class NSDDA extends AbstractLineDrawer implements LineDrawer {
  constructor(screen: Screen) {
    super(screen);
  }

  public async drawLine(x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    const x_step = (x2 - x1) / steps;
    const y_step = (y2 - y1) / steps;

    let x = x1 + 0.5;
    let y = y1 + 0.5;

    let i = 0;
    while (i <= steps) {
      this.screen.setPixel(intl(x), intl(y), this.color);
      await this.sleep(DRAWING_DELAY_MS);

      x = x + x_step;
      y = y + y_step;
      i++;
    }
  }
}
