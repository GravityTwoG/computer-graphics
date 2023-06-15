import { injectable, inject } from 'inversify';
import { TYPES } from '../interfaces/ioc/types';

import { Color } from '../interfaces/Color';
import { PixelData, Screen } from '../interfaces/Screen';
import { Colors } from '../constants';

@injectable()
export class ScreenEmulator implements Screen {
  private root: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private screenBuffer: PixelData[][] = [];

  private pixelSize: number = 20;
  private gridColor: Color = Colors.GRID;
  private bgColor: Color = 'rgba(0, 0, 0, 0)';

  // size of "emulated" pixel
  private cols: number = 0;
  private rows: number = 0;

  private computeRowsAndCols() {
    this.cols = Math.trunc(this.root.width / this.pixelSize);
    this.rows = Math.trunc(this.root.height / this.pixelSize);
  }

  private initScreenBuffer() {
    this.screenBuffer = new Array(this.cols);

    for (let x = 0; x < this.cols; x++) {
      this.screenBuffer[x] = new Array(this.rows).fill(this.bgColor);
    }
  }

  constructor(@inject(TYPES.CANVAS) root: HTMLCanvasElement) {
    this.root = root;
    const ctx = this.root.getContext('2d');

    if (!ctx) {
      throw new Error('Cannot get 2d context!');
    }

    this.context = ctx;
    this.root.oncontextmenu = function (e) {
      e.preventDefault();
      e.stopPropagation();
    };

    this.computeRowsAndCols();
    this.initScreenBuffer();
    this.setGridColor(Colors.GRID);
    this.drawPixelGrid();
  }

  public setPixelSize(pixelWidth: number) {
    if (pixelWidth === this.pixelSize) return;

    this.pixelSize = pixelWidth;
    this.computeRowsAndCols();
    this.initScreenBuffer();
    this.clear();
    this.drawPixelGrid();
  }

  public setGridColor(color: Color) {
    this.gridColor = color;
    this.drawPixelGrid();
  }

  public drawPixelGrid() {
    this.context.beginPath();
    this.context.strokeStyle = this.gridColor;

    for (let x = 0; x <= this.cols * this.pixelSize; x += this.pixelSize) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.root.height);
    }
    for (let y = 0; y <= this.rows * this.pixelSize; y += this.pixelSize) {
      this.context.moveTo(0, y);
      this.context.lineTo(this.root.width, y);
    }
    this.context.stroke();
    this.context.closePath();
  }

  public clear(): void {
    this.initScreenBuffer();
    this.context.clearRect(0, 0, this.root.width, this.root.height);
    this.drawPixelGrid();
  }

  public setPixel(x: number, y: number, color: string) {
    const realPixelSize = this.pixelSize - 2;

    this.screenBuffer[x][y] = color;
    this.context.fillStyle = color;
    // in case if canvas is transparent
    this.context.clearRect(
      x * this.pixelSize + 1,
      y * this.pixelSize + 1,
      realPixelSize,
      realPixelSize
    );
    this.context.fillRect(
      x * this.pixelSize + 1,
      y * this.pixelSize + 1,
      realPixelSize,
      realPixelSize
    );
  }

  public getPixel(x: number, y: number) {
    return this.screenBuffer[x][y];
  }

  public getWidth(): number {
    return this.cols;
  }

  public getHeight(): number {
    return this.rows;
  }

  public getScreenBuffer(): PixelData[][] {
    return this.screenBuffer;
  }

  public addEventListener(
    eventType: 'mousedown' | 'mouseup' | 'mouseover',
    cb: (e: {
      x: number;
      y: number;
      isLeft: boolean;
      isMiddle: boolean;
      isRight: boolean;
      event: MouseEvent;
    }) => void
  ) {
    const handler = (e: MouseEvent) => {
      const bounds = this.root.getBoundingClientRect();
      // get the mouse coordinates, subtract the canvas top left and any scrolling
      let pixelX = e.pageX - bounds.left - scrollX;
      let pixelY = e.pageY - bounds.top - scrollY;

      // first normalize the mouse coordinates from 0 to 1 (0,0) top left
      // off canvas and (1,1) bottom right by dividing by the bounds width and height
      pixelX /= bounds.width;
      pixelY /= bounds.height;

      // then scale to canvas coordinates by multiplying the normalized coords with the canvas resolution
      pixelX *= this.root.width;
      pixelY *= this.root.height;

      pixelX = Math.trunc(pixelX / this.pixelSize);
      pixelY = Math.trunc(pixelY / this.pixelSize);

      const isLeft = e.button === 0;
      const isMiddle = e.button === 1;
      const isRight = e.button === 2;

      cb({ x: pixelX, y: pixelY, isLeft, isMiddle, isRight, event: e });
    };

    this.root.addEventListener(eventType, handler);
    return () => this.root.removeEventListener(eventType, handler);
  }
}
