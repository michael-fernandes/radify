import Radial from '../../Components/Charts/Base/Radial';
import { UslaborData } from '../../Types/data';
// import './RadialChart.css'
import styles from './RadialChart.module.css'
const _data = require('../../data/uslabor.json');

// probably should put this with the data it self.
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

const dataKeys = Object.keys(data[0]).filter(key => key !== "Month")

const RadialCharts = () => {
  return (
    <div className={styles.container}>

      <div className={styles.grid}>
        {/* {dataKeys.map(dataKey => <Radial key={dataKey} dimensionName={dataKey} />)} */}
        <Radial key="Oranges-Navel per lb" dimensionName="Oranges-Navel per lb" yAccessor={(d: UslaborData) => d["Oranges-Navel per lb"] || 0} data={data} />
      </div>
    </div>
  );
};

export default RadialCharts;