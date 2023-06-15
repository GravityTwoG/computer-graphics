import 'reflect-metadata';
import { Container } from 'inversify';

import { TYPES } from './interfaces/ioc/types';
import { Screen } from './interfaces/Screen';
import { LineDrawer } from './interfaces/LineDrawer';

import { ScreenEmulator } from './Screens/ScreenEmulator';
import { Brezenham } from './LineDrawers/Brezenham';

import { PolygonFillingPresenter } from './PolygonFillingPresenter';
import { BoundaryFill4 } from './PolygonFillers/BoundaryFill4';
import { BoundaryFillLine } from './PolygonFillers/BoundaryFillLine';
import { PolygonFiller } from './interfaces/PolygonFiller';

import { adjustCanvasSize } from './adjustCanvasSize';

async function bootstrap() {
  const root = document.querySelector<HTMLDivElement>('#section1');
  const screenCanvas = document.querySelector<HTMLCanvasElement>('#screen');
  if (!screenCanvas || !root) {
    return;
  }
  adjustCanvasSize(screenCanvas);

  const container = new Container();
  container.bind<HTMLDivElement>(TYPES.ROOT).toConstantValue(root);
  container.bind<HTMLCanvasElement>(TYPES.CANVAS).toConstantValue(screenCanvas);
  container.bind<Screen>(TYPES.SCREEN).to(ScreenEmulator).inSingletonScope();
  container
    .bind<LineDrawer>(TYPES.LINE_DRAWER)
    .to(Brezenham)
    .inSingletonScope();
  container
    .bind<PolygonFiller>(TYPES.POLYGON_DRAWER)
    .to(BoundaryFill4)
    .inSingletonScope();
  container
    .bind<PolygonFillingPresenter>(TYPES.PRESENTER)
    .to(PolygonFillingPresenter)
    .inSingletonScope();

  container.get(TYPES.PRESENTER);

  //
  const root2 = document.querySelector<HTMLDivElement>('#section2');
  const screenCanvas2 = document.querySelector<HTMLCanvasElement>('#screen2');
  if (!screenCanvas2 || !root2) {
    return;
  }
  adjustCanvasSize(screenCanvas);

  const container2 = new Container();
  container2.bind<HTMLDivElement>(TYPES.ROOT).toConstantValue(root2);
  container2
    .bind<HTMLCanvasElement>(TYPES.CANVAS)
    .toConstantValue(screenCanvas2);
  container2.bind<Screen>(TYPES.SCREEN).to(ScreenEmulator).inSingletonScope();
  container2
    .bind<LineDrawer>(TYPES.LINE_DRAWER)
    .to(Brezenham)
    .inSingletonScope();
  container2
    .bind<PolygonFiller>(TYPES.POLYGON_DRAWER)
    .to(BoundaryFillLine)
    .inSingletonScope();
  container2
    .bind<PolygonFillingPresenter>(TYPES.PRESENTER)
    .to(PolygonFillingPresenter)
    .inSingletonScope();

  container2.get(TYPES.PRESENTER);
}

bootstrap();
