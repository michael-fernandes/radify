// TODO: do this to data itself
export const interpolate = (data: any[]): any[]  => { 
  const interpolated = data.reduce((acc: any[], current: any) => {
    if (!acc.length) {
      return [...acc, current]
    }
    const previous = acc[acc.length - 1]

    Object.keys(current).forEach(key => {
      if (current[key] === null) {
        current[key] = previous[key]
      }
    })

    return [...acc, current]
  }, []);
  
  return [
    ...interpolated,
    interpolated[interpolated.length - 1],
    interpolated[interpolated.length - 1]  
  ];
}
