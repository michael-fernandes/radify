import { line, select } from 'd3';
import { useEffect, useRef } from 'react';
import { linePathGradient } from '../../../Constants/Colors';
import segmentPath from '../../../utils/segmentPath';

interface Props {
  width: number,
  height: number,
  path: string
  strokeWidth?: number
}
const GradientPathLine = ({ strokeWidth, width: paddedWidth, height, path }: Props) => {
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (lineRef.current) {
      const lineFunc = line<any>()
        .x(d => d.x)
        .y(d => d.y);

      select(lineRef.current)
        .selectAll('path')
        .data(segmentPath(path, strokeWidth))
        .enter()
        .append('path')
        .attr('fill', (d: any) => linePathGradient(d.progress))
        .attr('d', (d: any) => lineFunc(d.samples));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paddedWidth, height, lineRef])

  return (
    <g className="gradientLine" ref={lineRef} />
  );
};

export default GradientPathLine;