import { ScreenEmulator } from './Screens/ScreenEmulator';
import { Brezenham } from './LineDrawers/Brezenham';
import { NSDDA } from './LineDrawers/NSDDA';
import { LineDrawingPresenter } from './LineDrawingPresenter';

import { adjustCanvasSize } from './adjustCanvasSize';

async function bootstrap() {
  // NSDDA
  const root = document.querySelector<HTMLDivElement>('#section1');
  const screenCanvas = document.querySelector<HTMLCanvasElement>('#screen');
  if (!screenCanvas || !root) {
    return;
  }

  adjustCanvasSize(screenCanvas);

  const screen1 = new ScreenEmulator(screenCanvas);
  const lineDrawer1 = new NSDDA(screen1);
  new LineDrawingPresenter(root, screen1, lineDrawer1);

  // Brezenham
  const root2 = document.querySelector<HTMLDivElement>('#section2');
  const screenCanvas2 = document.querySelector<HTMLCanvasElement>('#screen2');
  if (!screenCanvas2 || !root2) {
    return;
  }

  adjustCanvasSize(screenCanvas2);

  const screen2 = new ScreenEmulator(screenCanvas2);
  const lineDrawer2 = new Brezenham(screen2);
  new LineDrawingPresenter(root2, screen2, lineDrawer2);
}

bootstrap();
