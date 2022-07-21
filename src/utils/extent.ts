import { UslaborData } from "../Types/data"


export function extentByDimension(data: UslaborData[], value: (d: UslaborData) => number) {
  const values = data.map(value)
  return [Math.min(...values) || 1, Math.max(...values)]
}