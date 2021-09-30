import React, {useState
} from 'react';
import styles from '../pages/registrationmarketing.module.css'
import IconClose from '../../../../images/icons8-multiply-100.png'

const NavDropdown = ({state, handleClose}) => {

  return (
    <div>
      <div className={`${styles.containerNavDropdown} ${state ? styles.show : null }`}>
        Hello World
        <div className={styles.wrapperIconClose} onClick={handleClose}>
          <img src={IconClose} alt="Icon Close" />
        </div>
      </div>
    </div>
  );
}

export default NavDropdown;
