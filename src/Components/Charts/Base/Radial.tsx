import { useRef, useEffect } from 'react';
import { Group } from '@visx/group';
import { scaleOrdinal, scaleLinear } from '@visx/scale';
import { AxisLeft } from '@visx/axis';
import { GridRadial, GridAngle } from '@visx/grid';
import { UslaborData } from '../../../Types/data';
import { useMeasure } from "react-use";
import { select } from 'd3'
import { line } from 'd3-shape'

import styles from "./Radial.module.css"
import { extentByDimension } from '../../../utils/extent';
import { MONTHS, MONTHS_IN_RADS } from '../../../Constants/constants';
import { CHART_PADDING } from './constants';
import { segmentPaths } from '../../../utils/segmentPaths';
import { grey, linePathGradient, strokeColor } from '../../../Constants/Colors';
import RadialLabels from './RadialLabels';

const date = ({ Month = '' }: Partial<UslaborData>) => Month.split(' ')[0];
const circularDomain = Array(12).fill(0).map((_d, index) => (index) * MONTHS_IN_RADS);

export type LineRadialProps = {
  dimensionName: string;
  accessor?: any;
  data: UslaborData[];
};

function Radial({ dimensionName, accessor, data }: LineRadialProps) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();
  const lineRef = useRef<SVGPathElement>(null);

  // for random colors
  const index = Math.floor(Math.random() * 2)

  const yAccessor = accessor ?? ((datum: UslaborData) => datum[dimensionName])

  const xScale = scaleOrdinal({
    range: circularDomain,
    domain: MONTHS,
  });

  const yScale = scaleLinear<number>({
    domain: extentByDimension(data, yAccessor),
  });

  const radius = (d: UslaborData) => yScale(yAccessor(d)) ?? 0;
  const angle = (d: UslaborData) => xScale(date(d)) ?? 0;

  // Update scale output to match component dimensions
  yScale.range([0, height / 2 - CHART_PADDING]);
  const reverseYScale = yScale.copy().range(yScale.range().reverse());

  // Add gradient to path 
  // https://www.npmjs.com/package/gradient-path
  useEffect(() => {
    if (lineRef.current && width > 100 && height > 100) {

      const lineFunc = line<any>()
        .x(d => d.x)
        .y(d => d.y);

      select(lineRef.current)
        .selectAll('path')
        .data(segmentPaths(data, angle, radius))
        .enter()
        .append('path')
        .attr('fill', (d, i, arry) => {
          return (i !== 0 && i <= arry.length - 3) ? linePathGradient[index](d.progress) : "none"
        })
        // .attr('stroke', (d, i, arry) => {
        //   return (i !== 0 && i <= arry.length - 3) ? linePathGradient[index](d.progress) : "none"
        // })
        // .attr('fill', (d, i, arry) => linePathGradient(d.progress))
        .attr('d', d => lineFunc(d.samples));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, width, height, lineRef])

  return (
    <div className={styles.grid_wrapper}>
      <h3 className={styles.chart_title}>{dimensionName}</h3>
      <div className={styles.chart} ref={ref}>
        <div >
          <svg width={width} height={height}>
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

              <g ref={lineRef} />

              <GridAngle
                scale={xScale}
                outerRadius={height / 2 - CHART_PADDING}
                stroke={grey}
                strokeWidth={1}
                strokeOpacity={0.3}
                numTicks={10}
              />
              <RadialLabels xScale={xScale} yScale={yScale} />
            </Group>
          </svg>
        </div>
      </div>
    </div >
  );
}

export default Radial;
