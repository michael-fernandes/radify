import styles from './Header.module.css'
import { CONTENT } from '../../Constants/constants';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import ReactGA from 'react-ga';

interface Props {
  pathType: string,
  setPathType: (t: string) => void
}
const Header = ({ pathType: gradientType, setPathType: setGradientType }: Props) => {

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newPathType: string,
  ) => {
    ReactGA.event({
      category: "setting",
      action: "change",
      label: newPathType
    });

    setGradientType(newPathType);
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Radify</h1>
      <p className={styles.intro}>
        {CONTENT.intro}
      </p>
      <div className={styles.control}>
        <span className={styles.control_label}>
          Gradient Type:
        </span>
        <ToggleButtonGroup
          color="primary"
          value={gradientType}
          exclusive
          onChange={handleChange}
          size="small"
        >
          <ToggleButton value="Radial">Radial</ToggleButton>
          <ToggleButton value="Linear">Linear</ToggleButton>
        </ToggleButtonGroup>
        {gradientType === "Linear" && <p className={styles.warning}>Warning - missing data: There is a slight implementation hurtle that is causing a few points not to render, stay tuned.</p>}
      </div>
    </header>
  );
};

export default Header;