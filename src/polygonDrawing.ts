import 'reflect-metadata';
import { container as Container, Lifecycle } from 'tsyringe';

import { TYPES } from './interfaces/ioc/types';
import { Screen } from './interfaces/Screen';
import { LineDrawer } from './interfaces/LineDrawer';
import { PolygonDrawer } from './interfaces/PolygonDrawer';

import { ScreenEmulator } from './Screens/ScreenEmulator';
import { Brezenham } from './LineDrawers/Brezenham';

import { PolygonDrawingPresenter } from './PolygonDrawingPresenter';
import { ScanLine } from './PolygonDrawers/ScanLine';
import { FillByEdges } from './PolygonDrawers/FillByEdges';

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
  container.register<PolygonDrawer>(
    TYPES.POLYGON_FILLER,
    {
      useClass: ScanLine,
    },
    { lifecycle: Lifecycle.ContainerScoped }
  );
  container.register<PolygonDrawingPresenter>(
    TYPES.PRESENTER,
    {
      useClass: PolygonDrawingPresenter,
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

  adjustCanvasSize(screenCanvas2);

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
  container2.register<PolygonDrawer>(
    TYPES.POLYGON_FILLER,
    {
      useClass: FillByEdges,
    },
    { lifecycle: Lifecycle.ContainerScoped }
  );
  container2.register<PolygonDrawingPresenter>(
    TYPES.PRESENTER,
    {
      useClass: PolygonDrawingPresenter,
    },
    { lifecycle: Lifecycle.ContainerScoped }
  );
  container2.resolve(TYPES.PRESENTER);
}

bootstrap();
