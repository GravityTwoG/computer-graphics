import 'reflect-metadata';
import { LineDrawer } from './interfaces/LineDrawer';

import { ScreenEmulator } from './Screens/ScreenEmulator';

import { Brezenham } from './LineDrawers/Brezenham';
import { NSDDA } from './LineDrawers/NSDDA';

import { LineDrawingPresenter } from './LineDrawingPresenter';

import { Container } from 'inversify';
import { TYPES } from './interfaces/ioc/types';
import { Screen } from './interfaces/Screen';

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

  presenter.onDestroy = presenter.screen.addEventListener('mousedown', (e) => {
    if (e.isLeft) {
      presenter.x1 = e.x;
      presenter.y1 = e.y;
    } else if (e.isRight) {
      presenter.x2 = e.x;
      presenter.y2 = e.y;
      presenter.lineDrawer.drawLine(
        presenter.x1,
        presenter.y1,
        presenter.x2,
        presenter.y2
      );
      presenter2.lineDrawer.drawLine(
        presenter.x1,
        presenter.y1,
        presenter.x2,
        presenter.y2
      );
    }
  });
  presenter2.onDestroy = presenter2.screen.addEventListener(
    'mousedown',
    (e) => {
      if (e.isLeft) {
        presenter2.x1 = e.x;
        presenter2.y1 = e.y;
      } else if (e.isRight) {
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
    }
  );

  const root3 = document.querySelector<HTMLDivElement>('#section3');
  const screenCanvas3 = document.querySelector<HTMLCanvasElement>('#screen3');
  if (!screenCanvas3 || !root3) {
    return;
  }
  const container3 = new Container();
  container3.bind<HTMLDivElement>(TYPES.ROOT).toConstantValue(root3);
  container3
    .bind<HTMLCanvasElement>(TYPES.CANVAS)
    .toConstantValue(screenCanvas3);
  container3.bind<Screen>(TYPES.SCREEN).to(ScreenEmulator).inSingletonScope();
  container3
    .bind<LineDrawer>(TYPES.LINE_DRAWER)
    .to(Brezenham)
    .inSingletonScope();
  container3
    .bind<LineDrawingPresenter>(TYPES.PRESENTER)
    .to(LineDrawingPresenter)
    .inSingletonScope();

  const presenter3 = container3.get<LineDrawingPresenter>(TYPES.PRESENTER);
  const nsdda = new NSDDA(container3.get(TYPES.SCREEN));
  nsdda.setLineColor('#51b52c');
  presenter3.onDestroy = presenter3.screen.addEventListener(
    'mousedown',
    async (e) => {
      if (e.isLeft) {
        presenter3.x1 = e.x;
        presenter3.y1 = e.y;
      } else if (e.isRight) {
        presenter3.x2 = e.x;
        presenter3.y2 = e.y;
        await presenter3.lineDrawer.drawLine(
          presenter3.x1,
          presenter3.y1,
          presenter3.x2,
          presenter3.y2
        );
        await nsdda.drawLine(
          presenter3.x1,
          presenter3.y1,
          presenter3.x2,
          presenter3.y2
        );
      }
    }
  );
}

bootstrap();
