import 'reflect-metadata';
import { container as Container, Lifecycle } from 'tsyringe';

import { TYPES } from './interfaces/ioc/types';
import { Screen } from './interfaces/Screen';
import { LineDrawer } from './interfaces/LineDrawer';

import { ScreenEmulator } from './Screens/ScreenEmulator';
import { Brezenham } from './LineDrawers/Brezenham';
import { NSDDA } from './LineDrawers/NSDDA';
import { LineDrawingPresenter } from './LineDrawingPresenter';

import { adjustCanvasSize } from './adjustCanvasSize';

async function bootstrap() {
  const root = document.querySelector<HTMLDivElement>('#section1');
  const screenCanvas = document.querySelector<HTMLCanvasElement>('#screen');
  if (!screenCanvas || !root) {
    return;
  }

  adjustCanvasSize(screenCanvas);

  // NSDDA
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
    { useClass: NSDDA },
    { lifecycle: Lifecycle.ContainerScoped }
  );
  container.register<LineDrawingPresenter>(
    TYPES.PRESENTER,
    {
      useClass: LineDrawingPresenter,
    },
    { lifecycle: Lifecycle.ContainerScoped }
  );
  container.resolve<LineDrawingPresenter>(TYPES.PRESENTER);

  const root2 = document.querySelector<HTMLDivElement>('#section2');
  const screenCanvas2 = document.querySelector<HTMLCanvasElement>('#screen2');
  if (!screenCanvas2 || !root2) {
    return;
  }
  adjustCanvasSize(screenCanvas2);
  // Brezenham
  const container2 = Container.createChildContainer();
  container2.register<HTMLDivElement>(TYPES.ROOT, { useValue: root2 });
  container2.register<HTMLCanvasElement>(TYPES.CANVAS, {
    useValue: screenCanvas2,
  });
  container2.register<Screen>(
    TYPES.SCREEN,
    { useClass: ScreenEmulator },
    { lifecycle: Lifecycle.ContainerScoped }
  );
  container2.register<LineDrawer>(
    TYPES.LINE_DRAWER,
    { useClass: Brezenham },
    { lifecycle: Lifecycle.ContainerScoped }
  );
  container2.register<LineDrawingPresenter>(
    TYPES.PRESENTER,
    {
      useClass: LineDrawingPresenter,
    },
    { lifecycle: Lifecycle.ContainerScoped }
  );
  container2.resolve<LineDrawingPresenter>(TYPES.PRESENTER);
}

bootstrap();
