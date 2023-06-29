import { type LineDrawer } from './interfaces/LineDrawer';
import { type Screen } from './interfaces/Screen';
import { Colors, PIXEL_SIZE } from './constants';

export class LineDrawingPresenter {
  public x1 = 0;
  public y1 = 0;
  public x2 = 0;
  public y2 = 0;

  constructor(
    readonly root: HTMLDivElement,
    readonly screen: Screen,
    readonly lineDrawer: LineDrawer
  ) {
    this.screen.setPixelSize(PIXEL_SIZE);
    this.lineDrawer.setLineColor(Colors.BLUE);

    const button = this.root.querySelector<HTMLButtonElement>(
      'button.button.clear'
    );

    if (!button) {
      return;
    }

    button.onclick = () => {
      this.screen.clear();
    };

    let clicks = 0;
    this.screen.addEventListener('mousedown', (e) => {
      if (clicks === 0) {
        this.screen.setPixel(e.x, e.y, Colors.POINT);

        this.x1 = e.x;
        this.y1 = e.y;
      } else if (clicks === 1) {
        this.screen.setPixel(e.x, e.y, Colors.POINT);

        this.x2 = e.x;
        this.y2 = e.y;
        this.lineDrawer.drawLine(this.x1, this.y1, this.x2, this.y2);
      }
      clicks = (clicks + 1) % 2;
    });
  }
}
