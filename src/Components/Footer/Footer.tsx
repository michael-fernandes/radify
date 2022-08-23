import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer>
      <div className={styles.made_by}>
        Made by <a href="https://www.linkedin.com/in/mike-fernandes/">Michael Fernandes</a> in Jul 2022, using React, VisX and D3.js
      </div>
    </footer>
  );
};

export default Footer;