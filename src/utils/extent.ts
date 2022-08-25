import { ChartData } from "../Types/data"


export function extentByDimension(data: ChartData[], value: (d: ChartData) => number) {
  const values = data.map(value)
  return [Math.min(...values) || 0, Math.max(...values) * 1.05]
  // return [0, Math.max(...values)]
}
