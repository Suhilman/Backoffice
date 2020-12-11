import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik, FormikProvider, FieldArray } from "formik";

import {
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  InputGroup
} from "react-bootstrap";
import { Paper } from "@material-ui/core";
import DatePicker from "react-datepicker";
import { CalendarToday, Delete } from "@material-ui/icons";

export const AddStockOpnamePage = ({ location }) => {
  const history = useHistory();
  const { allOutlets, allProducts } = location.state;

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");

  const [startDate, setStartDate] = React.useState(new Date());

  const [outletProduct, setOutletProduct] = React.useState([]);

  const initialValueStock = {
    outlet_id: "",
    notes: "",
    date: startDate,
    items: [
      {
        product_id: "",
        quantity_system: 0,
        quantity_actual: 0,
        difference: 0,
        price_system: 0,
        price_new: 0
      }
    ]
  };

  const StockSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose an outlet."),
    notes: Yup.string(),
    date: Yup.string().required("Please input date"),
    items: Yup.array().of(
      Yup.object().shape({
        product_id: Yup.number()
          .min(1)
          .required("Please input a product"),
        quantity_system: Yup.number()
          .typeError("Please input a product")
          .required("Please input a quantity system"),
        quantity_actual: Yup.number()
          .min(0, "Minimum 0")
          .required("Please input a quantity actual"),
        difference: Yup.number()
          .typeError("Please input a quantity actual")
          .required("Please input a difference"),
        price_system: Yup.number()
          .typeError("Please input a product")
          .required("Please input a price system"),
        price_new: Yup.number()
          .min(0, "Minimum 0")
          .required("Please input a price actual")
      })
    )
  });

  const formikStock = useFormik({
    initialValues: initialValueStock,
    validationSchema: StockSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      const stockData = {
        outlet_id: values.outlet_id,
        notes: values.notes,
        date: values.date,
        items: values.items
      };

      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/stock-opname`, stockData);
        disableLoading();
        history.push("/inventory/stock-opname");
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const validationStock = (fieldname) => {
    if (formikStock.touched[fieldname] && formikStock.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikStock.touched[fieldname] && !formikStock.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleDate = (date) => {
    setStartDate(date);
    formikStock.setFieldValue("date", date);
  };

  const handleSelectOutlet = (e) => {
    const { value } = e.target;
    formikStock.setFieldValue("outlet_id", value);
    formikStock.setFieldValue("items", initialValueStock.items);
    const filterProduct = allProducts.filter(
      (item) => item.outlet_id === parseInt(value)
    );
    setOutletProduct(filterProduct);
  };

  const handleSelectProduct = (e, index) => {
    const { value } = e.target;

    if (!value) {
      return;
    }

    const currProduct = allProducts.find((item) => item.id === parseInt(value));
    const diff = Math.abs(
      parseInt(formikStock.values.items[index].quantity_system) -
        parseInt(formikStock.values.items[index].quantity_actual)
    );

    formikStock.setFieldValue(`items[${index}].product_id`, value);
    formikStock.setFieldValue(
      `items[${index}].quantity_system`,
      currProduct.stock
    );
    formikStock.setFieldValue(`items[${index}].difference`, diff);
    formikStock.setFieldValue(
      `items[${index}].price_system`,
      currProduct.price
    );
    formikStock.setFieldValue(`items[${index}].price_new`, currProduct.price);
  };

  const handleChangeQuantity = (e, index) => {
    const { value } = e.target;

    const diff = Math.abs(
      parseInt(formikStock.values.items[index].quantity_system) -
        parseInt(value)
    );
    formikStock.setFieldValue(`items[${index}].quantity_actual`, value);
    formikStock.setFieldValue(`items[${index}].difference`, diff);
  };

  const CustomInputDate = ({ value, onClick }) => {
    return (
      <Form.Control
        type="text"
        defaultValue={value}
        onClick={onClick}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      />
    );
  };

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <Form noValidate onSubmit={formikStock.handleSubmit}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>Add Stock Opname</h3>
              </div>
              <div className="headerEnd">
                <Link to="/inventory/stock-opname">
                  <Button variant="secondary">Cancel</Button>
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

            {alert ? <Alert variant="danger">{alert}</Alert> : ""}

            <Row style={{ padding: "1rem" }} className="lineBottom">
              <Col sm={3}>
                <Form.Group>
                  <Form.Label>Location:</Form.Label>
                  <Form.Control
                    as="select"
                    name="outlet_id"
                    {...formikStock.getFieldProps("outlet_id")}
                    onChange={handleSelectOutlet}
                    onBLur={handleSelectOutlet}
                    className={validationStock("outlet_id")}
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
                  {formikStock.touched.outlet_id &&
                  formikStock.errors.outlet_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikStock.errors.outlet_id}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Date:</Form.Label>
                  <InputGroup>
                    <DatePicker
                      name="date"
                      selected={startDate}
                      onChange={handleDate}
                      customInput={<CustomInputDate />}
                      required
                    />

                    <InputGroup.Append>
                      <InputGroup.Text>
                        <CalendarToday />
                      </InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                  {formikStock.touched.date && formikStock.errors.date ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikStock.errors.date}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>Notes:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    {...formikStock.getFieldProps("notes")}
                    className={validationStock("notes")}
                  />
                  {formikStock.touched.notes && formikStock.errors.notes ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikStock.errors.notes}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>

            <Row style={{ padding: "1rem" }}>
              <Col>
                <Row>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>Product Name</h6>
                  </Col>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>Quantity System</h6>
                  </Col>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>Quantity Actual</h6>
                  </Col>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>Difference</h6>
                  </Col>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>Price System</h6>
                  </Col>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>Price New</h6>
                  </Col>
                  <Col sm={1}></Col>
                </Row>

                <FormikProvider value={formikStock}>
                  <FieldArray
                    name="items"
                    render={(arrayHelpers) => {
                      return (
                        <div>
                          {formikStock.values.items.map((item, index) => {
                            return (
                              <Row key={index}>
                                <Col>
                                  <Form.Group>
                                    <Form.Control
                                      as="select"
                                      name={`items[${index}].product_id`}
                                      {...formikStock.getFieldProps(
                                        `items[${index}].product_id`
                                      )}
                                      onChange={(e) =>
                                        handleSelectProduct(e, index)
                                      }
                                      onBlur={(e) =>
                                        handleSelectProduct(e, index)
                                      }
                                      required
                                    >
                                      <option value="" disabled hidden>
                                        Choose Product
                                      </option>
                                      {outletProduct.map((item) => {
                                        return (
                                          <option key={item.id} value={item.id}>
                                            {item.name}
                                          </option>
                                        );
                                      })}
                                    </Form.Control>
                                    {formikStock.touched.items &&
                                    formikStock.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikStock.errors.items[index]
                                              ?.product_id
                                          }
                                        </div>
                                      </div>
                                    ) : null}
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group>
                                    <Form.Control
                                      type="number"
                                      name={`items[${index}].quantity_system`}
                                      {...formikStock.getFieldProps(
                                        `items[${index}].quantity_system`
                                      )}
                                      disabled
                                      required
                                    />
                                    {formikStock.touched.items &&
                                    formikStock.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikStock.errors.items[index]
                                              ?.quantity_system
                                          }
                                        </div>
                                      </div>
                                    ) : null}
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group>
                                    <Form.Control
                                      type="number"
                                      name={`items[${index}].quantity_actual`}
                                      {...formikStock.getFieldProps(
                                        `items[${index}].quantity_actual`
                                      )}
                                      onChange={(e) =>
                                        handleChangeQuantity(e, index)
                                      }
                                      onBlur={(e) =>
                                        handleChangeQuantity(e, index)
                                      }
                                      required
                                    />
                                    {formikStock.touched.items &&
                                    formikStock.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikStock.errors.items[index]
                                              ?.quantity_actual
                                          }
                                        </div>
                                      </div>
                                    ) : null}
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group>
                                    <Form.Control
                                      type="number"
                                      name={`items[${index}].difference`}
                                      {...formikStock.getFieldProps(
                                        `items[${index}].difference`
                                      )}
                                      value={Math.abs(
                                        parseInt(
                                          formikStock.values.items[index]
                                            .quantity_system
                                        ) -
                                          parseInt(
                                            formikStock.values.items[index]
                                              .quantity_actual
                                          )
                                      )}
                                      disabled
                                      required
                                    />
                                    {formikStock.touched.items &&
                                    formikStock.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikStock.errors.items[index]
                                              ?.difference
                                          }
                                        </div>
                                      </div>
                                    ) : null}
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group>
                                    <Form.Control
                                      type="number"
                                      name={`items[${index}].price_system`}
                                      {...formikStock.getFieldProps(
                                        `items[${index}].price_system`
                                      )}
                                      disabled
                                      required
                                    />
                                    {formikStock.touched.items &&
                                    formikStock.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikStock.errors.items[index]
                                              ?.price_system
                                          }
                                        </div>
                                      </div>
                                    ) : null}
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group>
                                    <Form.Control
                                      type="number"
                                      name={`items[${index}].price_new`}
                                      {...formikStock.getFieldProps(
                                        `items[${index}].price_new`
                                      )}
                                      required
                                    />
                                    {formikStock.touched.items &&
                                    formikStock.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikStock.errors.items[index]
                                              ?.price_new
                                          }
                                        </div>
                                      </div>
                                    ) : null}
                                  </Form.Group>
                                </Col>
                                <Col sm={1}>
                                  <Button
                                    onClick={() => arrayHelpers.remove(index)}
                                    variant="danger"
                                  >
                                    <Delete />
                                  </Button>
                                </Col>
                              </Row>
                            );
                          })}

                          <Row style={{ padding: "1rem" }}>
                            <Button
                              onClick={() =>
                                arrayHelpers.push(initialValueStock.items[0])
                              }
                              variant="primary"
                            >
                              + Add Another Product
                            </Button>
                          </Row>
                        </div>
                      );
                    }}
                  />
                </FormikProvider>
              </Col>
            </Row>
          </Form>
        </Paper>
      </Col>
    </Row>
  );
};
