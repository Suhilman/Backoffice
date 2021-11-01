import React from 'react'
import axios from "axios";
import Select from "react-select";

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
import { useDropzone } from "react-dropzone";

export default function AddCurrency({ 
  t, 
  stateModal, 
  cancelModal, 
  title, 
  formikCurrency, 
  validationCurrency, 
  state, 
  loading, 
  handleSelectOutlet ,
  allOutlets,
  showFeature
}) {
  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValue = optionsOutlet.find(
    (item) => item.value === formikCurrency.values.outlet_id
  );
  optionsOutlet.unshift({ value: 1, label: "All Outlets" });

  return (
    <div>
      <Modal show={stateModal} onHide={cancelModal} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={formikCurrency.handleSubmit}>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("outlet")}:</Form.Label>
                  {state === "Edit" || formikCurrency.values.outlet_id === 0 ? (
                    <Form.Control
                      as="select"
                      name="outlet_id"
                      {...formikCurrency.getFieldProps("outlet_id")}
                      className={validationCurrency("outlet_id")}
                      required
                    >
                      <option value="" disabled hidden>
                        {t("chooseAType")}
                      </option>
                      {optionsOutlet?.length
                        ? optionsOutlet.map((item) => {
                            return (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            );
                          })
                        : ""}
                    </Form.Control>
                  ) : (
                    <Select
                      options={optionsOutlet}
                      isMulti
                      name="outlet_id"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={(value) =>
                        handleSelectOutlet(value, formikCurrency)
                      }
                      // defaultValue={defaultValue}
                    />
                  )}
                  {formikCurrency.touched.outlet_id &&
                  formikCurrency.errors.outlet_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikCurrency.errors.outlet_id}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("currencyA")}:</Form.Label>
                  <Form.Control
                    type="text"
                    name="currency_a"
                    placeholder={t('enterNameCurrencyA')}
                    {...formikCurrency.getFieldProps("currency_a")}
                    className={validationCurrency("currency_a")}
                    required
                  />
                  {formikCurrency.touched.currency_a && formikCurrency.errors.currency_a ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikCurrency.errors.currency_a}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("currencyB")}:</Form.Label>
                  <Form.Control
                    type="text"
                    name="currency_b"
                    placeholder={t('enterNameCurrencyB')}
                    {...formikCurrency.getFieldProps("currency_b")}
                    className={validationCurrency("currency_b")}
                    required
                  />
                  {formikCurrency.touched.currency_b && formikCurrency.errors.currency_b ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikCurrency.errors.currency_b}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("conversionAToB")}:</Form.Label>
                  <Form.Control
                    type="text"
                    name="conversion_a_to_b"
                    placeholder={t("conversionAToB")}
                    {...formikCurrency.getFieldProps("conversion_a_to_b")}
                    className={validationCurrency("conversion_a_to_b")}
                    required
                  />
                  {formikCurrency.touched.conversion_a_to_b && formikCurrency.errors.conversion_a_to_b ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikCurrency.errors.conversion_a_to_b}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelModal}>
              {t("cancel")}
            </Button>
            <Button variant="primary" type="submit">
              {loading ? (
                <Spinner animation="border" variant="light" size="sm" />
              ) : (
                `${t("saveChanges")}`
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}
