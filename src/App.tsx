import './App.css';
import Radial from './Components/Charts/Radial';
import RadialCharts from './Containers/RadialCharts';

function App() {
  return (
    <div className="App">
      <h1>Radify</h1>
      <Radial width={500} height={500} />
      <RadialCharts />
    </div>
  );
}

export default App;
