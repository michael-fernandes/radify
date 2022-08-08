import { ChartData } from './../Types/data.d';
import { pointRadial } from "d3";

const  radialToXY = (d: ChartData, angle: (d:ChartData) => number, radius: (d:ChartData) => number) => {
  return pointRadial(angle(d), radius(d));
}

export default radialToXY
