import { line, select } from 'd3';
import { useEffect, useRef, useState } from 'react';
import { linePathGradient } from '../../../Constants/Colors';
import segmentPath from '../../../utils/segmentPath';

interface Props {
  width: number,
  height: number,
  path: string
  strokeWidth?: number
  shouldAnimate?: boolean
  isLegend?: boolean
  setShouldAnimate?: (b: boolean) => void,
}

const GradientPathLine = ({ strokeWidth, width: paddedWidth, height, path, shouldAnimate = false, setShouldAnimate, isLegend = false }: Props) => {
  const lineRef = useRef<SVGPathElement>(null);
  const [firstLoad, setFirstLoad] = useState(true);
  useEffect(() => {
    if ((lineRef.current && (paddedWidth > 150 && height > 150)) || isLegend) {
      const lineFunc = line<any>()
        .x(d => d.x)
        .y(d => d.y);

      select(lineRef.current)
        .selectAll('path')
        .data(segmentPath(path, strokeWidth))
        .enter()
        .append('path')
        .attr('fill', (d: any) => linePathGradient(d.progress))
        .attr('d', (d: any) => lineFunc(d.samples))
        .on('end', () => {
          if (firstLoad) {
            setFirstLoad(false);
            setShouldAnimate && setShouldAnimate(true);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paddedWidth, height, paddedWidth, lineRef])

  return (
    <g className="gradientLine" ref={lineRef} style={{ opacity: shouldAnimate ? 0 : 1 }} />
  );
};

export default GradientPathLine;
