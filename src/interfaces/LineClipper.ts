import { Color } from './Color';
import { Point } from './Point';

export interface LineClipper {
  setLineColor(color: Color): void;
  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    figure: Point[]
  ): void;
}
