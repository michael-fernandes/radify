import { useRef, useState, useEffect } from 'react';
import { Group } from '@visx/group';
import { LineRadial } from '@visx/shape';
import { scaleOrdinal, scaleLog, NumberLike } from '@visx/scale';
import { curveBasisOpen } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { AxisLeft } from '@visx/axis';
import { GridRadial, GridAngle } from '@visx/grid';
import { animated, useSpring } from '@react-spring/web';
import { UslaborData } from '../../Types/data';

const data = require('../../datums/uslabor.json');

console.log(data)

const green = '#e5fd3d'
export const blue = '#aeeef8'
const darkgreen = '#dff84d'
export const background = '#744cca'
const darkbackground = '#603FA8'
const strokeColor = '#744cca'
const springConfig = {
  tension: 50,
};

// utils
function extent<Datum>(data: Datum[], value: (d: Datum) => number) {
  const values = data.map(value)
  return [Math.min(...values), Math.max(...values)]
}

// accessors
const date = ({Month = ""}: Partial<UslaborData>) => {
  const dd = Month.split(" ")[0]
  return Month.split(" ")[0]
  // return new Date(Month).valueOf()
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
const close = (d: UslaborData) => d["Bananas per lb"];
const formatTicks = (val: NumberLike) => String(val);


const domain = Array(12).fill(0).map((d, index) =>  (index * 1) * (Math.PI * 2 ) / (12))
console.log(domain)
// scales
const xScale = scaleOrdinal({
  // range: [0, Math.PI * 2]
  range: domain,
  // domain: extent(data, date),
  domain: months,
});

const yScale = scaleLog<number>({
  domain: extent(data, close),
});

const angle = (d: UslaborData) => {
  return xScale(date(d)) ?? 0
};

const radius = (d: UslaborData) => yScale(close(d)) ?? 0;
const padding = 20;

const firstPoint = data[0];
const lastPoint = data[data.length - 1];
console.log(data,firstPoint, lastPoint)
console.log(xScale("Mar"))
export type LineRadialProps = {
  width: number;
  height: number;
  animate?: boolean;
};

const Radial = ({ width, height, animate = true }: LineRadialProps) => {
  const lineRef = useRef<SVGPathElement>(null);
  const [lineLength, setLineLength] = useState<number>(0);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

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
    <>
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
          <GridAngle
            scale={xScale}
            outerRadius={height / 2 - padding}
            stroke={green}
            strokeWidth={1}
            strokeOpacity={0.3}
            strokeDasharray="5,2"
            numTicks={10}
          />
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
            tickLabelProps={(val) => ({
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

          {[firstPoint, lastPoint].map((d, i) => {
            const cx = ((angle(d)) * Math.PI) / 180;
            const cy = -(yScale(close(d)) ?? 0);
            console.log(cy, cx)
            return <circle key={`line-cap-${i}`} cx={cx} cy={cy} fill={darkgreen} r={3} />;
          })}
        </Group>
      </svg>
    </>
  );
};

export default Radial;