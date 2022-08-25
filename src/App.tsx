import styles from './App.module.css';
import RadialCharts from './Containers/RadialChart/RadialCharts';
import Header from './Components/Header/Header';
import { useEffect } from 'react';
import Footer from './Components/Footer/Footer';
import ReactGA from 'react-ga';

if (process.env.REACT_APP_GA_TRACKER && process.env.NODE_ENV !== "development") {
  ReactGA.initialize(process.env.REACT_APP_GA_TRACKER || '');
}

function App() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])

  return (
    <>
      <div className={styles.app}>
        <Header />
        <RadialCharts />
        <Footer />
      </div>
    </>

  );
}

export default App;
