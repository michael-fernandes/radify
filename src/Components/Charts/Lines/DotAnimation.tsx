import { easings } from '@react-spring/web';
import Text from '@visx/text/lib/Text';
import { interpolate, select } from 'd3';
import { useCallback, useEffect, useRef, useState } from 'react'
import { ANIMATION_PERIOD, BLUEISH, MONTHS, ONE_MONTH_RADIAN } from '../../../Constants/constants';
import { ChartData } from '../../../Types/data';
import { fauxPathNode } from '../../../utils/segmentPath';


/*
  Started d3 from:
  http://bl.ocks.org/JMStewart/6455921
*/

type Props = {
  path: string
  shouldAnimate: boolean
  data: ChartData[]
}


const radiansFromPoint = (x: number, y: number): number => {
  const atan = Math.atan2(y, x)
  if (atan > (-Math.PI / 2)) {
    return atan + (Math.PI / 2)
  } else {
    return atan + 2 * Math.PI + Math.PI / 2
  }
}

// Yes, yes there is a better way to do this. 
const getDateFromPoint = (rads: number, year: number) => {
  let month;
  MONTHS.forEach((m, index) => {
    if (index * ONE_MONTH_RADIAN < rads) {
      month = m;
    }
  })
  return `${month} '${year}` || '';
}

export default function DotAnimation({ path, shouldAnimate, data }: Props) {
  const ref = useRef(null);
  const [hasLoaded, setLoad] = useState(false);
  const [month, setMonth] = useState(data[0].Month || 'Feb 2020')

  const pathTween = useCallback(() => {

    if (ref.current) {
      const fauxNode = fauxPathNode(path) as any;

      const length = fauxNode.getTotalLength();
      const r = interpolate(0, length);

      // TODO: make this dynamic
      let year = 19;
      let addYear = true;

      return function (t: number) {
        let { x, y } = fauxNode.getPointAtLength(r(t));
        const rads = radiansFromPoint(x, y);

        if (addYear && x > 0 && y > 0) {
          year += 1
          addYear = false;
        } else if (!addYear && x < 0 && y < 0) {
          addYear = true;
        }

        const date = getDateFromPoint(rads, year)
        setMonth(date)

        select(ref.current) // Select circle and group
          .attr("cx", x) // Set the circles cx
          .attr("cy", y) // Set the circles cy
          .attr("transform", `translate(${x},${y})`) // Set the groups translate
      }
    }
    return function (t: number) { }
  }, [ref, path]);

  useEffect(() => {
    if (ref.current && shouldAnimate) {
      select(ref.current)
        .style('opacity', 1)
        .transition()
        .ease(easings.linear)
        .duration(ANIMATION_PERIOD)
        .tween("pathTween", pathTween)
        .on('end', () =>
          select(ref.current)
            .transition()
            .ease(easings.easeInOutBack)
            .duration(250)
            .style("opacity", 0)
        )
    }

  }, [ref, path, shouldAnimate])

  return (
    <g ref={ref} transform={`translate(${0},${0})`}>
      <circle ref={ref} fill={BLUEISH} className="findMe" r={4} />
      <Text fill={BLUEISH} scaleToFit="shrink-only" width={40} x={-5} textAnchor="end">{month}</Text>
    </g>
  )
}