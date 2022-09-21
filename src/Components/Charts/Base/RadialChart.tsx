import { useState } from 'react';
import { Group } from '@visx/group';
import { scaleOrdinal, scaleLinear } from '@visx/scale';
import { AxisLeft } from '@visx/axis';
import { GridRadial, GridAngle } from '@visx/grid';
import { pointRadial } from 'd3-shape';
import Text from '@visx/text/lib/Text';

import { useMeasure } from "react-use";
import debounce from 'lodash/debounce';

import { extentByDimension } from '../../../utils/extent';
import { ANIMATION_PERIOD, BLUEISH, DOT_RADIUS, MONTHS, ONE_MONTH_RADIAN } from '../../../Constants/constants';
import { CHART_PADDING } from './constants';
import { grey, strokeColor } from '../../../Constants/Colors';

import RadialLabels from '../Labels/RadialLabels';
import GradientPathLine from '../Lines/GradientPathLine';
import AnimatedPathLine from '../Lines/AnimatedPathLine';
import { radialPath } from '../../../utils/segmentPath';
import { ChartData } from '../../../Types/data';


import "../overrides.css"
import styles from "./Radial.module.css"


const date = (d: ChartData) => d.Month.split(' ')[0];
const circularDomain = Array(12).fill(0).map((_d, index) => (index) * ONE_MONTH_RADIAN);

const innerRadius = 50;

export type LineRadialProps = {
  accessor?: any;
  data: ChartData[];
  dimensionName: string;
  title?: string
  dataLabel?: string
};

function Radial({ dimensionName, accessor, data, title, dataLabel = "" }: LineRadialProps) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();
  const paddedWidth = width - CHART_PADDING;

  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);
  const [debounceAnimate, setDebounceAnimate] = useState<boolean>(false);

  const debouncedAnimateFalse = debounce(() =>
    setDebounceAnimate(false)
    , ANIMATION_PERIOD * 2.1, { leading: false })


  const yAccessor = accessor ?? ((datum: ChartData) => datum[dimensionName]);
  const yScale = scaleLinear<number>({
    domain: extentByDimension(data, yAccessor),
  });
  yScale.range([innerRadius, (paddedWidth - innerRadius) / 2 - CHART_PADDING]);
  const reverseYScale = yScale.copy().range(yScale.range().reverse());

  const xScale = scaleOrdinal({
    range: circularDomain,
    domain: MONTHS,
  });

  const radius = (d: ChartData) => yScale(yAccessor(d)) ?? 0;
  const angle = (d: ChartData) => xScale(date(d)) ?? 0;

  const firstPoint = data[0];
  const lastPoint = data[data.length - 1];

  const radiusLen = height / 2;
  const outerRadiusLen = radiusLen - CHART_PADDING;

  const toggleAnimation = () => {
    if (!debounceAnimate) {
      setShouldAnimate(true);
      setDebounceAnimate(true);
      debouncedAnimateFalse();
    }
  }


  return (
    <div className={styles.grid_wrapper} >
      <h3 className={styles.chart_title}>{title ?? dimensionName}</h3>
      <div className={styles.chart} ref={ref}>
        <div >
          <button className={styles.chart_button} onClick={() => toggleAnimation()}>
            <svg className={styles.svg} width={paddedWidth} height={height}>
              <Group top={radiusLen} left={paddedWidth / 2}>

                <GradientPathLine
                  setShouldAnimate={setShouldAnimate}
                  shouldAnimate={shouldAnimate}
                  path={radialPath(data, angle, radius)}
                  width={paddedWidth}
                  height={height}
                />
                <AnimatedPathLine
                  setShouldAnimate={setShouldAnimate}
                  shouldAnimate={shouldAnimate}
                  angle={angle}
                  radius={radius}
                  data={data}
                  width={width} />
                <GridRadial
                  className={styles.gridRadial}
                  scale={yScale}
                  numTicks={7}
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
                  innerRadius={innerRadius}
                />
                <RadialLabels xScale={xScale} yScale={yScale} />
                {!shouldAnimate &&
                  [firstPoint, lastPoint].map((d, index) => {
                    const [x, y] = pointRadial(angle(d), radius(d));
                    return (
                      <g key={d.Month} transform={`translate(${x},${y})`}>
                        <circle key={`line-cap-${d.MONTH}`} fill={BLUEISH} r={DOT_RADIUS} />
                        <Text
                          x={-5}
                          y={!!index ? 5 : -7}
                          width={40}
                          scaleToFit="shrink-only"
                          fill={BLUEISH}
                          textAnchor={!!index ? "end" : "start"}>
                          {d.Month.split(' ')[0] + " '" + d.Month.split(' ')[1].slice(-2)}
                        </Text>
                      </g>
                    )
                  })
                }
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
                    // dy: '0.25em',
                    stroke: strokeColor,
                    strokeWidth: 0.5,
                    paintOrder: 'stroke',
                  })}
                  tickFormat={(d) => `${dataLabel}${dataLabel === "$" ? String(Number(d).toFixed(2)) : Number(d)}`}
                  hideAxisLine
                // innerRadius={innerRadius}
                />
              </Group>
            </svg>

          </button>
        </div>
      </div>
    </div >
  );
}

export default Radial;
