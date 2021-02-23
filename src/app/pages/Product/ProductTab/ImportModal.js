import React from "react";
import { Button, Modal, Spinner, Alert, Form, Row, Col } from "react-bootstrap";
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

  const handleDownload = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const newWindow = window.open(
      `${API_URL}/templates/template-product.xlsx`,
      "_blank",
      "noopener,noreferrer"
    );
    if (newWindow) newWindow.opener = null;
  };

  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Import Product</Modal.Title>
      </Modal.Header>

      <Form onSubmit={formikImportProduct.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Row>
            <Col>
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
            </Col>
          </Row>

          <Row>
            <Col>
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
                    <>
                      <p>
                        Drag 'n' drop some files here, or click to select files
                      </p>
                      <p style={{ color: "gray" }}>File Size Limit: 2 MB</p>
                    </>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>Download Template Excel:</Form.Label>
                <div
                  className="box"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={handleDownload}
                  >
                    Download Template
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>
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
