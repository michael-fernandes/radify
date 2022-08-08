import { ChartData } from './../Types/data.d';

export const dateSort = (a: ChartData, b: ChartData) => new Date(a.Month).getTime() - new Date(b.Month).getTime()