import React, {useState} from "react";
import { Modal, Spinner, Form, Row, Col, Alert } from "react-bootstrap";
import styles from "./saleschannelpage.module.css";
import ModalAddAccount from './ModalAddAccount'

const ModalSalesChannel = ({ show, handleClose, platform, t }) => {
  const [showPlatform, setShowPlatform] = useState(false)

  const openPlatform = () => {
    console.log("openPlatform")
    setShowPlatform(true)
    handleClose()
  }
  const closePlatform = () => setShowPlatform(false)

  return (
    <div>
      <ModalAddAccount
        showPlatform={showPlatform}
        closePlatform={closePlatform}
        t={t}
        platform={platform}
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            Select Account {platform}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.box} onClick={openPlatform}>
            <div className={styles.addAccount}>
              Add Account
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalSalesChannel;
