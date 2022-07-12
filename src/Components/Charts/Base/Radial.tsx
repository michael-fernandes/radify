import React, { useRef, useState, useEffect } from 'react';
import { Group } from '@visx/group';
import { LineRadial } from '@visx/shape';
import { scaleOrdinal, scaleLog, NumberLike } from '@visx/scale';
import { curveBasisOpen } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { AxisLeft } from '@visx/axis';
import { GridRadial, GridAngle } from '@visx/grid';
import { animated, useSpring } from '@react-spring/web';
import { UslaborData } from '../../Types/data.ts';

const data = require('../../../datums/uslabor.json');

const green = '#e5fd3d';
export const blue = '#aeeef8';
const darkgreen = '#dff84d';
export const background = '#744cca';
const darkbackground = '#603FA8';
const strokeColor = '#744cca';
const springConfig = {
  tension: 50,
};

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


export type LineRadialProps = {
  width?: number;
  height?: number;
  animate?: boolean;
  dimensionName: string;
};

function Radial({ width = 500, height = 500, animate = true, dimensionName = "Bananas per lb" }: LineRadialProps) {
  const lineRef = useRef<SVGPathElement>(null);
  const [lineLength, setLineLength] = useState<number>(0);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);
  const yAccessor = (d: UslaborData) => d[dimensionName] || 0

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

  const spring = useSpring({
    frame: shouldAnimate ? 0 : 1,
    config: springConfig,
    onRest: () => setShouldAnimate(false),
  });

  // set line length once it is known after initial render
  const effectDependency = lineRef.current;
  useEffect(() => {
    if (lineRef.current) {
      setLineLength(lineRef.current.getTotalLength());
    }
  }, [effectDependency]);

  if (width < 10) return null;

  // Update scale output to match component dimensions
  yScale.range([0, height / 2 - padding]);
  const reverseYScale = yScale.copy().range(yScale.range().reverse());
  const handlePress = () => setShouldAnimate(true);

  return (
    <div className="grid-item">
      <h2>{dimensionName}</h2>
      {animate && (
        <>
          <button type="button" onClick={handlePress} onTouchStart={handlePress}>
            Animate
          </button>
          <br />
        </>
      )}
      <svg width={width} height={height} onClick={() => setShouldAnimate(!shouldAnimate)}>
        <LinearGradient from={green} to={blue} id="line-gradient" />
        <rect width={width} height={height} fill={background} rx={14} />
        <Group top={height / 2} left={width / 2}>
          <GridRadial
            scale={yScale}
            numTicks={6}
            stroke={blue}
            strokeWidth={1}
            fill={blue}
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
          <LineRadial angle={angle} radius={radius} curve={curveBasisOpen}>
            {({ path }) => {
              const d = path(data) || '';
              return (
                <>
                  <animated.path
                    d={d}
                    ref={lineRef}
                    strokeWidth={2}
                    strokeOpacity={0.8}
                    strokeLinecap="round"
                    fill="none"
                    stroke={animate ? darkbackground : 'url(#line-gradient)'}
                  />
                  {shouldAnimate && (
                    <animated.path
                      d={d}
                      strokeWidth={2}
                      strokeOpacity={0.8}
                      strokeLinecap="round"
                      fill="none"
                      stroke="url(#line-gradient)"
                      strokeDashoffset={spring.frame.to((v) => v * lineLength)}
                      strokeDasharray={lineLength}
                    />
                  )}
                </>
              );
            }}
          </LineRadial>

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
        </Group>
      </svg>
    </div>
  );
}

export default Radial;
