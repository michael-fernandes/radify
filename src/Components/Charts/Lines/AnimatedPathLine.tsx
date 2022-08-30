import { easings, useSpring, SpringConfig } from '@react-spring/core';
import { animated } from '@react-spring/web';

import { LineRadial } from "@visx/shape";
import { curveBasisOpen, } from "d3";
import { useEffect, useRef, useState } from "react";
import { ChartData } from "../../../Types/data";
import { RadialGradient } from '@visx/gradient';
import DotAnimation from './DotAnimation';
import { ANIMATION_PERIOD } from '../../../Constants/constants';

interface Props {
  angle: (d: ChartData) => number,
  radius: (d: ChartData) => number,
  data: ChartData[],
  shouldAnimate: boolean,
  setShouldAnimate: (b: boolean) => void,
  width: number
}

const springConfig: SpringConfig = {
  duration: ANIMATION_PERIOD,
  easing: easings.linear,
};

const AnimatedPathLine = ({ width, angle, radius, data, shouldAnimate, setShouldAnimate }: Props) => {
  const lineRef = useRef<SVGPathElement>(null);
  const [debounceAnimate, setDebouncedAnimate] = useState(false)

  const [lineLength, setLineLength] = useState<number>(0);

  const spring = useSpring({
    frame: shouldAnimate ? 0 : 1,
    config: springConfig,
    onStart: () => {
      setDebouncedAnimate(true)
    },
    onRest: () => {
      setShouldAnimate(false)
      setDebouncedAnimate(false)
    },
  });

  useEffect(() => {
    if (lineRef.current) {
      setLineLength(lineRef.current.getTotalLength());
    }
  }, [lineRef, width]);


  return (
    <>
      <RadialGradient from={"grey"} to={"grey"} id="line-gradient" />
      <LineRadial angle={angle} radius={radius} curve={curveBasisOpen}>
        {({ path }) => {
          const d = path(data) || '';
          return (
            <>
              <animated.path
                d={d}
                ref={lineRef}
                strokeWidth={3}
                strokeOpacity={0.8}
                strokeLinecap="round"
                fill="none"
                stroke={'none'} />
              {shouldAnimate && (
                <>
                  <DotAnimation path={d} shouldAnimate={shouldAnimate} data={data} />
                  <animated.path
                    d={d}
                    strokeWidth={3}
                    strokeOpacity={0.8}
                    strokeLinecap="round"
                    fill="none"
                    stroke="grey"
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