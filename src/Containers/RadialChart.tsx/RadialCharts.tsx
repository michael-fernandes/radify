import Radial from '../../Components/Charts/Base/Radial';
import { dateSort } from '../../utils/dateHelpers';
import { interpolate } from '../../utils/interpolate';
import styles from './RadialChart.module.css'

const _usLaborData = require('../../data/uslabor.json');
const _stlsfed = require('../../data/stlsfed.json');

const cpiData = _stlsfed.map((d: any) => {
  const dateSplit = new Date(d.Month).toDateString().split(" ")
  const monthString = [dateSplit[1], dateSplit[3]].join(" ")

  return {
    ...d,
    Month: monthString
  }
}).sort(dateSort)

const uslaborData = interpolate(_usLaborData)
const uslaborDataDataKeys = Object.keys(uslaborData[0]).filter(key => key !== "Month")

const RadialCharts = () => {
  return (
    <div className={styles.container}>

      <div className={styles.grid}>
        <Radial key="CPI all items" dimensionName="CPI all items" data={cpiData} />
      </div>
      <hr className={styles.hr} />
      <div className={styles.grid}>
        {/* <Radial key="White Bread per lb" dimensionName="White Bread per lb" data={uslaborData} /> */}

        {uslaborDataDataKeys.map(dataKey => <Radial key={dataKey} data={uslaborData} dimensionName={dataKey} />)}
      </div>
    </div>
  );
};

export default RadialCharts;
