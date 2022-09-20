import { START_DATE } from "../Constants/constants";

const startTimeStamp = new Date(START_DATE).getTime();

const findClosestPreviousValue = (data: any[], key: string, index: number): number => {
  const previousIndex = index - 1;
  if(previousIndex < 0) return 1; // will make % change 0%.
  return data[previousIndex][key] || findClosestPreviousValue(data, key, previousIndex)
}

export const interpolate = (data: any[]): any[]  => { 
  const datesAfterStartTimeStamp = data.filter(({Month}: {Month: string}) => new Date(Month).getTime() >= startTimeStamp )
  const interpolated = datesAfterStartTimeStamp.reduce((acc: any[], current: any) => {
    // if (!acc.length) {
    //   return [...acc, current]
    // }
    const [month, previousYear] = current.Month.split(' ');
    const oneYearAgoMonthName = `${month} ${Number(previousYear) - 1}`
    const oneYearAgoDatum = data.find((d) => d.Month === oneYearAgoMonthName) || {};
    console.log(oneYearAgoDatum)

    const precedingMonth = acc[acc.length - 1];

    Object.keys(current).forEach(key => {
      if(key !== "Month") {

        const currKeyVal = current[key] || precedingMonth[key] || findClosestPreviousValue(data, key, data.indexOf((d: any) => d === current));
        const oneYearAgoVal = oneYearAgoDatum[key] || currKeyVal; // Might misrepresents 2-3 points.
        current[key] = (currKeyVal - oneYearAgoVal) / oneYearAgoVal;
      }
    })

  return [...acc, current]
  }, []);
  
  // Work around that fixes how gradient path is calculated
  return [
    interpolated[0],
    interpolated[0],
    ...interpolated,
    interpolated[interpolated.length - 1],
    interpolated[interpolated.length - 1]  
  ];
}
