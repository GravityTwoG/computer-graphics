import { Color } from './Color';

export interface LineDrawer {
  setLineColor(color: Color): void;
  drawLine(x1: number, y1: number, x2: number, y2: number): void;
}
