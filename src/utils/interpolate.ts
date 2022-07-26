import { UslaborData } from './../Types/data.d';

// TODO: do this to data itself
export const interpolate = (data: any[]): any[]  => { 
  return data.reduce((acc: any[], current: any) => {
    if (!acc.length) return acc.push(current) && acc

    const previous = acc[acc.length - 1]

    Object.keys(current).forEach(key => {
      if (current[key] === null) {
        current[key] = previous[key] || 0.001
      }
    })

    return acc.push(current) && acc
  }, [])
}
