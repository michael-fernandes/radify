import { curveBasisOpen } from '@visx/curve';
import { lineRadial } from 'd3-shape';
import { svgW3 } from './../Constants/constants';
import { getData, strokeToFill } from "gradient-path-typescript";
import { UslaborData } from "../Types/data";

const SEGMENTS = 50;
const SAMPLES = 10;
const PRECISION = 3;
const STROKE_WIDTH = 4;

export const pathSegments = (data: UslaborData[], angle: (d: UslaborData) => number, radius: (d: UslaborData) => number) => {
  const radialPath = lineRadial<any>().angle(d => angle(d)).radius(d => radius(d)).curve(curveBasisOpen)

  const pathEl = document.createElementNS(svgW3, 'path');
  pathEl.setAttribute("d", radialPath(data) || '');

  const pathSegments = getData({ path: pathEl, segments: SEGMENTS, samples: SAMPLES, precision: PRECISION });

  return strokeToFill(pathSegments, STROKE_WIDTH, PRECISION)

}
