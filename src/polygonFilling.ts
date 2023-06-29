import { ScreenEmulator } from './Screens/ScreenEmulator';
import { Brezenham } from './LineDrawers/Brezenham';

import { PolygonFillingPresenter } from './PolygonFillingPresenter';
import { BoundaryFill4 } from './PolygonFillers/BoundaryFill4';
import { BoundaryFillLine } from './PolygonFillers/BoundaryFillLine';

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
  const polygonFiller1 = new BoundaryFill4(screen1);
  new PolygonFillingPresenter(root1, screen1, lineDrawer1, polygonFiller1);

  //
  const root2 = document.querySelector<HTMLDivElement>('#section2');
  const screenCanvas2 = document.querySelector<HTMLCanvasElement>('#screen2');
  if (!screenCanvas2 || !root2) {
    return;
  }
  adjustCanvasSize(screenCanvas2);
  const screen2 = new ScreenEmulator(screenCanvas2);
  const lineDrawer2 = new Brezenham(screen2);
  const polygonFiller2 = new BoundaryFillLine(screen2);
  new PolygonFillingPresenter(root2, screen2, lineDrawer2, polygonFiller2);
}

bootstrap();
