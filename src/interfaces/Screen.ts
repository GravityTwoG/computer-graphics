import { Color } from './Color';

export type PixelData = Color;

export type Unsubscribe = () => void;

export interface Screen {
  getWidth(): number;
  getHeight(): number;
  getScreenBuffer(): PixelData[][];

  setPixel(x: number, y: number, color: Color): void;
  getPixel(x: number, y: number): Color;

  setPixelSize(width: number): void;
  setGridColor(color: Color): void;
  clear(): void;

  addEventListener(
    eventType: 'mousedown' | 'mouseup' | 'mouseover',
    cb: (e: {
      x: number;
      y: number;
      isLeft: boolean;
      isMiddle: boolean;
      isRight: boolean;
      event: MouseEvent;
    }) => void
  ): Unsubscribe;
}
