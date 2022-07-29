import { CONTENT } from '../../Constants/constants';
import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer>
      <div className={styles.made_by}>
        {CONTENT.madeBy}
      </div>
    </footer>
  );
};

export default Footer;