import { injectable, inject } from 'tsyringe';
import { TYPES } from '../interfaces/ioc/types';

import { Color } from '../interfaces/Color';
import { type Screen } from '../interfaces/Screen';
import { LineDrawer } from '../interfaces/LineDrawer';

@injectable()
export class AbstractLineDrawer implements LineDrawer {
  protected screen: Screen;
  protected color: Color = '#000000';

  constructor(@inject(TYPES.SCREEN) screen: Screen) {
    this.screen = screen;
  }

  public setLineColor(color: Color) {
    this.color = color;
  }

  public async drawLine(
    _x1: number,
    _y1: number,
    _x2: number,
    _y2: number
  ): Promise<void> {
    throw Error('not implemented');
  }
}
