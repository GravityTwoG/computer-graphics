import 'reflect-metadata';
import { LineDrawer } from './interfaces/LineDrawer';

import { ScreenEmulator } from './Screens/ScreenEmulator';

import { Brezenham } from './LineDrawers/Brezenham';
import { NSDDA } from './LineDrawers/NSDDA';

import { LineDrawingPresenter } from './LineDrawingPresenter';

import { Container } from 'inversify';
import { TYPES } from './interfaces/ioc/types';
import { Screen } from './interfaces/Screen';

import { adjustCanvasSize } from './adjustCanvasSize';

async function bootstrap() {
  const root = document.querySelector<HTMLDivElement>('#section1');
  const screenCanvas = document.querySelector<HTMLCanvasElement>('#screen');
  if (!screenCanvas || !root) {
    return;
  }

  adjustCanvasSize(screenCanvas);

  // NSDDA
  const container = new Container();
  container.bind<HTMLDivElement>(TYPES.ROOT).toConstantValue(root);
  container.bind<HTMLCanvasElement>(TYPES.CANVAS).toConstantValue(screenCanvas);
  container.bind<Screen>(TYPES.SCREEN).to(ScreenEmulator).inSingletonScope();
  container.bind<LineDrawer>(TYPES.LINE_DRAWER).to(NSDDA).inSingletonScope();
  container
    .bind<LineDrawingPresenter>(TYPES.PRESENTER)
    .to(LineDrawingPresenter)
    .inSingletonScope();

  container.get<LineDrawingPresenter>(TYPES.PRESENTER);

  const root2 = document.querySelector<HTMLDivElement>('#section2');
  const screenCanvas2 = document.querySelector<HTMLCanvasElement>('#screen2');
  if (!screenCanvas2 || !root2) {
    return;
  }
  // Brezenham
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
    .bind<LineDrawingPresenter>(TYPES.PRESENTER)
    .to(LineDrawingPresenter)
    .inSingletonScope();

  screenCanvas2.width = Math.trunc(window.innerWidth / 10) * 10;
  screenCanvas2.height = Math.trunc(window.innerHeight / 10) * 10;

  container2.get<LineDrawingPresenter>(TYPES.PRESENTER);
}

bootstrap();
