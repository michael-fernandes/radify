import styles from './App.module.css';
import RadialCharts from './Containers/RadialChart/RadialCharts';
import Header from './Components/Header/Header';
import { useEffect, useState } from 'react';
import Footer from './Components/Footer/Footer';
import ReactGA from 'react-ga';

if (process.env.REACT_APP_GA_TRACKER && process.env.NODE_ENV === "development") {
  ReactGA.initialize('UA-73790222-1');
}

function App() {
  const [pathType, setPathType] = useState("Linear")

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])

  return (
    <>
      <div className={styles.app}>
        <Header pathType={pathType} setPathType={setPathType} />
        <RadialCharts pathType={pathType} />
        <Footer />
      </div>
    </>

  );
}

export default App;
