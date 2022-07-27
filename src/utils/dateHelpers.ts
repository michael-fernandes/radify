import { UslaborData } from './../Types/data.d';

export const dateSort = (a: UslaborData, b: UslaborData) => new Date(a.Month).getTime() - new Date(b.Month).getTime()