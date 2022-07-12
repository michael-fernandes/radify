import Radial from "../../Components/Charts/Base/Radial";
import './RadialChart.css'

const data = require('../../datums/uslabor.json');

console.log(data)
const dataKeys = Object.keys(data[0]).filter(key => key !== "Month")

const RadialCharts = () => {
  return (
    <div>
      {dataKeys.map(dataKey => <Radial key={dataKey} dimensionName={dataKey} />)}
      {/* <Radial key="Oranges-Navel per lb" dimensionName="Oranges-Navel per lb" />
      <Radial key="Bananas per lb" dimensionName="Bananas per lb" /> */}
    </div>
  );
};

export default RadialCharts;