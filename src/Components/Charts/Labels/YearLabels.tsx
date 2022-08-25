import Text from '@visx/text/lib/Text';
import { pointRadial } from 'd3-shape';
import React from 'react';
import { ChartData } from '../../../Types/data';

interface Props {
  hover: boolean,
  pathType: string,
  radius: (d: ChartData) => number,
  angle: (d: ChartData) => number,
  data: ChartData[],
}
const YearLabels = ({ hover, angle, radius, pathType, data }: Props) => {
  const firstPoint = data[0];
  const lastPoint = data[data.length - 1];
  // const lockdownPoint = data.find((d) => d.Month === "Mar 2020") || {}

  return <>
    {hover && pathType === "linear" ? [firstPoint, lastPoint].map((d, i) => {
      const [x, y] = pointRadial(angle(d), radius(d));
      // return <circle key={`line-cap-${i}`} cx={x} cy={y} fill={darkgreen} r={3} />;
      return (
        <g key={d.Month} transform={`translate(${x},${y})`}>
          <Text scaleToFit="shrink-only" width={50} fill={"black"} textAnchor="middle">{d.Month}</Text>
        </g>
      )
    }) : <></>}
  </>;
};


export default YearLabels;