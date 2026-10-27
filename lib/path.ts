import * as THREE from 'three';
import { chapters } from './content';

/** Distance between chapter stations along -Z. */
export const STATION_GAP = 16;
export const CAM_DIST = 7.5;
export const N = chapters.length;

/** Where each chapter's 3D object sits, given the layout side of its text. */
export function stationPosition(i: number, narrow: boolean): [number, number, number] {
  const c = chapters[i];
  const z = -i * STATION_GAP;
  if (narrow) return i === 0 ? [0.6, 2.35, z - 3] : [0, 1.45, z - 1.5];
  if (c.side === 'left') return [2.7, 0, z];
  if (c.side === 'right') return [-2.7, 0, z];
  return [0, 0, z - 3.5];
}

export function buildCurves() {
  const cam: THREE.Vector3[] = [];
  const look: THREE.Vector3[] = [];
  for (let i = 0; i < N; i++) {
    const z = -i * STATION_GAP;
    cam.push(new THREE.Vector3(Math.sin(i * 1.7) * 0.7, 0.25 + Math.cos(i * 1.1) * 0.35, z + CAM_DIST));
    look.push(new THREE.Vector3(0, 0, z));
  }
  return {
    cam: new THREE.CatmullRomCurve3(cam, false, 'catmullrom', 0.3),
    look: new THREE.CatmullRomCurve3(look, false, 'catmullrom', 0.3),
  };
}
