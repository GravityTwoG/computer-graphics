import 'reflect-metadata';
import { LineDrawer } from './interfaces/LineDrawer';

import { ScreenEmulator } from './Screens/ScreenEmulator';

import { Brezenham } from './LineDrawers/Brezenham';
import { NSDDA } from './LineDrawers/NSDDA';

import { LineDrawingPresenter } from './LineDrawingPresenter';

import { Container } from 'inversify';
import { TYPES } from './interfaces/ioc/types';
import { Screen, ScreenEvent } from './interfaces/Screen';

async function bootstrap() {
  const root = document.querySelector<HTMLDivElement>('#section1');
  const screenCanvas = document.querySelector<HTMLCanvasElement>('#screen');
  if (!screenCanvas || !root) {
    return;
  }

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

  const presenter = container.get<LineDrawingPresenter>(TYPES.PRESENTER);
  //
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

  const presenter2 = container2.get<LineDrawingPresenter>(TYPES.PRESENTER);

  let clicks = 0;
  const onClick = (e: ScreenEvent) => {
    if (clicks === 0) {
      presenter.screen.setPixel(e.x, e.y, '#000000');
      presenter2.screen.setPixel(e.x, e.y, '#000000');

      presenter2.x1 = e.x;
      presenter2.y1 = e.y;
    } else if (clicks === 1) {
      presenter.screen.setPixel(e.x, e.y, '#000000');
      presenter2.screen.setPixel(e.x, e.y, '#000000');

      presenter2.x2 = e.x;
      presenter2.y2 = e.y;
      presenter2.lineDrawer.drawLine(
        presenter2.x1,
        presenter2.y1,
        presenter2.x2,
        presenter2.y2
      );
      presenter.lineDrawer.drawLine(
        presenter2.x1,
        presenter2.y1,
        presenter2.x2,
        presenter2.y2
      );
    }
    clicks = (clicks + 1) % 2;
  };

  presenter.screen.addEventListener('mousedown', onClick);
  presenter2.screen.addEventListener('mousedown', onClick);
}

bootstrap();
