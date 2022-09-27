import React from "react";

import {
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Container,
  Row,
  Col
} from "react-bootstrap";
import {
  FormGroup,
  FormControl,
  FormControlLabel,
  Switch
} from "@material-ui/core";

const ModalNotification = ({
  state,
  closeModal,
  loading,
  alert,
  title,
  formikNotification,
  validationNotification,
  accessLists,
  t,
  handleSelectAll
}) => {
  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikNotification.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Tittle"
              // {...formikDevice.getFieldProps("name")}
              // className={validationDevice("name")}
              required 
            /><div style={{ padding: 5 }}></div>
     
            <textarea
              type="text"
              placeholder="Description"
              // {...formikDevice.getFieldProps("name")}
              // className={validationDevice("name")}
              required
              cols={69}
              rows={10}
            /> <div style={{ padding: 5 }}></div>
            <Form.Control
              type="date"
              placeholder="Tanggal"
              // {...formikDevice.getFieldProps("name")}
              // className={validationDevice("name")}
              required
            /> <div style={{ padding: 5 }}></div>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
          {t("close")}
          </Button>
          <Button type="submit">
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              `${t("Save And Send")}`
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalNotification;
