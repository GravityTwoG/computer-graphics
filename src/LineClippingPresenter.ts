import { inject, injectable } from 'tsyringe';

import { TYPES } from './interfaces/ioc/types';
import { Point } from './interfaces/Point';
import type { Screen, ScreenEvent } from './interfaces/Screen';
import type { LineDrawer } from './interfaces/LineDrawer';
import type { LineClipper } from './interfaces/LineClipper';
import { Colors, PIXEL_SIZE } from './constants';

@injectable()
export class LineClippingPresenter {
  private figure: Point[];

  constructor(
    @inject(TYPES.ROOT) readonly root: HTMLDivElement,
    @inject(TYPES.SCREEN) readonly screen: Screen,
    @inject(TYPES.LINE_DRAWER) readonly lineDrawer: LineDrawer,
    @inject(TYPES.LINE_CLIPPER) readonly lineClipper: LineClipper
  ) {
    this.screen.setPixelSize(PIXEL_SIZE);

    const center_x = Math.trunc(this.screen.getWidth() / 2);
    const center_y = Math.trunc(this.screen.getHeight() / 2);

    const rectWidth = Math.trunc(this.screen.getWidth() / 4);
    const rectHeight = Math.trunc(this.screen.getHeight() / 4);

    this.figure = [
      { x: center_x - rectWidth, y: center_y - rectHeight },
      { x: center_x + rectWidth, y: center_y - rectHeight },
      { x: center_x + rectWidth, y: center_y + rectHeight },
      { x: center_x - rectWidth, y: center_y + rectHeight },
    ];
    this.drawFigure();

    let x = 0;
    let y = 0;
    let clicks = 0;

    this.screen.addEventListener('mousedown', (e: ScreenEvent) => {
      if (clicks === 0) {
        this.screen.setPixel(e.x, e.y, Colors.POINT);
        x = e.x;
        y = e.y;
      } else if (clicks === 1) {
        this.screen.setPixel(e.x, e.y, Colors.POINT);
        this.lineClipper.setLineColor(Colors.BLUE);
        this.lineClipper.drawLine(x, y, e.x, e.y, this.figure);
      }
      clicks = (clicks + 1) % 2;
    });

    const button = this.root.querySelector<HTMLButtonElement>(
      'button.button.clear'
    );

    if (button) {
      button.onclick = () => {
        this.screen.clear();
        this.drawFigure();
      };
    }
  }

  private async drawFigure() {
    this.lineDrawer.setLineColor(Colors.GREEN);
    for (let i = 1; i < this.figure.length; i++) {
      const a = this.figure[i - 1];
      const b = this.figure[i];
      this.lineDrawer.drawLine(a.x, a.y, b.x, b.y);
    }

    const a = this.figure[this.figure.length - 1];
    const b = this.figure[0];
    this.lineDrawer.drawLine(a.x, a.y, b.x, b.y);
  }
}
