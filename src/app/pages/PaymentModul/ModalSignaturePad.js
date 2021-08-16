import React from 'react';
import { Modal, Button, Form, Alert } from "react-bootstrap";

const ModalSignaturePad = ({show, close}) => {
  return (
    <div>
      <Modal show={show} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>Signature Pad</Modal.Title>
        </Modal.Header>
          <Modal.Body>
            Hello World!
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              className="px-9 py-4 mx-2"
              variant="primary"
              // onClick={() => submitFormPersonal()}
            >
              Submit
            </Button>
          </Modal.Footer>
      </Modal>
    
    </div>
  );
}

export default ModalSignaturePad;
