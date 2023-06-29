import { ScreenEmulator } from './Screens/ScreenEmulator';
import { Brezenham } from './LineDrawers/Brezenham';
import { LineClippingPresenter } from './LineClippingPresenter';
import { LineClipperImpl } from './LineClippers/LineClipper';

import { adjustCanvasSize } from './adjustCanvasSize';

async function bootstrap() {
  const root = document.querySelector<HTMLDivElement>('#section1');
  const screenCanvas = document.querySelector<HTMLCanvasElement>('#screen');
  if (!screenCanvas || !root) {
    return;
  }

  adjustCanvasSize(screenCanvas);

  const screen = new ScreenEmulator(screenCanvas);
  const lineDrawer = new Brezenham(screen);
  const lineClipper = new LineClipperImpl(screen, lineDrawer);
  new LineClippingPresenter(root, screen, lineDrawer, lineClipper);
}

bootstrap();
