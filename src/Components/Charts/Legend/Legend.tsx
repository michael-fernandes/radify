import { ChartData } from '../../../Types/data';
import GradientPathLine from '../Lines/GradientPathLine';
import styles from './Legend.module.css';

const WIDTH = 200;
const HEIGHT = 4;

interface Props {
  p1: ChartData,
  p2: ChartData
}

const Legend = ({ p1, p2 }: Props) => {
  return (
    <>
      <svg width={WIDTH} height={HEIGHT}>
        <GradientPathLine strokeWidth={HEIGHT} path={`M 0 2 L ${WIDTH} 2`} width={WIDTH} height={HEIGHT} />
      </svg>
      <div style={{ width: WIDTH }} className={styles.label} >
        <div>
          {p1.Month}
        </div>
        <div>
          {p2.Month}
        </div>
      </div>
    </>
  );
};

export default Legend;