import styles from './App.module.css';
import RadialCharts from './Containers/RadialChart/RadialCharts';
import Header from './Components/Header/Header';
import { useState } from 'react';
import Footer from './Components/Footer/Footer';

function App() {
  const [pathType, setPathType] = useState("Radial")

  return (
    <div className={styles.app}>
      <Header pathType={pathType} setPathType={setPathType} />
      <RadialCharts pathType={pathType} />
      <Footer />
    </div>
  );
}

export default App;
