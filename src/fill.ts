import 'reflect-metadata';
import { Container } from 'inversify';

import { TYPES } from './interfaces/ioc/types';
import { Screen } from './interfaces/Screen';
import { LineDrawer } from './interfaces/LineDrawer';
import { PolygonFiller } from './interfaces/PolygonFiller';

import { ScreenEmulator } from './Screens/ScreenEmulator';
import { Brezenham } from './LineDrawers/Brezenham';

import { PolygonFillingPresenter } from './PolygonFillingPresenter';
import { ScanLine } from './Scanline';

async function bootstrap() {
  const root = document.querySelector<HTMLDivElement>('#section1');
  const screenCanvas = document.querySelector<HTMLCanvasElement>('#screen');
  if (!screenCanvas || !root) {
    return;
  }

  const container = new Container();
  container.bind<HTMLDivElement>(TYPES.ROOT).toConstantValue(root);
  container.bind<HTMLCanvasElement>(TYPES.CANVAS).toConstantValue(screenCanvas);
  container.bind<Screen>(TYPES.SCREEN).to(ScreenEmulator).inSingletonScope();
  container
    .bind<LineDrawer>(TYPES.LINE_DRAWER)
    .to(Brezenham)
    .inSingletonScope();
  container
    .bind<PolygonFiller>(TYPES.POLYGON_FILLER)
    .to(ScanLine)
    .inSingletonScope();
  container
    .bind<PolygonFillingPresenter>(TYPES.PRESENTER)
    .to(PolygonFillingPresenter)
    .inSingletonScope();

  const presenter = container.get(TYPES.PRESENTER);
  console.log(presenter);
  //
  const root2 = document.querySelector<HTMLDivElement>('#section2');
  const screenCanvas2 = document.querySelector<HTMLCanvasElement>('#screen2');
  if (!screenCanvas2 || !root2) {
    return;
  }
}

bootstrap();
