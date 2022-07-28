import Text from '@visx/text/lib/Text';
import { pointRadial, ScaleLinear, ScaleOrdinal } from 'd3';
import { grey } from '../../../Constants/Colors';
import { MONTHS, MONTHS_IN_RADS } from '../../../Constants/constants';

interface Props {
  xScale: ScaleOrdinal<any, any>,
  yScale: ScaleLinear<any, any>,
}

const RadialLabels = ({ xScale, yScale }: Props) => {
  return <>
    {MONTHS.map((d, index) => {
      const [x, y] = pointRadial(xScale(d) + (MONTHS_IN_RADS / 2), yScale.range()[1]);
      const anchor = index < 6 ? "start" : "end"
      return (
        <g key={d} transform={`translate(${x},${y})`}>
          <Text style={{ userSelect: 'none' }} scaleToFit="shrink-only" width={25} fill={grey} textAnchor={anchor}>{d}</Text>
        </g>
      )
    })}
  </>
};

export default RadialLabels;