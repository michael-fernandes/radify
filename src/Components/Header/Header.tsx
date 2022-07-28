import styles from './Header.module.css'
import { CONTENT } from '../../Constants/constants';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useState } from 'react';

interface Props {
  pathType: string,
  setPathType: (t: string) => void
}
const Header = ({ pathType, setPathType }: Props) => {

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newPathType: string,
  ) => {
    setPathType(newPathType);
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Radify</h1>
      <p className={styles.intro}>
        {CONTENT.intro}
      </p>
      <div className={styles.control}>
        <span>
          Gradient Type:
        </span>
        <ToggleButtonGroup
          color="primary"
          value={pathType}
          exclusive
          onChange={handleChange}
          size="small"
        >
          <ToggleButton value="Radial">Radial</ToggleButton>
          <ToggleButton value="Linear">Linear</ToggleButton>
        </ToggleButtonGroup>
        {pathType === "Linear" && <p>Warning - Missing Data: This setting does not render the first and last point.</p>}
      </div>
    </header>
  );
};

export default Header;