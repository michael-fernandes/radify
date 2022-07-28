import { UslaborData } from "../Types/data"
 
export const bucketByYear = (data: UslaborData[]) => data.reduce((acc, curr) => {
    const year = curr.Month.split(" ")[1]
    if (!acc[year]) acc[year] = []
    acc[year].push(curr)

    return acc;
  }, {} as { [key: string]: UslaborData[] })
