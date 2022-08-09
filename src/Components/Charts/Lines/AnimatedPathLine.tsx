import { easings, useSpring } from '@react-spring/core';
import { animated } from '@react-spring/web';

import { LineRadial } from "@visx/shape";
import { curveBasisOpen } from "d3";
import { useEffect, useRef, useState } from "react";
import { ChartData } from "../../../Types/data";
import { RadialGradient } from '@visx/gradient';

const springConfig = {
  duration: 3000,
  easing: easings.easeInOutSine,
};

interface Props {
  angle: (d: ChartData) => number,
  radius: (d: ChartData) => number,
  data: ChartData[],
  shouldAnimate: boolean,
  setShouldAnimate: (b: boolean) => void,
  width: number
}

const AnimatedPathLine = ({ width, angle, radius, data, shouldAnimate, setShouldAnimate }: Props) => {
  const lineRef = useRef<SVGPathElement>(null);

  // const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);
  const [lineLength, setLineLength] = useState<number>(0);

  const spring = useSpring({
    frame: shouldAnimate ? 0 : 1,
    config: springConfig,
    onRest: () => setShouldAnimate(false),
  });

  useEffect(() => {
    if (lineRef.current) {
      setLineLength(lineRef.current.getTotalLength());
    }
  }, [lineRef, width]);


  return (
    <>
      <RadialGradient from={"orange"} to={"purple"} id="line-gradient" />
      <LineRadial angle={angle} radius={radius} curve={curveBasisOpen}>
        {({ path }) => {
          const d = path(data) || '';
          return (
            <>
              <g>

              </g>
              <animated.path
                d={d}
                ref={lineRef}
                strokeWidth={3}
                strokeOpacity={0.8}
                strokeLinecap="round"
                fill="none"
                stroke={!shouldAnimate ? 'url(#line-gradient)' : 'none'} />
              {shouldAnimate && (
                <>
                  <animated.path
                    d={d}
                    strokeWidth={3}
                    strokeOpacity={0.8}
                    strokeLinecap="round"
                    fill="none"
                    stroke="url(#line-gradient)"
                    strokeDashoffset={spring.frame.to((v) => v * lineLength)}
                    strokeDasharray={lineLength} />
                </>
              )}
            </>
          );
        }}
      </LineRadial>
    </>
  );
};

export default AnimatedPathLine;