import { injectable, inject } from 'tsyringe';
import { TYPES } from '../interfaces/ioc/types';

import { Color } from '../interfaces/Color';
import { Point } from '../interfaces/Point';
import { type Screen } from '../interfaces/Screen';
import type { LineDrawer } from '../interfaces/LineDrawer';
import { LineClipper } from '../interfaces/LineClipper';

@injectable()
export class AbstractLineClipper implements LineClipper {
  protected screen: Screen;
  protected lineDrawer: LineDrawer;
  protected color: Color = '#000000';

  constructor(
    @inject(TYPES.SCREEN) screen: Screen,
    @inject(TYPES.LINE_DRAWER) lineDrawer: LineDrawer
  ) {
    this.screen = screen;
    this.lineDrawer = lineDrawer;
  }

  public setLineColor(color: Color) {
    this.color = color;
  }

  public async drawLine(
    _x1: number,
    _y1: number,
    _x2: number,
    _y2: number,
    _figure: Point[]
  ): Promise<void> {
    throw Error('not implemented');
  }
}
