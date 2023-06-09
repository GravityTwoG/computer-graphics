import 'reflect-metadata';
import { Container } from 'inversify';

import { TYPES } from './interfaces/ioc/types';
import { Screen } from './interfaces/Screen';
import { LineDrawer } from './interfaces/LineDrawer';

import { ScreenEmulator } from './Screens/ScreenEmulator';
import { Brezenham } from './LineDrawers/Brezenham';
import { LineClippingPresenter } from './LineClippingPresenter';
import { LineClipperImpl } from './LineClippers/LineClipper';
import { LineClipper } from './interfaces/LineClipper';

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
    .bind<LineClipper>(TYPES.LINE_CLIPPER)
    .to(LineClipperImpl)
    .inSingletonScope();

  container
    .bind<LineClippingPresenter>(TYPES.PRESENTER)
    .to(LineClippingPresenter)
    .inSingletonScope();

  container.get(TYPES.PRESENTER);
}

bootstrap();
