import { ChartData } from "../Types/data"


export function extentByDimension(data: ChartData[], value: (d: ChartData) => number) {
  const values = data.map(value)
  const min = Math.min(...values);
  
  return [ min < -1 ? min - 1 : -1, Math.max(...values) * 1.05]
  // return [0, Math.max(...values)]
}
