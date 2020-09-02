import React from "react";
import { Link } from "react-router-dom";

import { useDropzone } from "react-dropzone";

import { Row, Col, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Paper } from "@material-ui/core";

import { useStyles } from "../ProductPage";

const FormTemplate = ({
  title,
  loading,
  allOutlets,
  allProductCategories,
  allTaxes,
  alertPhoto,
  photoPreview,
  photo,
  handlePreviewPhoto,
  allProductTypes,
  showModalVariant,
  formikProduct,
  validationProduct
}) => {
  const classes = useStyles();

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxSize: 2 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });

  return (
    <Paper elevation={2} style={{ padding: "1rem" }}>
      <Form onSubmit={formikProduct.handleSubmit}>
        <div className={classes.header}>
          <div className={classes.headerStart}>
            <h3>{title}</h3>
          </div>
          <div className={classes.headerEnd}>
            <Link to="/product">
              <Button variant="outline-secondary">Cancel</Button>
            </Link>
            <Button
              variant="primary"
              style={{ marginLeft: "0.5rem" }}
              type="submit"
            >
              {loading ? (
                <Spinner animation="border" variant="light" size="sm" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>

        <Row style={{ padding: "1rem" }}>
          <Col>
            <Form.Group>
              <Form.Label>Outlet*</Form.Label>
              <Form.Control
                as="select"
                name="outlet_id"
                {...formikProduct.getFieldProps("outlet_id")}
                className={validationProduct("outlet_id")}
                required
              >
                <option value={""} disabled hidden>
                  Choose Outlet
                </option>
                {allOutlets.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </Form.Control>
              {formikProduct.touched.outlet_id &&
              formikProduct.errors.outlet_id ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikProduct.errors.outlet_id}
                  </div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group>
              <Form.Label>Product Name*</Form.Label>
              <Form.Control
                type="text"
                name="name"
                {...formikProduct.getFieldProps("name")}
                onChange={(e) => {
                  let initial = "";
                  const initialEvery = e.target.value.split(" ");
                  initialEvery.forEach((item) => (initial += item.slice(0, 1)));

                  formikProduct.setFieldValue("name", e.target.value);
                  formikProduct.setFieldValue("sku", initial);
                }}
                className={validationProduct("name")}
                required
              />
              {formikProduct.touched.name && formikProduct.errors.name ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikProduct.errors.name}
                  </div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="product_category_id"
                {...formikProduct.getFieldProps("product_category_id")}
              >
                <option value={""} disabled hidden>
                  Choose Category
                </option>
                {allProductCategories.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Price*</Form.Label>
              <Form.Control
                type="number"
                name="price"
                {...formikProduct.getFieldProps("price")}
                className={validationProduct("price")}
                required
              />
              {formikProduct.touched.price && formikProduct.errors.price ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikProduct.errors.price}
                  </div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group>
              <Form.Label>Tax*</Form.Label>
              <Form.Control
                as="select"
                name="product_tax_id"
                {...formikProduct.getFieldProps("product_tax_id")}
                className={validationProduct("product_tax_id")}
                required
              >
                <option value={""} disabled hidden>
                  Choose Tax
                </option>
                {allTaxes.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </Form.Control>
              {formikProduct.touched.product_tax_id &&
              formikProduct.errors.product_tax_id ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikProduct.errors.product_tax_id}
                  </div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group>
              <div>
                <Form.Label>Product Status*</Form.Label>
              </div>
              <div>
                {["Active", "Inactive"].map((item, index) => {
                  return (
                    <Form.Check
                      key={index}
                      inline
                      type="radio"
                      name="status"
                      value={formikProduct.getFieldProps("status").value}
                      onChange={(e) => {
                        if (e.target.value === "active") {
                          formikProduct.setFieldValue("status", "inactive");
                        } else {
                          formikProduct.setFieldValue("status", "active");
                        }
                      }}
                      label={item}
                      checked={
                        item.toLowerCase() ===
                        formikProduct.getFieldProps("status").value
                          ? true
                          : false
                      }
                      required
                      className={validationProduct("status")}
                      feedback={formikProduct.errors.status}
                    />
                  );
                })}
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                {...formikProduct.getFieldProps("description")}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>Barcode</Form.Label>
              <Form.Control
                type="text"
                name="barcode"
                {...formikProduct.getFieldProps("barcode")}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>SKU</Form.Label>
              <Form.Control
                type="text"
                name="sku"
                {...formikProduct.getFieldProps("sku")}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Product Photo</Form.Label>
              {alertPhoto ? <Alert variant="danger">{alertPhoto}</Alert> : ""}
              <div
                {...getRootProps({
                  className: `${classes.boxDashed} dropzone`
                })}
              >
                <input {...getInputProps()} />
                {!photoPreview ? (
                  <p>Drag 'n' drop some files here, or click to select files</p>
                ) : (
                  <>
                    <div
                      style={{
                        margin: "auto",
                        width: "120px",
                        height: "120px",
                        overflow: "hidden",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundImage: `url(${photoPreview || photo})`
                      }}
                    />
                    <small>
                      {photo?.name ? `${photo.name} - ${photo.size} bytes` : ""}
                    </small>
                  </>
                )}
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>Product Type*</Form.Label>
              <Row style={{ padding: "1rem" }}>
                {allProductTypes.map((item) => {
                  return (
                    <Col
                      key={item.id}
                      className={classes.box}
                      style={{ marginRight: "1rem" }}
                    >
                      <Row>
                        <Col md={3}>
                          <Form.Check
                            type="radio"
                            name="product_type_id"
                            value={item.id}
                            onChange={(e) => {
                              formikProduct.setFieldValue(
                                "product_type_id",
                                parseInt(e.target.value)
                              );
                            }}
                            checked={
                              item.id ===
                              formikProduct.getFieldProps("product_type_id")
                                .value
                                ? true
                                : false
                            }
                            className={validationProduct("product_type_id")}
                            required
                            feedback={formikProduct.errors.product_type_id}
                          />
                        </Col>
                        <Col>
                          <Row>{item.name}</Row>
                          <Row>{item.description}</Row>
                        </Col>
                      </Row>
                    </Col>
                  );
                })}
              </Row>
            </Form.Group>

            <div>Product Variant</div>
            <div style={{ padding: "1rem" }}>
              <Button onClick={showModalVariant}>Manage Product Variant</Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Paper>
  );
};

export default FormTemplate;
