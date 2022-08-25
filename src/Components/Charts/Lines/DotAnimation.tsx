import { easings } from '@react-spring/web';
import Text from '@visx/text/lib/Text';
import { interpolate, select } from 'd3';
import { useCallback, useEffect, useRef, useState } from 'react'
import { ANIMATION_PERIOD, BLUEISH, DOT_RADIUS, MONTHS, ONE_MONTH_RADIAN } from '../../../Constants/constants';
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
  return `${month}` || '';
}

export default function DotAnimation({ path, shouldAnimate, data }: Props) {
  const ref = useRef(null);
  const [month, setMonth] = useState(data[0].Month || 'Feb 2020')


  const pathTween = useCallback(() => {
    if (ref.current) {
      const fauxNode = fauxPathNode(path) as any;

      const length = fauxNode.getTotalLength();
      const r = interpolate(0, length);

      let year = Number(data[0].Month.split(' ')[1].slice(-2));
      let addYear = false;

      return function (t: number) {
        let { x, y } = fauxNode.getPointAtLength(r(t));

        const rads = radiansFromPoint(x, y);
        const month = getDateFromPoint(rads, year)

        if (month === "Jan" && addYear) {
          year += 1
          addYear = false;
        } else if (month === "Dec" && !addYear) {
          addYear = true;
        }

        setMonth(`${month} '${year}`)
        select(ref.current) // Select circle and group
          .attr("cx", x) // Set the circles cx
          .attr("cy", y) // Set the circles cy
          .attr("transform", `translate(${x},${y})`) // Set the groups translate
      }
    }
    return function (t: number) { }
  }, [ref, path, data]);

  useEffect(() => {
    if (ref.current && shouldAnimate) {
      select(ref.current)
        .style('opacity', 1)
        .transition()
        .ease(easings.linear)
        .duration(ANIMATION_PERIOD)
        .tween("pathTween", pathTween)
        .on('end', () => {
          console.log('ended')
          select(ref.current)
            .transition()
            .ease(easings.easeInOutBack)
            .duration(250)
            .style("opacity", 0)
        }
        )
    }

  }, [ref, path, shouldAnimate, pathTween])

  return (
    <g ref={ref} transform={`translate(${0},${0})`}>
      {/* Double ref assignment allows for d3 updates to both */}
      <circle ref={ref} fill={BLUEISH} r={DOT_RADIUS} />
      <Text
        x={-5}
        y={5}
        width={40}
        scaleToFit="shrink-only"
        fill={BLUEISH}
        textAnchor="end">
        {month}
      </Text>
    </g>
  )
}