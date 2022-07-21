import { curveBasisOpen } from '@visx/curve';
import { lineRadial } from 'd3-shape';
import { svgW3 } from './../Constants/constants';
import { getData, strokeToFill } from "gradient-path-typescript";
import { UslaborData } from "../Types/data";

const segments = 50;
const samples = 10;
const precision = 3;
const strokeWidth = 4;

export const pathSegments = (data: UslaborData[], angle: (d: UslaborData) => number, radius: (d: UslaborData) => number) => {
  const radialPath = lineRadial<any>().angle(d => angle(d)).radius(d => radius(d)).curve(curveBasisOpen)

  const pathEl = document.createElementNS(svgW3, 'path');
  pathEl.setAttribute("d", radialPath(data) || '');

  const pathSegments = getData({ path: pathEl, segments, samples, precision });

  return strokeToFill(pathSegments, strokeWidth, precision)

}