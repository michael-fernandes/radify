import { UslaborData } from "../Types/data"


export function extentByDimension(data: UslaborData[], value: (d: UslaborData) => number) {
  const values = data.map(value)
  // return [Math.min(...values) || 0, Math.max(...values)]
  return [0, Math.max(...values)]
}
