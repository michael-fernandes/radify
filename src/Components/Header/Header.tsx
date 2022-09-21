import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Radify</h1>
      <p className={styles.intro}>
        Visualize the seasonality in inflation data.
        Data sources include Consumer Price Index(CPI) (% YoY Change) and commoditiy index from
        the <a href="https://fred.stlouisfed.org/series/CPIAUCSL">St. Louis Fed</a> and <a href="https://www.bls.gov/charts/consumer-price-index/consumer-price-index-average-price-data.htm">Us Labor Department</a> respectively.
      </p>
    </header>
  );
};

export default Header;