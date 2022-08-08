// TODO: Modify data itself once
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
  
  // Helps gradient path.
  return [
    interpolated[0],
    ...interpolated,
    interpolated[interpolated.length - 1]  
  ];
}
