import { inject, injectable } from 'tsyringe';

import { TYPES } from './interfaces/ioc/types';
import { type Screen } from './interfaces/Screen';
import { type LineDrawer } from './interfaces/LineDrawer';
import { type PolygonFiller } from './interfaces/PolygonFiller';
import { type Point } from './interfaces/Point';
import { Colors, PIXEL_SIZE } from './constants';

@injectable()
export class PolygonFillingPresenter {
  private figure: Point[];

  constructor(
    @inject(TYPES.ROOT) readonly root: HTMLDivElement,
    @inject(TYPES.SCREEN) private readonly screen: Screen,
    @inject(TYPES.LINE_DRAWER) private readonly lineDrawer: LineDrawer,
    @inject(TYPES.POLYGON_DRAWER) private readonly filler: PolygonFiller
  ) {
    this.figure = [];
    const drawEdges = true;
    const boundaryColor = Colors.BLUE;
    this.screen.setPixelSize(PIXEL_SIZE);

    this.screen.addEventListener('mousedown', async (e) => {
      const last = { x: e.x, y: e.y };

      if (e.isRight) {
        await this.filler.fillPolygon(e.x, e.y, boundaryColor, Colors.GREEN);
        this.figure = [];
        return;
      }

      // draw lines
      if (e.isLeft && this.figure.length > 0) {
        const prev = this.figure[this.figure.length - 1];
        if (drawEdges) {
          this.lineDrawer.setLineColor(boundaryColor);
          await this.lineDrawer.drawLine(prev.x, prev.y, last.x, last.y);
        }
        this.screen.setPixel(prev.x, prev.y, Colors.POINT);
      }
      this.screen.setPixel(last.x, last.y, Colors.POINT);

      // fill polygon
      if (
        this.figure.length >= 3 &&
        this.figure.find((p) => p.x === last.x && p.y === last.y)
      ) {
        if (drawEdges) {
          await this.drawFigureEdges();
        }
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
    this.lineDrawer.setLineColor(Colors.BLUE);
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
