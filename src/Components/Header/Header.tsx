import styles from './Header.module.css'
import { CONTENT } from '../../Constants/constants';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Radify</h1>
      <p className={styles.intro}>
        {CONTENT.intro}
      </p>
    </header>
  );
};

export default Header;