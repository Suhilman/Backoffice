import React from "react";

import { Button, Modal, Form, Spinner, Alert } from "react-bootstrap";

const ProductCategoryModal = ({
  state,
  closeModal,
  loading,
  alert,
  title,
  formikCategory,
  inputRef,
  t
}) => {
  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={formikCategory.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Form.Group>
            <Form.Label>{t("categoryName")}</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex. : Food"
              {...formikCategory.getFieldProps("name")}
              ref={inputRef}
              required
            />
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
              `${t("saveChanges")}`
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProductCategoryModal;
