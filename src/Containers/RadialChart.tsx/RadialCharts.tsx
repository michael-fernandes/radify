import Radial from '../../Components/Charts/Base/Radial';
// import './RadialChart.css'
import styles from './RadialChart.module.css'
const data = require('../../data/uslabor.json');

const dataKeys = Object.keys(data[0]).filter(key => key !== "Month")

const RadialCharts = () => {
  return (
    <div className={styles.container}>

      <div className={styles.grid}>
        {/* {dataKeys.map(dataKey => <Radial key={dataKey} dimensionName={dataKey} />)} */}
        <Radial key="Oranges-Navel per lb" dimensionName="Oranges-Navel per lb" />
      </div>
    </div>
  );
};

export default RadialCharts;