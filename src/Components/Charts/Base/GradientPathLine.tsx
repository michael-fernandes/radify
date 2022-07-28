import { line, select } from 'd3';
import { useEffect, useRef } from 'react';
import { linePathGradient } from '../../../Constants/Colors';
import { UslaborData } from '../../../Types/data';
import { segmentPaths } from '../../../utils/segmentPaths';

interface Props {
  width: number,
  height: number,
  angle: (d: UslaborData) => number,
  radius: (d: UslaborData) => number,
  data: UslaborData[]
}
const GradientPathLine = ({ width: paddedWidth, height, angle, radius, data }: Props) => {
  const lineRef = useRef<SVGPathElement>(null);

  // Add gradient to path 
  // https://www.npmjs.com/package/gradient-path
  useEffect(() => {
    if (lineRef.current && paddedWidth > 150 && height > 150) {

      const lineFunc = line<any>()
        .x(d => d.x)
        .y(d => d.y);

      select(lineRef.current)
        .selectAll('path')
        .data(segmentPaths(data, angle, radius))
        .enter()
        .append('path')
        .attr('fill', (d, i, array) => {
          return (i !== 0 && i <= array.length - 3) ? linePathGradient(d.progress) : "none"
        })
        .attr('d', d => lineFunc(d.samples));
    }
    console.log(paddedWidth)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, paddedWidth, height, lineRef])

  return (
    <g ref={lineRef} />
  );
};

export default GradientPathLine;