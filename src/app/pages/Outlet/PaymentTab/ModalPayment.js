import React from "react";

import {
  Button,
  Modal,
  Spinner,
  Form,
  Row,
  Col,
  InputGroup
} from "react-bootstrap";
import {} from "react-bootstrap";

import "../../style.css";

const ModalPayment = ({
  stateModal,
  cancelModal,
  title,
  loading,
  formikPayment,
  validationPayment,
  allTypes
}) => {
  return (
    <Modal show={stateModal} onHide={cancelModal} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikPayment.handleSubmit}>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Select Type:</Form.Label>
                <Form.Control
                  as="select"
                  name="payment_method_type_id"
                  {...formikPayment.getFieldProps("payment_method_type_id")}
                  className={validationPayment("payment_method_type_id")}
                  required
                >
                  <option value="" disabled hidden>
                    Choose a Type
                  </option>
                  {allTypes?.length
                    ? allTypes.map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })
                    : ""}
                </Form.Control>
                {formikPayment.touched.payment_method_type_id &&
                formikPayment.errors.payment_method_type_id ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPayment.errors.payment_method_type_id}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  {...formikPayment.getFieldProps("name")}
                  className={validationPayment("name")}
                  required
                />
                {formikPayment.touched.name && formikPayment.errors.name ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPayment.errors.name}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>MDR:</Form.Label>
                <InputGroup className="pb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text style={{ background: "transparent" }}>
                      %
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="number"
                    name="mdr"
                    placeholder="Enter MDR"
                    {...formikPayment.getFieldProps("mdr")}
                    className={validationPayment("mdr")}
                    required
                  />
                </InputGroup>
                {formikPayment.touched.mdr && formikPayment.errors.mdr ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPayment.errors.mdr}
                    </div>
                  </div>
                ) : null}
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
