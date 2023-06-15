import { PIXEL_SIZE } from './constants';

export function adjustCanvasSize(canvas: HTMLCanvasElement) {
  canvas.width = Math.trunc(window.innerWidth / PIXEL_SIZE) * PIXEL_SIZE;
  canvas.height = Math.trunc(window.innerHeight / PIXEL_SIZE) * PIXEL_SIZE;
}
