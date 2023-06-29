import { ScreenEmulator } from './Screens/ScreenEmulator';
import { Brezenham } from './LineDrawers/Brezenham';

import { PolygonDrawingPresenter } from './PolygonDrawingPresenter';
import { ScanLine } from './PolygonDrawers/ScanLine';
import { FillByEdges } from './PolygonDrawers/FillByEdges';

import { adjustCanvasSize } from './adjustCanvasSize';

async function bootstrap() {
  const root1 = document.querySelector<HTMLDivElement>('#section1');
  const screenCanvas1 = document.querySelector<HTMLCanvasElement>('#screen');
  if (!screenCanvas1 || !root1) {
    return;
  }

  adjustCanvasSize(screenCanvas1);
  const screen1 = new ScreenEmulator(screenCanvas1);
  const lineDrawer1 = new Brezenham(screen1);
  const polygonDrawer1 = new ScanLine(lineDrawer1);
  new PolygonDrawingPresenter(root1, screen1, lineDrawer1, polygonDrawer1);

  //
  const root2 = document.querySelector<HTMLDivElement>('#section2');
  const screenCanvas2 = document.querySelector<HTMLCanvasElement>('#screen2');
  if (!screenCanvas2 || !root2) {
    return;
  }

  adjustCanvasSize(screenCanvas2);

  const screen2 = new ScreenEmulator(screenCanvas2);
  const lineDrawer2 = new Brezenham(screen2);
  const polygonDrawer2 = new FillByEdges(screen2);
  new PolygonDrawingPresenter(root2, screen2, lineDrawer2, polygonDrawer2);
}

bootstrap();
