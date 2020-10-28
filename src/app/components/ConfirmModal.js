import React from "react";
import { Button, Modal, Spinner, Alert } from "react-bootstrap";

const ConfirmModal = ({
  title,
  body,
  buttonColor,
  handleClick,
  state,
  closeModal,
  loading,
  alert
}) => {
  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {alert ? <Alert variant="danger">{alert}</Alert> : ""}

        <p>{body}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant={buttonColor} onClick={handleClick}>
          {loading ? (
            <Spinner animation="border" variant="light" size="sm" />
          ) : (
            "Save changes"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
