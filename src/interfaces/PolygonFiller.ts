import { Color } from './Color';

export interface PolygonFiller {
  fillPolygon(
    x: number,
    y: number,
    boundaryColor: Color,
    fillColor: Color
  ): Promise<void>;
}
