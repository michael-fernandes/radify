import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Group } from '@visx/group';
import { LineRadial } from '@visx/shape';
import { scaleOrdinal, scaleLog, NumberLike } from '@visx/scale';
import { curveBasisOpen } from '@visx/curve';
import { LinearGradient, GradientPinkBlue } from '@visx/gradient';
import { AxisLeft } from '@visx/axis';
import { GridRadial, GridAngle } from '@visx/grid';
import { UslaborData } from '../../../Types/data';
import { useMeasure } from "react-use";
import * as d3 from 'd3'
import { lineRadial, line } from 'd3-shape'

import { getData, strokeToFill } from 'gradient-path-typescript';

import styles from "./Radial.module.css"

const _data = require('../../../datums/uslabor.json');

const colors = d3.interpolateRgb.gamma(2.2)("blue", "red");

const segments = 50;
const samples = 10;
const precision = 3;
const ww = 4;

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

const lineStartColor = "#011959"
const lineEndColor = "#FACCFA"

const green = '#e5fd3d';
export const blue = '#aeeef8';
const darkgreen = '#dff84d';
export const background = 'grey';
const darkbackground = '#603FA8';
const strokeColor = '#744cca';
const springConfig = {
  tension: 50,
};

interface Acc {
  [key: string]: UslaborData[]
}
// utils
function extent<Datum>(data: Datum[], value: (d: Datum) => number) {
  const values = data.map(value)
  return [Math.min(...values) || 1, Math.max(...values)]
}

const date = ({ Month = '' }: Partial<UslaborData>) => Month.split(' ')[0];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const formatTicks = (val: NumberLike) => String(val);

// Creates a circular domain where each slice is a month of the year
const domain = Array(12).fill(0).map((d, index) => ((index * 1) * (Math.PI * 2)) / (12));

const padding = 20;

const firstPoint = data[0];
const lastPoint = data[data.length - 1];

const yAccessor = (d: UslaborData) => d[dimensionName] || 0 as number

export type LineRadialProps = {
  // width?: number;
  // height?: number;
  animate?: boolean;
  dimensionName: string;
};

function Radial({ animate = true, dimensionName = "Bananas per lb" }: LineRadialProps) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();

  const lineRef = useRef<SVGPathElement>(null);
  const newLine = useRef<SVGPathElement>(null);

  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

  // Accessors

  //Scales
  const yScale = scaleLog<number>({
    domain: extent(data, yAccessor),
  });

  const xScale = scaleOrdinal({
    // range: [0, Math.PI * 2]
    range: domain,
    // domain: extent(data, date),
    domain: months,
  });

  const radius = (d: UslaborData) => yScale(yAccessor(d)) ?? 0;
  const angle = (d: UslaborData) => xScale(date(d)) ?? 0;

  const radialPath = lineRadial<any>().angle(d => angle(d)).radius(d => radius(d)).curve(curveBasisOpen)

  // Update scale output to match component dimensions
  yScale.range([0, height / 2 - padding]);
  const reverseYScale = yScale.copy().range(yScale.range().reverse());


  interface Sample {
    x: number;
    y: number;
  }

  useEffect(() => {
    if (newLine.current && width > 100 && height > 100) {
      const fauxPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      fauxPathElement.setAttribute("d", radialPath(data) || '');

      const dataSegments = getData({ path: fauxPathElement, segments, samples, precision });

      const lineFunc = line<any>()
        .x(d => d.x)
        .y(d => d.y);

      d3.select(newLine.current)
        .selectAll('path')
        .data(strokeToFill(dataSegments, ww, precision))
        .enter()
        .append('path')
        .attr('fill', d => colors(d.progress))
        .attr('d', d => lineFunc(d.samples));
    }
  }, [data, lineRef, width, height, newLine])

  return (
    <div className={styles.grid_wrapper}>
      <h3 className={styles.chart_title}>{dimensionName}</h3>
      <div className={styles.chart} ref={ref}>
        <div >
          <svg width={width} height={height} onClick={() => setShouldAnimate(!shouldAnimate)}>
            <LinearGradient from={green} to={blue} id="line-gradient" />
            <LinearGradient from={"#1C2A6E"} to={"#BA241E"} id="line" />
            <rect width={width} height={height} fill={background} rx={14} />
            <Group top={height / 2} left={width / 2}>
              <GridRadial
                scale={yScale}
                numTicks={6}
                stroke={darkgreen}
                strokeWidth={1}
                fill={darkgreen}
                fillOpacity={0.1}
                strokeOpacity={0.2}
              />
              <AxisLeft
                top={-height / 2 + padding}
                scale={reverseYScale}
                numTicks={5}
                tickStroke="none"
                tickLabelProps={() => ({
                  fontSize: 8,
                  fill: blue,
                  fillOpacity: 1,
                  textAnchor: 'middle',
                  dx: '1em',
                  dy: '-0.5em',
                  stroke: strokeColor,
                  strokeWidth: 0.5,
                  paintOrder: 'stroke',
                })}
                tickFormat={formatTicks}
                hideAxisLine
              />

              {/* {[firstPoint, lastPoint].map((d) => {
            const cx = ((angle(d)) * Math.PI) / 180;
            const cy = -(yScale(yAccessor(d)) ?? 0);
            return <circle key={`line-cap-${d.Month}`} cx={cx} cy={cy} fill={darkgreen} r={3} />;
          })} */}
              <GridAngle
                scale={xScale}
                outerRadius={height / 2 - padding}
                stroke={green}
                strokeWidth={1}
                strokeOpacity={0.3}
                strokeDasharray="5,2"
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
