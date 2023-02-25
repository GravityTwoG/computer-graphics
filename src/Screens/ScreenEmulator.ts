import { injectable, inject } from 'inversify';
import { TYPES } from '../interfaces/ioc/types';

import { Color } from '../interfaces/Color';
import { PixelData, Screen } from '../interfaces/Screen';

@injectable()
export class ScreenEmulator implements Screen {
  private root: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private screenBuffer: PixelData[][] = [];

  // size of "emulated" pixel
  private pixelSize: number = 1;
  private gridColor: Color = '#000000';

  // size of emulated screen
  private cols: number = 0;
  private rows: number = 0;

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
  }

  private computeRowsAndCols() {
    this.cols = Math.trunc(this.root.width / this.pixelSize);
    this.rows = Math.trunc(this.root.height / this.pixelSize);
    this.screenBuffer = new Array(this.cols).fill(new Array(this.rows));
  }

  public setPixelSize(pixelWidth: number) {
    this.pixelSize = pixelWidth;
    this.computeRowsAndCols();
  }

  public setGridColor(color: Color) {
    this.gridColor = color;
    this.drawPixelGrid();
  }

  public drawPixelGrid() {
    this.context.lineWidth = 1.5;
    this.context.strokeStyle = this.gridColor;

    for (let col = 0; col <= this.cols; col++) {
      this.context.beginPath();
      this.context.moveTo(col * this.pixelSize, 0);
      this.context.lineTo(col * this.pixelSize, this.root.height);
      this.context.stroke();
      this.context.closePath();
    }

    for (let row = 0; row <= this.rows; row++) {
      this.context.beginPath();
      this.context.moveTo(0, row * this.pixelSize);
      this.context.lineTo(this.root.width, row * this.pixelSize);
      this.context.stroke();
      this.context.closePath();
    }
  }

  public clear(): void {
    this.context.clearRect(0, 0, this.root.width, this.root.height);
    this.drawPixelGrid();
  }

  public setPixel(x: number, y: number, color: string) {
    const realPixelSize = this.pixelSize - 2;

    this.screenBuffer[x][y] = color;
    this.context.fillStyle = color;
    this.context.fillRect(
      x * this.pixelSize + 1,
      y * this.pixelSize + 1,
      realPixelSize,
      realPixelSize
    );
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
