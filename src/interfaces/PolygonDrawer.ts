import { Color } from './Color';
import { Point } from './Point';

export interface PolygonDrawer {
  drawPolygon(shape: Point[], color: Color): Promise<void>;
}
