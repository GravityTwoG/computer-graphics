import { injectable } from 'inversify';

import { type Screen } from '../interfaces/Screen';
import { Point } from '../interfaces/Point';

import type { LineDrawer } from '../interfaces/LineDrawer';
import type { LineClipper } from '../interfaces/LineClipper';

import { AbstractLineClipper } from './AbstractLineClipper';

@injectable()
export class LineClipperImpl
  extends AbstractLineClipper
  implements LineClipper
{
  constructor(screen: Screen, lineDrawer: LineDrawer) {
    super(screen, lineDrawer);
  }

  private isConvex(figure: Point[]): boolean {
    if (figure.length < 3) return false;
    if (figure.length == 3) return true;

    const a: Point = {
      x: figure[1].x - figure[0].x,
      y: figure[1].y - figure[0].y,
    };

    let hasPositive = false;
    let hasNegative = false;
    let hasZero = false;

    for (let i = 0; i < figure.length; i++) {
      let j = i + 1;
      if (j == figure.length) j = 0;

      const b: Point = {
        x: figure[j].x - figure[i].x,
        y: figure[j].y - figure[i].y,
      };

      const _sign = Math.sign(a.x * b.y - a.y * b.x);

      if (_sign == -1) hasNegative = true;
      else if (_sign == 0) hasZero = true;
      else if (_sign == 1) hasPositive = true;

      if (hasNegative && hasPositive) return false;

      a.x = b.x;
      a.y = b.y;
    }

    if (hasZero && !hasNegative && !hasPositive) return false;

    return true;
  }

  private computeNormals(figure: Point[], isConvex: boolean) {
    const normals: Point[] = [];

    for (let i = 0; i < figure.length; i++) {
      let j = i + 1;
      if (j == figure.length) j = 0;

      const n: Point = {
        x: figure[j].y - figure[i].y,
        y: figure[j].x - figure[i].x,
      };

      if (!isConvex) {
        n.y *= -1;
      } else {
        n.x *= -1;
      }

      normals.push(n);
    }

    return normals;
  }

  public async drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    figure: Point[]
  ) {
    let tDown = 0;
    let tUp = 1;

    const D = { x: x2 - x1, y: y2 - y1 };
    const W = { x: 0, y: 0 };

    let D_ni;
    let Wi_ni;

    const isConvex = this.isConvex(figure);
    const normals: Point[] = this.computeNormals(figure, isConvex);

    for (let i = 0; i < figure.length; i++) {
      W.x = x1 - figure[i].x;
      W.y = y1 - figure[i].y;

      D_ni = Math.trunc(D.x * normals[i].x + D.y * normals[i].y); // D*n_i
      Wi_ni = Math.trunc(W.x * normals[i].x + W.y * normals[i].y); // W*n_i

      if (D_ni == 0) {
        if (Wi_ni < 0) {
          this.screen.setPixel(x1, y1, 'gray');
          this.screen.setPixel(x2, y2, 'gray');
          return;
        }
      } else {
        let tTmp = -Wi_ni / D_ni;

        if (D_ni > 0) {
          if (tTmp <= 1) {
            tDown = Math.max(tDown, tTmp);
          } else {
            this.screen.setPixel(x1, y1, 'gray');
            this.screen.setPixel(x2, y2, 'gray');
            return;
          }
        } else {
          if (tTmp >= 0) {
            tUp = Math.min(tUp, tTmp);
          } else {
            this.screen.setPixel(x1, y1, 'gray');
            this.screen.setPixel(x2, y2, 'gray');
            return;
          }
        }
      }
    }

    if (tDown > tUp) {
      this.screen.setPixel(x1, y1, 'gray');
      this.screen.setPixel(x2, y2, 'gray');
      return;
    }
    if (!isConvex) {
      this.screen.setPixel(x1, y1, 'gray');
      this.screen.setPixel(x2, y2, 'gray');
      return;
    }

    const tmp1: Point = {
      x: Math.trunc(x1 + (x2 - x1) * tDown),
      y: Math.trunc(y1 + (y2 - y1) * tDown),
    };
    const tmp2: Point = {
      x: Math.trunc(x1 + (x2 - x1) * tUp),
      y: Math.trunc(y1 + (y2 - y1) * tUp),
    };

    this.screen.setPixel(x1, y1, 'gray');
    this.screen.setPixel(x2, y2, 'gray');
    this.lineDrawer.setLineColor(this.color);
    await this.lineDrawer.drawLine(tmp1.x, tmp1.y, tmp2.x, tmp2.y);
  }
}
