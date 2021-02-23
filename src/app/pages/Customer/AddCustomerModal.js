import React from "react";

import { Button, Modal, Spinner, Form, Row, Col, Alert } from "react-bootstrap";
import { IconButton, Paper } from "@material-ui/core";
import { Edit } from "@material-ui/icons";

import "../style.css";

const CustomerModal = ({
  stateModal,
  cancelModal,
  title,
  alert,
  loading,
  formikCustomer,
  validationCustomer,
  alertPhoto,
  photoPreview,
  photo,
  handlePreviewPhoto
}) => {
  return (
    <Modal show={stateModal} onHide={cancelModal} size="lg">
      <Modal.Header>{title}</Modal.Header>
      <Form noValidate onSubmit={formikCustomer.handleSubmit}>
        <Modal.Body>
          <Row style={{ padding: "1rem" }}>
            {alert ? <Alert variant="danger">{alert}</Alert> : ""}
            {alertPhoto ? <Alert variant="danger">{alertPhoto}</Alert> : ""}

            <Col md={3}>
              <Paper
                elevation={2}
                style={{
                  width: "120px",
                  height: "120px",
                  overflow: "hidden",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: `url(${photoPreview || photo})`
                }}
              >
                <input
                  accept="image/jpeg,image/png"
                  style={{ display: "none" }}
                  id="icon-button-file"
                  type="file"
                  onChange={handlePreviewPhoto}
                />
                <label htmlFor="icon-button-file">
                  <IconButton
                    color="secondary"
                    aria-label="upload picture"
                    component="span"
                    style={{
                      position: "absolute",
                      left: "-5px",
                      top: "-20px"
                    }}
                  >
                    <Edit />
                  </IconButton>
                </label>
              </Paper>

              <p className="text-muted mt-1">
                Allowed file types: .png, .jpg, .jpeg | File size limit: 2 MB
              </p>
            </Col>

            <Col md={4}>
              <div className="title">Customer Name</div>
              <Form.Control
                type="text"
                name="name"
                {...formikCustomer.getFieldProps("name")}
                className={validationCustomer("name")}
                required
              />
              {formikCustomer.touched.name && formikCustomer.errors.name ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikCustomer.errors.name}
                  </div>
                </div>
              ) : null}

              <div className="title">Customer Email</div>
              <Form.Control
                type="email"
                name="email"
                {...formikCustomer.getFieldProps("email")}
                className={validationCustomer("email")}
                required
              />
              {formikCustomer.touched.email && formikCustomer.errors.email ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikCustomer.errors.email}
                  </div>
                </div>
              ) : null}
            </Col>

            <Col md={4}>
              <div className="title">Customer Phone Number</div>
              <Form.Control
                type="text"
                name="phone_number"
                {...formikCustomer.getFieldProps("phone_number")}
                className={validationCustomer("phone_number")}
                required
              />
              {formikCustomer.touched.phone_number &&
              formikCustomer.errors.phone_number ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikCustomer.errors.phone_number}
                  </div>
                </div>
              ) : null}

              <div className="title">Customer Address</div>
              <Form.Control
                type="text"
                name="address"
                {...formikCustomer.getFieldProps("address")}
                className={validationCustomer("address")}
                required
              />
              {formikCustomer.touched.address &&
              formikCustomer.errors.address ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikCustomer.errors.address}
                  </div>
                </div>
              ) : null}
            </Col>
          </Row>

          <Row style={{ padding: "1rem" }}>
            <Col>
              <Form.Group>
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  name="notes"
                  {...formikCustomer.getFieldProps("notes")}
                  className={validationCustomer("notes")}
                />
              </Form.Group>
              {formikCustomer.touched.notes && formikCustomer.errors.notes ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikCustomer.errors.notes}
                  </div>
                </div>
              ) : null}
            </Col>
          </Row>
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

export default CustomerModal;
