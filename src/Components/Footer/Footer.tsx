import { CONTENT } from '../../Constants/constants';
import styles from './Footer.module.css'

const Footer = () => {
  return (
    <section>
      <div className={styles.made_by}>
        {CONTENT.madeBy}
      </div>
    </section >
  );
};

export default Footer;