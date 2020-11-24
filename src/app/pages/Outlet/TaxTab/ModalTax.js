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

const ModalTax = ({
  stateModal,
  cancelModal,
  title,
  loading,
  formikTax,
  validationTax,
  allTypes
}) => {
  return (
    <Modal show={stateModal} onHide={cancelModal} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikTax.handleSubmit}>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Select Type:</Form.Label>
                <Form.Control
                  as="select"
                  name="tax_type_id"
                  {...formikTax.getFieldProps("tax_type_id")}
                  className={validationTax("tax_type_id")}
                  required
                >
                  <option value="" disabled hidden>
                    Choose a Type
                  </option>
                  {allTypes.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </Form.Control>
                {formikTax.touched.tax_type_id &&
                formikTax.errors.tax_type_id ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikTax.errors.tax_type_id}
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
                  placeholder="Enter Tax Name"
                  {...formikTax.getFieldProps("name")}
                  className={validationTax("name")}
                  required
                />
                {formikTax.touched.name && formikTax.errors.name ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formikTax.errors.name}</div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Amount:</Form.Label>
                <InputGroup className="pb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text style={{ background: "transparent" }}>
                      %
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="number"
                    name="value"
                    placeholder="Enter Tax Amount"
                    {...formikTax.getFieldProps("value")}
                    className={validationTax("value")}
                    required
                  />
                </InputGroup>
                {formikTax.touched.value && formikTax.errors.value ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikTax.errors.value}
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

export default ModalTax;
