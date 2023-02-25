import { inject, injectable } from 'inversify';

import { TYPES } from './interfaces/ioc/types';
import { type LineDrawer } from './interfaces/LineDrawer';
import { type Screen } from './interfaces/Screen';

@injectable()
export class LineDrawingPresenter {
  public x1 = 0;
  public y1 = 0;
  public x2 = 0;
  public y2 = 0;
  public readonly pixelSize = 20;
  public onDestroy = () => {};

  constructor(
    @inject(TYPES.ROOT) readonly root: HTMLDivElement,
    @inject(TYPES.SCREEN) readonly screen: Screen,
    @inject(TYPES.LINE_DRAWER) readonly lineDrawer: LineDrawer
  ) {
    this.screen.setPixelSize(this.pixelSize);
    this.screen.setGridColor('#000000');
    this.lineDrawer.setLineColor('#4b94fa');

    const button = this.root.querySelector<HTMLButtonElement>(
      'button.button.clear'
    );

    if (!button) {
      return;
    }

    button.onclick = () => {
      this.screen.clear();
    };
  }

  public destroy() {
    this.onDestroy();
  }
}
