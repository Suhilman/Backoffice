import React from "react";

import { Button, Modal, Spinner, Form, Alert } from "react-bootstrap";

import "../../style.css";

const AddModal = ({
  stateModal,
  cancelModal,
  title,
  loading,
  alert,
  formikCustom,
  validationCustom
}) => {
  return (
    <Modal show={stateModal} onHide={cancelModal} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={formikCustom.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Form.Group>
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              {...formikCustom.getFieldProps("name")}
              className={validationCustom("name")}
              required
            />
            {formikCustom.touched.name && formikCustom.errors.name ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formikCustom.errors.name}</div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Price:</Form.Label>
            <Form.Control
              type="number"
              name="price"
              {...formikCustom.getFieldProps("price")}
              className={validationCustom("price")}
              required
            />
            {formikCustom.touched.price && formikCustom.errors.price ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formikCustom.errors.price}</div>
              </div>
            ) : null}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cancelModal}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddModal;
