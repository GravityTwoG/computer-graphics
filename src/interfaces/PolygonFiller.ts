import { Color } from './Color';

export type Point = {
  x: number;
  y: number;
};

export interface PolygonFiller {
  fillPolygon(shape: Point[], color: Color): Promise<void>;
}
