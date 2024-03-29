import { curveBasisOpen } from '@visx/curve';
import { lineRadial } from 'd3-shape';
import { PRECISION, SAMPLES, SEGMENTS, STROKE_WIDTH, SVG_NS } from '../Constants/constants';
import { getData, strokeToFill} from "gradient-path";
import { ChartData } from "../Types/data";
// const {getData, strokeToFill} = require("gradient-path")


export const radialPath = (data: ChartData[], angle: (d: ChartData) => number, radius: (d: ChartData) => number) =>{
  return lineRadial<any>().angle(d => angle(d)).radius(d => radius(d)).curve(curveBasisOpen)(data) || ''
}

// don't forget to remove it
export const fauxPathNode = (path: string) => {
  const fauxPathEl = document.createElementNS(SVG_NS, 'path');
  fauxPathEl.setAttribute("d", path);

  return fauxPathEl;
}

const segmentPath = (path: string, strokeWidth: number = STROKE_WIDTH) => {
  const fauxPathEl = fauxPathNode(path);
  const pathSegments = getData({ path: fauxPathEl, segments: SEGMENTS, samples: SAMPLES, precision: PRECISION });
  fauxPathEl.remove()
  return strokeToFill(pathSegments, strokeWidth, PRECISION, false)
}

export default segmentPath