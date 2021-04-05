import React from "react";
import { FormikProvider, FieldArray } from "formik";

import { Button, Modal, Spinner, Form, Row, Col, Alert } from "react-bootstrap";

import "../../style.css";

const SpecialPromoModal = ({
  stateModal,
  cancelModal,
  title,
  loading,
  alert,
  formikPromo,
  validationPromo,
  loyaltyPromos,
  allOutlets,
  allProducts,
  selectedProducts,
  handleSelectedProducts,
  t
}) => {
  const [listProducts, setListProducts] = React.useState([]);
  const [filter, setFilter] = React.useState([]);

  React.useEffect(() => {
    if (selectedProducts.length) {
      const currSelectedProducts = filter.filter(
        (item) => !selectedProducts.find((val) => item.id === val.id)
      );
      setListProducts(currSelectedProducts);
    } else {
      setListProducts(filter);
    }
  }, [selectedProducts, filter]);

  const handleSelect = (e) => {
    const { value } = e.target;
    const currPromoProducts = loyaltyPromos
      .filter((item) => item.outlet_id === parseInt(value))
      .map((item) => item.product_id);

    const filterAllProducts = allProducts.filter(
      (item) => !currPromoProducts.find((val) => item.id === val)
    );
    setFilter(filterAllProducts);

    formikPromo.setFieldValue("outlet_id", value);
  };

  return (
    <Modal show={stateModal} onHide={cancelModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={formikPromo.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Form.Group>
            <Form.Label>{t("outlet")}:</Form.Label>
            <Form.Control
              as="select"
              name="outlet_id"
              {...formikPromo.getFieldProps("outlet_id")}
              className={validationPromo("outlet_id")}
              onChange={handleSelect}
              onBlur={handleSelect}
              required
            >
              <option value="" disabled hidden>
              {t("chooseOutlet")}
              </option>
              {allOutlets.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
            {formikPromo.touched.outlet_id && formikPromo.errors.outlet_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikPromo.errors.outlet_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("product")}:</Form.Label>
            <Form.Control
              as="select"
              value={""}
              onChange={handleSelectedProducts}
            >
              <option value="" disabled hidden>
              {t("chooseProduct")}
              </option>
              {listProducts.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>

          <FormikProvider value={formikPromo}>
            <FieldArray
              name="loyaltyPromo"
              render={(arrayHelpers) => {
                return (
                  <div>
                    <Row style={{ padding: "1rem" }}>
                      <Col>{t("productName")}</Col>
                      <Col>{t("productPrice")}</Col>
                      <Col>{t("point")}</Col>
                    </Row>
                    {selectedProducts.map((item, index) => {
                      return (
                        <Row key={index} style={{ padding: "1rem" }}>
                          <Col>
                            <Form.Control
                              type="text"
                              name={`loyaltyPromo[${index}].product_id`}
                              disabled
                              hidden
                              value={item.id}
                            />
                            <Form.Control
                              type="text"
                              disabled
                              value={item.name}
                            />
                          </Col>
                          <Col>
                            <Form.Control
                              type="text"
                              disabled
                              value={item.price}
                            />
                          </Col>
                          <Col>
                            <Form.Control
                              type="number"
                              name={`loyaltyPromo[${index}].point`}
                              {...formikPromo.getFieldProps(
                                `loyaltyPromo[${index}].point`
                              )}
                              required
                            />
                            {formikPromo.touched.loyaltyPromo &&
                            formikPromo.errors.loyaltyPromo ? (
                              <div className="fv-plugins-message-container">
                                <div className="fv-help-block">
                                  {
                                    formikPromo.errors.loyaltyPromo[index]
                                      ?.point
                                  }
                                </div>
                              </div>
                            ) : null}
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                );
              }}
            />
          </FormikProvider>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cancelModal}>
          {t("canel")}
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
  );
};

export default SpecialPromoModal;
