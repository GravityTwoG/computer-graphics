import { inject, injectable } from 'inversify';

import { TYPES } from './interfaces/ioc/types';
import { type Screen } from './interfaces/Screen';
import { type PolygonDrawer } from './interfaces/PolygonDrawer';
import { type LineDrawer } from './interfaces/LineDrawer';
import { Point } from './interfaces/Point';

@injectable()
export class PolygonDrawingPresenter {
  private figure: Point[];

  constructor(
    @inject(TYPES.ROOT) readonly root: HTMLDivElement,
    @inject(TYPES.SCREEN) private readonly screen: Screen,
    @inject(TYPES.LINE_DRAWER) private readonly lineDrawer: LineDrawer,
    @inject(TYPES.POLYGON_FILLER) private readonly filler: PolygonDrawer
  ) {
    this.figure = [];
    const drawEdges = false;
    this.screen.setPixelSize(20);

    this.screen.addEventListener('mousedown', async (e) => {
      const last = { x: e.x, y: e.y };

      // draw lines
      if (e.isLeft && this.figure.length > 0) {
        const prev = this.figure[this.figure.length - 1];
        if (drawEdges) {
          this.lineDrawer.setLineColor('#4b94fa');
          await this.lineDrawer.drawLine(prev.x, prev.y, last.x, last.y);
        }
        this.screen.setPixel(prev.x, prev.y, '#000000');
      }
      this.screen.setPixel(last.x, last.y, '#000000');

      // fill polygon
      if (
        this.figure.length >= 3 &&
        this.figure.find((p) => p.x === last.x && p.y === last.y)
      ) {
        await this.filler.drawPolygon(this.figure, '#51b52c');
        if (drawEdges) {
          await this.drawFigureEdges();
        }
        this.figure = [];
      } else {
        this.figure.push(last);
      }
    });

    const button = this.root.querySelector<HTMLButtonElement>(
      'button.button.clear'
    );
    if (!button) {
      return;
    }
    button.onclick = () => {
      this.screen.clear();
      this.figure.length = 0;
    };
  }

  private async drawFigureEdges() {
    this.lineDrawer.setLineColor('#4b94fa');
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
