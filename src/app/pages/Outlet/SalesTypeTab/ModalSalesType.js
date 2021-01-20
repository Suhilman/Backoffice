import React from "react";

import {
  Button,
  Modal,
  Spinner,
  Form,
  Row,
  Col,
  InputGroup,
  Alert
} from "react-bootstrap";

import "../../style.css";

const ModalPayment = ({
  stateModal,
  cancelModal,
  title,
  loading,
  formikSalesType,
  validationSalesType,
  alert
}) => {
  return (
    <Modal show={stateModal} onHide={cancelModal} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikSalesType.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  {...formikSalesType.getFieldProps("name")}
                  className={validationSalesType("name")}
                  required
                />
                {formikSalesType.touched.name && formikSalesType.errors.name ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikSalesType.errors.name}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Charge:</Form.Label>
                <InputGroup className="pb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text style={{ background: "transparent" }}>
                      %
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="number"
                    name="charge"
                    placeholder="Enter Charge"
                    {...formikSalesType.getFieldProps("charge")}
                    className={validationSalesType("charge")}
                    required
                  />
                </InputGroup>

                {formikSalesType.touched.charge &&
                formikSalesType.errors.charge ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikSalesType.errors.charge}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Require Table"
                  name="require_table"
                  value={formikSalesType.getFieldProps("require_table").value}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (value === "false") {
                      formikSalesType.setFieldValue("require_table", true);
                    } else {
                      formikSalesType.setFieldValue("require_table", false);
                    }
                  }}
                  checked={formikSalesType.getFieldProps("require_table").value}
                />
              </Form.Group>

              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Is Booking"
                  name="is_booking"
                  value={formikSalesType.getFieldProps("is_booking").value}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (value === "false") {
                      formikSalesType.setFieldValue("is_booking", true);
                    } else {
                      formikSalesType.setFieldValue("is_booking", false);
                    }
                  }}
                  checked={formikSalesType.getFieldProps("is_booking").value}
                />
              </Form.Group>

              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Is Delivery"
                  name="is_delivery"
                  value={formikSalesType.getFieldProps("is_delivery").value}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (value === "false") {
                      formikSalesType.setFieldValue("is_delivery", true);
                    } else {
                      formikSalesType.setFieldValue("is_delivery", false);
                    }
                  }}
                  checked={formikSalesType.getFieldProps("is_delivery").value}
                />
              </Form.Group>
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

export default ModalPayment;
