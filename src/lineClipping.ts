import 'reflect-metadata';
import { container as Container, Lifecycle } from 'tsyringe';

import { TYPES } from './interfaces/ioc/types';
import { Screen } from './interfaces/Screen';
import { LineDrawer } from './interfaces/LineDrawer';

import { ScreenEmulator } from './Screens/ScreenEmulator';
import { Brezenham } from './LineDrawers/Brezenham';
import { LineClippingPresenter } from './LineClippingPresenter';
import { LineClipperImpl } from './LineClippers/LineClipper';
import { LineClipper } from './interfaces/LineClipper';

import { adjustCanvasSize } from './adjustCanvasSize';

async function bootstrap() {
  const root = document.querySelector<HTMLDivElement>('#section1');
  const screenCanvas = document.querySelector<HTMLCanvasElement>('#screen');
  if (!screenCanvas || !root) {
    return;
  }

  adjustCanvasSize(screenCanvas);

  const container = Container.createChildContainer();
  container.register<HTMLDivElement>(TYPES.ROOT, { useValue: root });
  container.register<HTMLCanvasElement>(TYPES.CANVAS, {
    useValue: screenCanvas,
  });
  container.register<Screen>(
    TYPES.SCREEN,
    { useClass: ScreenEmulator },
    { lifecycle: Lifecycle.ContainerScoped }
  );
  container.register<LineDrawer>(
    TYPES.LINE_DRAWER,
    { useClass: Brezenham },
    { lifecycle: Lifecycle.ContainerScoped }
  );
  container.register<LineClipper>(
    TYPES.LINE_CLIPPER,
    {
      useClass: LineClipperImpl,
    },
    { lifecycle: Lifecycle.ContainerScoped }
  );

  container.register<LineClippingPresenter>(
    TYPES.PRESENTER,
    {
      useClass: LineClippingPresenter,
    },
    { lifecycle: Lifecycle.ContainerScoped }
  );
  container.resolve(TYPES.PRESENTER);
}

bootstrap();
