import { curveBasisOpen } from '@visx/curve';
import { lineRadial } from 'd3-shape';
import { PRECISION, SAMPLES, SEGMENTS, STROKE_WIDTH, SVG_NS } from '../Constants/constants';
import { getData, strokeToFill} from "gradient-path";
import { UslaborData } from "../Types/data";
// const {getData, strokeToFill} = require("gradient-path")


const radialPath = (data: UslaborData[], angle: (d: UslaborData) => number, radius: (d: UslaborData) => number) =>{
  return lineRadial<any>().angle(d => angle(d)).radius(d => radius(d)).curve(curveBasisOpen)(data) || ''
}


const segmentPaths = (data: UslaborData[], angle: (d: UslaborData) => number, radius: (d: UslaborData) => number) => {
  const fauxPathEl = document.createElementNS(SVG_NS, 'path');
  fauxPathEl.setAttribute("d", radialPath(data,  angle, radius) + ' z');

  const pathSegments = getData({ path: fauxPathEl, segments: SEGMENTS, samples: SAMPLES, precision: PRECISION });
  return strokeToFill(pathSegments, STROKE_WIDTH, PRECISION, false)
}

export default segmentPaths