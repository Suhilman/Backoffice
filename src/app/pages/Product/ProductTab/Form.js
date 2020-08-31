import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

import { useDropzone } from "react-dropzone";

import { Row, Col, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Paper } from "@material-ui/core";

import { useStyles } from "../ProductPage";

const FormTemplate = ({
  validated,
  handleSave,
  title,
  loading,
  outlet,
  handleSelectOutlet,
  allOutlets,
  productName,
  handleChangeName,
  category,
  handleSelectCategory,
  allProductCategories,
  price,
  handleChangePrice,
  tax,
  handleSelectTax,
  allTaxes,
  status,
  handleSelectStatus,
  description,
  handleChangeDescription,
  barcode,
  handleChangeBarcode,
  sku,
  handleChangeSku,
  alertPhoto,
  photoPreview,
  photo,
  handlePreviewPhoto,
  allProductTypes,
  type,
  handleSelectType,
  showModalVariant
}) => {
  const classes = useStyles();

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxSize: 2 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });

  return (
    <Paper elevation={2} style={{ padding: "1rem" }}>
      <Form noValidate validated={validated} onSubmit={handleSave}>
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
                value={outlet}
                onChange={handleSelectOutlet}
                required
              >
                <option value={""} disabled hidden>
                  Choose Outlet
                </option>
                {allOutlets
                  ? allOutlets.map(item => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })
                  : ""}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Please choose an outlet.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Product Name*</Form.Label>
              <Form.Control
                type="text"
                value={productName}
                onChange={handleChangeName}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter a name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={handleSelectCategory}
              >
                <option value={""} disabled hidden>
                  Choose Category
                </option>
                {allProductCategories
                  ? allProductCategories.map(item => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })
                  : ""}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Price*</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={handleChangePrice}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter a price.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Tax*</Form.Label>
              <Form.Control
                as="select"
                value={tax}
                onChange={handleSelectTax}
                required
              >
                <option value={""} disabled hidden>
                  Choose Tax
                </option>
                {allTaxes
                  ? allTaxes.map(item => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })
                  : ""}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Please choose a tax.
              </Form.Control.Feedback>
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
                      label={item}
                      value={status ? status : item.toLowerCase()}
                      checked={item.toLowerCase() === status ? true : false}
                      onChange={handleSelectStatus}
                      required
                      feedback="Please choose a status"
                    />
                  );
                })}
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                as="textarea"
                value={description}
                onChange={handleChangeDescription}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>Barcode</Form.Label>
              <Form.Control
                type="text"
                value={barcode}
                onChange={handleChangeBarcode}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>SKU</Form.Label>
              <Form.Control
                type="text"
                value={sku}
                onChange={handleChangeSku}
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
                      {photo ? `${photo.name} - ${photo.size} bytes` : ""}
                    </small>
                  </>
                )}
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>Product Type*</Form.Label>
              <Row style={{ padding: "1rem" }}>
                {allProductTypes
                  ? allProductTypes.map(item => {
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
                                name="type"
                                value={item.id}
                                checked={item.id === type ? true : false}
                                onChange={handleSelectType}
                                required
                                feedback="Please choose a type"
                              />
                            </Col>
                            <Col>
                              <Row>{item.name}</Row>
                              <Row>{item.description}</Row>
                            </Col>
                          </Row>
                        </Col>
                      );
                    })
                  : ""}
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
