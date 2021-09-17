import React, {useState} from "react";
import { Modal, Button, Spinner, Form, Row, Col, Alert } from "react-bootstrap";
import styles from "./saleschannelpage.module.css";

const ModalAddAccount = ({ showPlatform, closePlatform, platform, t }) => {
  const [account, setAccount] = useState("")

  const handleSave = () => {
    console.log("Akun nya", account)
  }
  return (
    <div>
      <Modal show={showPlatform} onHide={closePlatform}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            {t('addAccount')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>{t('enterYourDomainNameIn')} <span className="font-weight-bold">{platform}</span></Form.Label>
            <Form.Control
              placeholder={t("enterNewAccount")}
              name="add_account"
              required
              onChange={(e) => setAccount(e.target.value)}
            />
          </Form.Group>
          {/* <div className="d-flex justify-content-end">
            <div className="btn btn-primary">Submit</div>
          </div> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSave}>
          {t('addAccount')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalAddAccount;
