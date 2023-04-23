import { inject, injectable } from 'inversify';

import { TYPES } from '../interfaces/ioc/types';
import { Color } from '../interfaces/Color';
import { type LineDrawer } from '../interfaces/LineDrawer';
import { PolygonDrawer } from '../interfaces/PolygonDrawer';
import { Point } from '../interfaces/Point';

type IntersectionNode = {
  x: number;
  y: number;
  next: IntersectionNode | null;
};

// https://web.cs.ucdavis.edu/~ma/ECS175_S00/Notes/0411_b.pdf
@injectable()
export class ScanLine implements PolygonDrawer {
  constructor(
    @inject(TYPES.LINE_DRAWER) private readonly lineDrawer: LineDrawer
  ) {}

  public async drawPolygon(shape: Point[], color: Color) {
    if (shape.length < 3) return;

    let min_y = Number.MAX_SAFE_INTEGER;
    let max_y = Number.MIN_SAFE_INTEGER;
    shape.forEach((point) => {
      if (point.y < min_y) min_y = point.y;
      if (point.y > max_y) max_y = point.y;
    });

    const intersectionsTable = new Array(max_y - min_y + 1);
    const edgePoints = this.getEdgePoints(shape);

    for (let i = edgePoints.length - 1; i >= 0; i--) {
      let { x, y } = edgePoints[i];

      const idx = max_y - y;
      let intersection: IntersectionNode = { x, y, next: null };
      if (!intersectionsTable[idx]) {
        intersectionsTable[idx] = intersection;
      } else {
        intersection.next = intersectionsTable[idx];
        intersectionsTable[idx] = intersection;
      }
    }

    for (let idx = 0; idx < intersectionsTable.length; idx++) {
      let p1 = intersectionsTable[idx];

      while (p1) {
        if (!p1.next) break;

        const p2 = p1.next;
        this.lineDrawer.setLineColor(color);
        await this.lineDrawer.drawLine(p1.x, p1.y, p2.x, p1.y);
        p1 = p2.next;
      }
    }
  }

  private getEdgePoints(shape: Point[]) {
    const intersections: Point[] = [];

    for (let i = 0; i < shape.length - 1; i++) {
      this.computeAndPushEdgePoints(shape[i], shape[i + 1], intersections);

      if (this.isLocalExtremum(shape, i + 1)) {
        // Intersection is an edge end point
        intersections.push({ x: shape[i + 1].x, y: shape[i + 1].y });
      }
    }
    this.computeAndPushEdgePoints(
      shape[shape.length - 1],
      shape[0],
      intersections
    );

    // first and last points are the same,
    // so we can drop one of them
    intersections.length--;

    if (this.isLocalExtremum(shape, 0)) {
      // Intersection is an edge end point
      intersections.push({ x: shape[0].x, y: shape[0].y });
    }

    intersections.sort((a, b) => {
      // sort by x, if y(s) are equal, ascending
      if (b.y === a.y) {
        return a.x - b.x;
      }
      // sort by y, descending
      return b.y - a.y;
    });

    return intersections;
  }

  // compute edge points with Brezenham algorithm
  private computeAndPushEdgePoints(
    p1: Point,
    p2: Point,
    intersections: Point[]
  ) {
    let { x, y } = p1;
    const dx = Math.abs(p2.x - p1.x);
    const dy = Math.abs(p2.y - p1.y);
    const sDx = Math.sign(p2.x - p1.x);
    const sDy = Math.sign(p2.y - p1.y);

    if (dy === 0) {
      if (dx !== 0) {
        this.pushEdgePoint(intersections, x, y);
        this.pushEdgePoint(intersections, p2.x, y);
      }
      return;
    }

    if (dx > dy) {
      // < 45deg
      let err = 2 * dy - dx; // e = dy/dx - 1/2 => e = 2dy - dx
      for (let i = 0; i <= dx; i++) {
        this.pushEdgePoint(intersections, x, y);

        while (err >= 0) {
          y = y + sDy;
          err = err - 2 * dx; // e = e - 1 => e = e - 2dx
        }
        x = x + sDx;
        err = err + 2 * dy; // e = e + dy/dx => e = e + 2dy
      }
    } else {
      // >= 45deg
      let err = 2 * dx - dy;
      for (let i = 0; i <= dy; i++) {
        this.pushEdgePoint(intersections, x, y);

        while (err >= 0) {
          x = x + sDx;
          err = err - 2 * dy;
        }
        y = y + sDy;
        err = err + 2 * dx;
      }
    }
  }

  private pushEdgePoint(intersections: Point[], x: number, y: number) {
    if (intersections.length === 0) {
      intersections.push({ x, y });
    } else {
      const last = intersections[intersections.length - 1];
      if (last.x != x || last.y != y) {
        if (last.y != y) {
          intersections.push({ x, y });
        } else if (Math.abs(last.x - x) > 1) {
          intersections.push({ x, y });
        } else {
          intersections.pop();
          intersections.push({ x, y });
        }
      }
    }
  }

  private isLocalExtremum(shape: Point[], pointI: number): boolean {
    if (shape.length <= 2) return false;

    let prevY;
    let currY = shape[pointI].y;
    let nextY;

    if (0 == pointI) {
      prevY = shape[shape.length - 1].y;
      nextY = shape[pointI + 1].y;
    } else if (pointI === shape.length - 1) {
      prevY = shape[pointI - 1].y;
      nextY = shape[0].y;
    } else {
      prevY = shape[pointI - 1].y;
      nextY = shape[pointI + 1].y;
    }

    // local minimum
    if (currY < prevY && currY < nextY) return true;
    // local maximum
    if (currY > prevY && currY > nextY) return true;

    return false;
  }
}
