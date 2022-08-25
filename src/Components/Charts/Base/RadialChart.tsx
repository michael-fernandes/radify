import { Group } from '@visx/group';
import { scaleOrdinal, scaleLinear } from '@visx/scale';
import { AxisLeft } from '@visx/axis';
import { GridRadial, GridAngle } from '@visx/grid';
import { ChartData } from '../../../Types/data';

import { useMeasure } from "react-use";

import { extentByDimension } from '../../../utils/extent';
import { BLUEISH, MONTHS, ONE_MONTH_RADIAN } from '../../../Constants/constants';
import { CHART_PADDING } from './constants';
import { grey, strokeColor } from '../../../Constants/Colors';

import RadialLabels from '../Labels/RadialLabels';
import GradientPathLine from '../Lines/GradientPathLine';
import "../overrides.css"
import AnimatedPathLine from '../Lines/AnimatedPathLine';
import { useEffect, useState } from 'react';
import { radialPath } from '../../../utils/segmentPath';
import Legend from '../Legend/Legend';
import { pointRadial } from 'd3-shape';
import Text from '@visx/text/lib/Text';

import styles from "./Radial.module.css"


const date = (d: ChartData) => d.Month.split(' ')[0];
const circularDomain = Array(12).fill(0).map((_d, index) => (index) * ONE_MONTH_RADIAN);

export type LineRadialProps = {
  accessor?: any;
  data: ChartData[];
  dimensionName: string;
  pathType: string,
  title?: string
  showLegend?: boolean
  dataLabel?: string
};

function Radial({ dimensionName, accessor, data, pathType, title, showLegend, dataLabel = "" }: LineRadialProps) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);

  const paddedWidth = width - 20;

  const yAccessor = accessor ?? ((datum: ChartData) => datum[dimensionName])

  const xScale = scaleOrdinal({
    range: circularDomain,
    domain: MONTHS,
  });

  const yScale = scaleLinear<number>({
    domain: extentByDimension(data, yAccessor),
  });

  // Update scale output to match component dimensions
  yScale.range([0, paddedWidth / 2 - CHART_PADDING]);
  const reverseYScale = yScale.copy().range(yScale.range().reverse());

  const radius = (d: ChartData) => yScale(yAccessor(d)) ?? 0;
  const angle = (d: ChartData) => xScale(date(d)) ?? 0;

  const firstPoint = data[0];
  const lastPoint = data[data.length - 1];

  const radiusLen = height / 2
  const outerRadiusLen = radiusLen - CHART_PADDING

  useEffect(() => {
    setShouldAnimate(true)
  }, [])

  const mouseOver = () => setHover(true)
  const mouseOut = () => setHover(false)

  return (
    <div className={styles.grid_wrapper} onMouseOver={mouseOver} onMouseOut={mouseOut} >
      <h3 className={styles.chart_title}>{title ?? dimensionName}</h3>
      <div className={styles.chart} ref={ref}>
        <div >
          <svg className={styles.svg} width={paddedWidth} height={height} onClick={() => { !shouldAnimate && setShouldAnimate(!shouldAnimate) }}>
            <Group top={radiusLen} left={paddedWidth / 2}>

              <AxisLeft
                top={-outerRadiusLen}
                scale={reverseYScale}
                numTicks={5}
                tickStroke="none"
                tickLabelProps={() => ({
                  fontSize: 8,
                  fill: "black",
                  fillOpacity: 1,
                  textAnchor: 'middle',
                  dx: '1em',
                  dy: '-0.8em',
                  stroke: strokeColor,
                  strokeWidth: 0.5,
                  paintOrder: 'stroke',
                })}
                tickFormat={(d) => `${dataLabel}${String(d)}`}
                hideAxisLine
              />
              <GradientPathLine
                shouldAnimate={shouldAnimate}
                path={radialPath(data, angle, radius)}
                width={paddedWidth}
                height={height}
              />
              < AnimatedPathLine
                setShouldAnimate={setShouldAnimate}
                shouldAnimate={shouldAnimate}
                angle={angle}
                radius={radius}
                data={data}
                width={width} />
              <GridRadial
                className={styles.gridRadial}
                scale={yScale}
                numTicks={6}
                stroke={grey}
                strokeWidth={1}
                fill={grey}
                fillOpacity={0.1}
                strokeOpacity={0.2}
              />
              <GridAngle
                scale={xScale}
                outerRadius={outerRadiusLen}
                stroke={grey}
                strokeWidth={1}
                strokeOpacity={0.3}
                numTicks={10}
              />
              <RadialLabels xScale={xScale} yScale={yScale} />
              {!shouldAnimate &&
                [firstPoint, lastPoint].map((d, index) => {
                  const [x, y] = pointRadial(angle(d), radius(d));
                  return (
                    <g key={d.Month} transform={`translate(${x},${y})`}>
                      <circle key={`line-cap-${d.MONTH}`} fill={BLUEISH} r={4} />
                      <Text scaleToFit="shrink-only"
                        x={-4} y={-7}
                        width={40}
                        fill={BLUEISH}
                        textAnchor="middle">
                        {d.Month.split(' ')[0] + " '" + d.Month.split(' ')[1].slice(-2)}
                      </Text>
                    </g>
                  )
                })
              }
            </Group>
          </svg>
        </div>
      </div>
      {showLegend && pathType && pathType === "Linear" && !shouldAnimate &&
        <Legend p1={firstPoint} p2={lastPoint} />}
    </div >
  );
}

export default Radial;
