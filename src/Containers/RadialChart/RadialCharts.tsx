import RadialChart from '../../Components/Charts/Base/RadialChart';
import { dateSort } from '../../utils/dateHelpers';
import { interpolate } from '../../utils/interpolate';
import styles from './RadialChart.module.css'

const _usLaborData = require('../../data/uslabor.json');
const _stlsfed = require('../../data/stlsfed.json');

const cpiData = _stlsfed.map((d: any) => {
  const [_year, _month, _date] = d.Month.split("-");
  const [, month, , year] = new Date(_year, _month - 1, _date).toDateString().split(" ")
  const monthString = [month, year].join(" ")

  return {
    ...d,
    Month: monthString
  }
}).sort(dateSort)

const uslaborData = interpolate(_usLaborData)
const commodities = Object.keys(uslaborData[0]).filter(name => name !== "Month")

const RadialCharts = () => {
  return (
    <section className={styles.container}>
      <div className={styles.grid}>
        <RadialChart
          key="CPI all items"
          dataLabel="%"
          title="Consumer Price Index (% change YoY)"
          dimensionName="CPI all items"
          data={cpiData} />
      </div>
      <hr className={styles.hr} />
      <div className={styles.grid}>
        {/* <RadialChart
          title="Bananas ($ / lb)"
          key="CPI all items"
          dimensionName="Bananas ($ / lb)"
          data={uslaborData}
          pathType={pathType}
          dataLabel="$"/> */}
        {commodities.map(commodity =>
          <RadialChart
            key={commodity}
            dataLabel="$"
            data={uslaborData}
            dimensionName={commodity}
          />)}
      </div>
    </section>
  );
};

export default RadialCharts;
