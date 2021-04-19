import React from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

import { useDropzone } from "react-dropzone";

import { useTranslation } from "react-i18next";

import {
  Row,
  Col,
  Button,
  Form,
  Alert,
  Spinner,
  InputGroup
} from "react-bootstrap";
import {
  FormControl,
  FormControlLabel,
  Switch,
  FormGroup
} from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { CalendarToday } from "@material-ui/icons";
import DatePicker from "react-datepicker";

import "../../style.css";

const FormTemplate = ({
  title,
  loading,
  allTaxes,
  alertPhoto,
  photoPreview,
  photo,
  handlePreviewPhoto,
  showModalAddons,
  formikProduct,
  validationProduct,
  alert,
  handleDeletePhoto,
  optionsSupplier,
  defaultValueSupplier,
  optionsOutlet,
  optionsCategory,
  optionsUnit,
  defaultValueOutlet,
  defaultValueCategory,
  defaultValueUnit,
  expiredDate,
  handleExpiredDate,
  hasExpiredDate,
  handleHasExpired
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxSize: 3 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });
  const CustomInputDate = ({ value, onClick }) => {
    return (
      <Form.Control
        type="text"
        defaultValue={value}
        onClick={onClick}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        disabled={
          hasExpiredDate && formikProduct.values.has_stock ? false : true
        }
      />
    );
  };

  const { t } = useTranslation();

  return (
    <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
      <Form noValidate onSubmit={formikProduct.handleSubmit}>
        <div className="headerPage">
          <div className="headerStart">
            <h3>{title}</h3>
          </div>
          <div className="headerEnd">
            <Link to="/product">
              <Button variant="outline-secondary">{t("cancel")}</Button>
            </Link>
            <Button
              variant="primary"
              style={{ marginLeft: "0.5rem" }}
              type="submit"
            >
              {loading ? (
                <Spinner animation="border" variant="light" size="sm" />
              ) : (
                `${t("save")}`
              )}
            </Button>
          </div>
        </div>

        {alert ? <Alert variant="danger">{alert}</Alert> : ""}

        <Row style={{ padding: "1rem" }}>
          <Col>
            <Form.Group>
              <Form.Label>{t("outlet")}*</Form.Label>
              <Select
                options={optionsOutlet}
                defaultValue={defaultValueOutlet}
                name="outlet_id"
                className="basic-single"
                classNamePrefix="select"
                onChange={(value) =>
                  formikProduct.setFieldValue("outlet_id", value.value)
                }
              />
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
              <Form.Label>{t("productName")}*</Form.Label>
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
              <Form.Label>{t("category")}</Form.Label>
              <Select
                options={optionsCategory}
                defaultValue={defaultValueCategory}
                name="product_category_id"
                className="basic-single"
                classNamePrefix="select"
                onChange={(value) =>
                  formikProduct.setFieldValue(
                    "product_category_id",
                    value.value
                  )
                }
              />
              {formikProduct.touched.product_category_id &&
              formikProduct.errors.product_category_id ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikProduct.errors.product_category_id}
                  </div>
                </div>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("price")}*</Form.Label>
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
              <Form.Label>{t("purchasePrice")}*</Form.Label>
              <Form.Control
                type="number"
                name="price_purchase"
                {...formikProduct.getFieldProps("price_purchase")}
                className={validationProduct("price_purchase")}
                required
              />
              {formikProduct.touched.price_purchase &&
              formikProduct.errors.price_purchase ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikProduct.errors.price_purchase}
                  </div>
                </div>
              ) : null}
            </Form.Group>

            {/* <Form.Group>
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
            </Form.Group> */}

            <Form.Group>
              <div>
                <Form.Label>{t("productStatus")}*</Form.Label>
              </div>
              <div>
                {["Active", "Inactive"].map((item, index) => {
                  return (
                    <Form.Check
                      key={index}
                      inline
                      type="radio"
                      name="status"
                      value={formikProduct.values.status}
                      onChange={(e) => {
                        if (e.target.value === "active") {
                          formikProduct.setFieldValue("status", "inactive");
                        } else {
                          formikProduct.setFieldValue("status", "active");
                        }
                      }}
                      label={item}
                      checked={
                        item.toLowerCase() === formikProduct.values.status
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
              <FormControl component="fieldset">
                <FormGroup row>
                  <Form.Label
                    style={{ alignSelf: "center", marginRight: "1rem" }}
                  >
                    {t("productFavorite")}*
                  </Form.Label>
                  <FormControlLabel
                    value={formikProduct.values.is_favorite}
                    name="is_favorite"
                    control={
                      <Switch
                        color="primary"
                        checked={formikProduct.values.is_favorite}
                        onChange={(e) => {
                          const { value } = e.target;
                          if (value === "false") {
                            formikProduct.setFieldValue("is_favorite", true);
                          } else {
                            formikProduct.setFieldValue("is_favorite", false);
                          }
                        }}
                      />
                    }
                  />
                </FormGroup>
              </FormControl>
            </Form.Group>

            <Form.Group>
              <Form.Label>{t("productDescription")}</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                {...formikProduct.getFieldProps("description")}
                className={validationProduct("description")}
              />
              {formikProduct.touched.description &&
              formikProduct.errors.description ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikProduct.errors.description}
                  </div>
                </div>
              ) : null}
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>{t("barcode")}</Form.Label>
              <Form.Control
                type="text"
                name="barcode"
                {...formikProduct.getFieldProps("barcode")}
                className={validationProduct("barcode")}
              />
              {formikProduct.touched.barcode && formikProduct.errors.barcode ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikProduct.errors.barcode}
                  </div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group>
              <Form.Label>{t("sku")}</Form.Label>
              <Form.Control
                type="text"
                name="sku"
                {...formikProduct.getFieldProps("sku")}
                className={validationProduct("sku")}
                required
              />
              {formikProduct.touched.sku && formikProduct.errors.sku ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikProduct.errors.sku}
                  </div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group>
              <Form.Label>{t("supplier")}</Form.Label>
              <Select
                options={optionsSupplier}
                defaultValue={defaultValueSupplier}
                name="supplier_id"
                className="basic-single"
                classNamePrefix="select"
                onChange={(value) =>{
                  formikProduct.setFieldValue(
                    "supplier_id",
                    value.value
                  )
                  formikProduct.setFieldValue(
                    "supplier",
                    value.label
                  )
                }
                }
              />
              {formikProduct.touched.supplier_id &&
              formikProduct.errors.supplier_id ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikProduct.errors.supplier_id}
                  </div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group style={{ margin: 0 }}>
              <Form.Label style={{ alignSelf: "center", marginRight: "1rem" }}>
                {t("stock")}
              </Form.Label>
              <FormControlLabel
                value={formikProduct.values.has_stock}
                name="has_stock"
                control={
                  <Switch
                    color="primary"
                    checked={formikProduct.values.has_stock}
                    onChange={(e) => {
                      const { value } = e.target;
                      if (value === "false") {
                        formikProduct.setFieldValue("has_stock", true);
                      } else {
                        formikProduct.setFieldValue("has_stock", false);
                        formikProduct.setFieldValue("stock", 0);

                        handleHasExpired({ target: { value: "true" } });
                      }
                    }}
                  />
                }
              />
            </Form.Group>

            <div className="box" style={{ marginBottom: "1rem" }}>
              <Form.Group>
                <Form.Label>
                  {title === "Add Product" ? `${t("startingStock")}` : `${t("stock")}`}
                </Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  {...formikProduct.getFieldProps("stock")}
                  className={validationProduct("stock")}
                  disabled={formikProduct.values.has_stock ? false : true}
                />
                {formikProduct.touched.stock && formikProduct.errors.stock ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikProduct.errors.stock}
                    </div>
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group>
                <Form.Label>{t("unit")}</Form.Label>
                <Select
                  options={optionsUnit}
                  defaultValue={defaultValueUnit(formikProduct.values.unit_id)}
                  name="unit_id"
                  className="basic-single"
                  classNamePrefix={t("select")}
                  onChange={(value) =>
                    formikProduct.setFieldValue("unit_id", value.value)
                  }
                  isDisabled={formikProduct.values.has_stock ? false : true}
                />
                {formikProduct.touched.unit_id &&
                formikProduct.errors.unit_id ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikProduct.errors.unit_id}
                    </div>
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group>
                <Form.Label style={{ marginRight: "1rem" }}>
                  {t("expiredDate")}
                </Form.Label>
                <FormControlLabel
                  value={hasExpiredDate}
                  name="has_expired"
                  control={
                    <Switch
                      color="primary"
                      checked={hasExpiredDate}
                      onChange={handleHasExpired}
                      disabled={formikProduct.values.has_stock ? false : true}
                    />
                  }
                />

                <InputGroup>
                  <DatePicker
                    name="expired_date"
                    selected={expiredDate}
                    onChange={handleExpiredDate}
                    customInput={<CustomInputDate />}
                  />

                  <InputGroup.Append>
                    <InputGroup.Text>
                      <CalendarToday />
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
                {formikProduct.touched.expired_date &&
                formikProduct.errors.expired_date ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikProduct.errors.expired_date}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </div>

            <Form.Group>
              <Form.Label>{t("productPhoto")}</Form.Label>
              {alertPhoto ? <Alert variant="danger">{alertPhoto}</Alert> : ""}
              <div
                {...getRootProps({
                  className: "boxDashed dropzone"
                })}
              >
                <input {...getInputProps()} />
                {!photoPreview ? (
                  <>
                    <p>
                      {t("dragAndDrop")}
                    </p>
                    <p style={{ color: "gray" }}>{t("fileSizeLimit")}</p>
                  </>
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
              {photo ? (
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleDeletePhoto}
                  >
                    {t("removePhoto")}
                  </Button>
                </div>
              ) : (
                ""
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>{t("productType")}*</Form.Label>
              <Row style={{ padding: "1rem" }}>
                {[
                  {
                    name: `${t("noRecipe")}`,
                    value: false,
                    checked: formikProduct.values.has_recipe ? false : true
                  },
                  {
                    name: `${t("withRecipe")}`,
                    value: true,
                    checked: formikProduct.values.has_recipe ? true : false
                  }
                ].map((item, index) => {
                  return (
                    <Col
                      key={index}
                      className="box"
                      style={{ marginRight: "1rem" }}
                    >
                      <Row>
                        <Col md={3}>
                          <Form.Check
                            type="radio"
                            name="has_recipe"
                            value={formikProduct.values.has_recipe}
                            onChange={(e) => {
                              const { value } = e.target;

                              if (value === "true") {
                                formikProduct.setFieldValue(
                                  "has_recipe",
                                  false
                                );
                                formikProduct.setFieldValue("recipe_id", null);
                              } else {
                                formikProduct.setFieldValue("has_recipe", true);
                              }
                            }}
                            checked={item.checked}
                            className={validationProduct("has_recipe")}
                            required
                            feedback={formikProduct.errors.has_recipe}
                          />
                        </Col>
                        <Col>
                          <Row>{item.name}</Row>
                        </Col>
                      </Row>
                    </Col>
                  );
                })}
              </Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>{t("productAddOns")}</Form.Label>
              <div style={{ padding: "0.5rem" }}>
                <Button onClick={showModalAddons}>{t("manageAddOns")}</Button>
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Paper>
  );
};

export default FormTemplate;
