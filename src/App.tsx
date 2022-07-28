import styles from './App.module.css';
import RadialCharts from './Containers/RadialChart/RadialCharts';

function App() {
  return (
    <div className={styles.app}>
      <h1>Radify</h1>
      <RadialCharts />
    </div>
  );
}

export default App;
