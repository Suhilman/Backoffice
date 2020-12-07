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
  alert,
  children
}) => {
  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {alert ? <Alert variant="danger">{alert}</Alert> : ""}

        {typeof body === "string" ? <p>{body}</p> : children}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        {handleClick ? (
          <Button variant={buttonColor} onClick={handleClick}>
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              "Save changes"
            )}
          </Button>
        ) : (
          ""
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
