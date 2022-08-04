import { UslaborData } from './../Types/data.d';
import { pointRadial } from "d3";

const  radialToXY = (d: UslaborData, angle: (d:UslaborData) => number, radius: (d:UslaborData) => number) => {
  return pointRadial(angle(d), radius(d));
}

export default radialToXY
