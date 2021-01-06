import React from "react";

import { Button, Modal, Spinner, Form, Alert } from "react-bootstrap";
import Select from "react-select";

import "../../style.css";

const AddModal = ({
  stateModal,
  cancelModal,
  title,
  loading,
  alert,
  formikUnitConversion,
  validationUnitConverion,
  allUnits
}) => {
  const optionsUnitFrom = allUnits.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueUnitFrom = optionsUnitFrom.find(
    (val) => val.value === formikUnitConversion.values.unit_from_id
  );

  const optionsUnitTo = allUnits.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueUnitTo = optionsUnitTo.find(
    (val) => val.value === formikUnitConversion.values.unit_to_id
  );

  return (
    <Modal show={stateModal} onHide={cancelModal} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={formikUnitConversion.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Form.Group>
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              {...formikUnitConversion.getFieldProps("name")}
              className={validationUnitConverion("name")}
              required
            />
            {formikUnitConversion.touched.name &&
            formikUnitConversion.errors.name ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikUnitConversion.errors.name}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Unit From:</Form.Label>
            <Select
              options={optionsUnitFrom}
              defaultValue={defaultValueUnitFrom}
              name="unit_from_id"
              className="basic-single"
              classNamePrefix="select"
              onChange={(value) =>
                formikUnitConversion.setFieldValue("unit_from_id", value.value)
              }
            />
            {formikUnitConversion.touched.unit_from_id &&
            formikUnitConversion.errors.unit_from_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikUnitConversion.errors.unit_from_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Unit To:</Form.Label>
            <Select
              options={optionsUnitTo}
              defaultValue={defaultValueUnitTo}
              name="unit_to_id"
              className="basic-single"
              classNamePrefix="select"
              onChange={(value) =>
                formikUnitConversion.setFieldValue("unit_to_id", value.value)
              }
            />
            {formikUnitConversion.touched.unit_to_id &&
            formikUnitConversion.errors.unit_to_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikUnitConversion.errors.unit_to_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Value:</Form.Label>
            <Form.Control
              type="number"
              name="value"
              {...formikUnitConversion.getFieldProps("value")}
              className={validationUnitConverion("value")}
              required
            />
            {formikUnitConversion.touched.value &&
            formikUnitConversion.errors.value ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikUnitConversion.errors.value}
                </div>
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
