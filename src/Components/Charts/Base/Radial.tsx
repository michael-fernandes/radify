import { useRef, useEffect } from 'react';
import { Group } from '@visx/group';
import { scaleOrdinal, scaleLog } from '@visx/scale';
import { AxisLeft } from '@visx/axis';
import { GridRadial, GridAngle } from '@visx/grid';
import { UslaborData } from '../../../Types/data';
import { useMeasure } from "react-use";
import { select } from 'd3'
import { line, pointRadial } from 'd3-shape'

import styles from "./Radial.module.css"
import { extentByDimension } from '../../../utils/extent';
import { MONTHS } from '../../../Constants/constants';
import { CHART_PADDING } from './constants';
import { pathSegments } from '../../../utils/pathSegments';
import { grey, linePathGradient, strokeColor } from '../../../Constants/Colors';
import Text from '@visx/text/lib/Text';

const _data = require('../../../data/uslabor.json');

// probably should put this with the data it self.
const data: UslaborData[] = _data.reduce((acc: UslaborData[], current: UslaborData) => {
  if (!acc.length) return acc.push(current) && acc

  const previous = acc[acc.length - 1]

  Object.keys(current).forEach(key => {
    if (current[key] === null) {
      current[key] = previous[key] || 0.001
    }
  })

  return acc.push(current) && acc
}, [])

const date = ({ Month = '' }: Partial<UslaborData>) => Month.split(' ')[0];

const monthInRadians = Math.PI * 2 / 12;
const circularDomain = Array(12).fill(0).map((_d, index) => (index) * monthInRadians);

const firstPoint = data[0];
const lastPoint = data[data.length - 1];

export type LineRadialProps = {
  dimensionName: string;
};

function Radial({ dimensionName = "Bananas per lb" }: LineRadialProps) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();

  const lineRef = useRef<SVGPathElement>(null);

  const xScale = scaleOrdinal({
    range: circularDomain,
    domain: MONTHS,
  });

  const yAccessor = (d: UslaborData) => d[dimensionName] || 0 as number
  const yScale = scaleLog<number>({
    domain: extentByDimension(data, yAccessor),
  });

  const radius = (d: UslaborData) => yScale(yAccessor(d)) ?? 0;
  const angle = (d: UslaborData) => xScale(date(d)) ?? 0;

  // Update scale output to match component dimensions
  yScale.range([0, height / 2 - CHART_PADDING]);
  const reverseYScale = yScale.copy().range(yScale.range().reverse());

  useEffect(() => {
    if (lineRef.current && width > 100 && height > 100) {

      const lineFunc = line<any>()
        .x(d => d.x)
        .y(d => d.y);

      select(lineRef.current)
        .selectAll('path')
        .data(pathSegments(data, angle, radius))
        .enter()
        .append('path')
        .attr('fill', d => linePathGradient(d.progress))
        .attr('d', d => lineFunc(d.samples));
    }
  }, [data, width, height, lineRef])

  return (
    <div className={styles.grid_wrapper}>
      <h3 className={styles.chart_title}>{dimensionName}</h3>
      <div className={styles.chart} ref={ref}>
        <div >
          <svg width={width} height={height}>
            {/* <rect width={width} height={height} fill={background} rx={14} /> */}
            <Group top={height / 2} left={width / 2}>
              <GridRadial
                scale={yScale}
                numTicks={6}
                stroke={grey}
                strokeWidth={1}
                fill={grey}
                fillOpacity={0.1}
                strokeOpacity={0.2}
              />
              <AxisLeft
                top={-height / 2 + CHART_PADDING}
                scale={reverseYScale}
                numTicks={5}
                tickStroke="none"
                tickLabelProps={() => ({
                  fontSize: 8,
                  fill: "black",
                  fillOpacity: 1,
                  textAnchor: 'middle',
                  dx: '1em',
                  dy: '-0.5em',
                  stroke: strokeColor,
                  strokeWidth: 0.5,
                  paintOrder: 'stroke',
                })}
                tickFormat={(d) => String(d)}
                hideAxisLine
              />

              {/* {[firstPoint, lastPoint].map((d) => {
            const cx = ((angle(d)) * Math.PI) / 180;
            const cy = -(yScale(yAccessor(d)) ?? 0);
            return <circle key={`line-cap-${d.Month}`} cx={cx} cy={cy} fill={darkgreen} r={3} />;
          })} */}

              <GridAngle
                scale={xScale}
                outerRadius={height / 2 - CHART_PADDING}
                stroke={grey}
                strokeWidth={1}
                strokeOpacity={0.3}
                numTicks={10}
              />
              <g ref={lineRef} />
              {MONTHS.map((d, index) => {
                const [x, y] = pointRadial(xScale(d) + (monthInRadians / 2), yScale.range()[1])

                return <g transform={`translate(${x},${y})`}>
                  <g transform={`rotate(${((xScale(d)) * 180 / Math.PI - 90)})translate${yScale.range()[1]}`}><g transform={(xScale(d) + Math.PI / 2) % (2 * Math.PI) < Math.PI
                    ? "rotate(90) translate(0,25)"
                    : "rotate(-90) translate(0,-9)"}></g>
                    <Text textAnchor="middle">{d}</Text>
                  </g>
                </g>
              })}
            </Group>
          </svg>
        </div>
      </div>
    </div >
  );
}

export default Radial;
