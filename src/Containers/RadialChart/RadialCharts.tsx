import RadialChart from '../../Components/Charts/Base/RadialChart';
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
const commodities = [
  "Bananas ($ / lb)",
  "Oranges-Navel ($ / lb)",
  "White Bread ($ / lb)",
  "Tomatoes ($ / lb)",
  "Whole Chicken ($ / lb)",
  "Electricity ($ / kWh)",
  "Eggs(grade A) ($ / doz)",
  "Gasoline ($ / gallon)",
  "Ground beef ($ / lb)",
  "Utility (piped) gas ($ / therm)",
  "Milk, fresh ($ / gal)"
];

interface Props {
  pathType: string,
}

const RadialCharts = ({ pathType }: Props) => {
  return (
    <section className={styles.container}>
      <div className={styles.grid}>
        <RadialChart title="Consumer Price Index (% change YoY)" key="CPI all items" dimensionName="CPI all items" data={cpiData} pathType={pathType} />
      </div>
      <hr className={styles.hr} />
      <div className={styles.grid}>
        {commodities.map(commodity => <RadialChart key={commodity} data={uslaborData} dimensionName={commodity} pathType={pathType} />)}
      </div>
    </section>
  );
};

export default RadialCharts;
