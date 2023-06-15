import 'reflect-metadata';
import { container as Container, Lifecycle } from 'tsyringe';

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
  container.register<PolygonFiller>(
    TYPES.POLYGON_DRAWER,
    {
      useClass: BoundaryFill4,
    },
    { lifecycle: Lifecycle.ContainerScoped }
  );
  container.register<PolygonFillingPresenter>(
    TYPES.PRESENTER,
    {
      useClass: PolygonFillingPresenter,
    },
    { lifecycle: Lifecycle.ContainerScoped }
  );

  container.resolve(TYPES.PRESENTER);

  //
  const root2 = document.querySelector<HTMLDivElement>('#section2');
  const screenCanvas2 = document.querySelector<HTMLCanvasElement>('#screen2');
  if (!screenCanvas2 || !root2) {
    return;
  }
  adjustCanvasSize(screenCanvas);

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
  container2.register<PolygonFiller>(
    TYPES.POLYGON_DRAWER,
    {
      useClass: BoundaryFillLine,
    },
    { lifecycle: Lifecycle.ContainerScoped }
  );
  container2.register<PolygonFillingPresenter>(
    TYPES.PRESENTER,
    {
      useClass: PolygonFillingPresenter,
    },
    { lifecycle: Lifecycle.ContainerScoped }
  );
  container2.resolve(TYPES.PRESENTER);
}

bootstrap();
