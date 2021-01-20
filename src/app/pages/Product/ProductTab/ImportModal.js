import React from "react";
import { Button, Modal, Spinner, Alert, Form } from "react-bootstrap";
import Select from "react-select";
import { useDropzone } from "react-dropzone";

const ConfirmModal = ({
  state,
  loading,
  alert,
  closeModal,
  formikImportProduct,
  allOutlets,
  handleFile,
  filename
}) => {
  const handleSelectOutlet = (value) => {
    if (value) {
      const outlet = value.map((item) => item.value);
      formikImportProduct.setFieldValue("outlet_id", outlet);
    } else {
      formikImportProduct.setFieldValue("outlet_id", []);
    }
  };

  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept:
      "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    maxSize: 5 * 1000 * 1000,
    onDrop(file) {
      handleFile(file);
    }
  });

  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Import Product</Modal.Title>
      </Modal.Header>

      <Form onSubmit={formikImportProduct.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Form.Group>
            <Form.Label>Location:</Form.Label>
            <Select
              options={optionsOutlet}
              isMulti
              name="outlet_id"
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(value) => handleSelectOutlet(value)}
            />
            {formikImportProduct.touched.outlet_id &&
            formikImportProduct.errors.outlet_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikImportProduct.errors.outlet_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Import Excel:</Form.Label>
            <div
              {...getRootProps({
                className: "boxDashed dropzone"
              })}
            >
              <input {...getInputProps()} />
              {filename ? (
                <p>{filename}</p>
              ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
              )}
            </div>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              "Confirm"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ConfirmModal;