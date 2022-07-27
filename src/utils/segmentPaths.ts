import { curveBasisOpen } from '@visx/curve';
import { lineRadial } from 'd3-shape';
import { PRECISION, SAMPLES, SEGMENTS, STROKE_WIDTH, SVG_W3 } from '../Constants/constants';
import { getData, strokeToFill } from "gradient-path-typescript";
import { UslaborData } from "../Types/data";

export const segmentPaths = (data: UslaborData[], angle: (d: UslaborData) => number, radius: (d: UslaborData) => number) => {
  const fauxPathEl = document.createElementNS(SVG_W3, 'path');
  fauxPathEl.setAttribute("d", radialPath(data,  angle, radius));

  const pathSegments = getData({ path: fauxPathEl, segments: SEGMENTS, samples: SAMPLES, precision: PRECISION });
  return strokeToFill(pathSegments, STROKE_WIDTH, PRECISION)
}


export const radialPath = (data: UslaborData[], angle: (d: UslaborData) => number, radius: (d: UslaborData) => number) =>{
  return lineRadial<any>().angle(d => angle(d)).radius(d => radius(d)).curve(curveBasisOpen)(data) || ''
}
