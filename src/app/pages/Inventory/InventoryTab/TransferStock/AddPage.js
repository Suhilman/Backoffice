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

export const AddTransferStockPage = ({ location }) => {
  const history = useHistory();
  const { allOutlets, allProducts } = location.state;

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");

  const [startDate, setStartDate] = React.useState(new Date());

  const [originProduct, setOriginProduct] = React.useState([]);

  const initialValueStock = {
    outlet_from_id: "",
    outlet_to_id: "",
    notes: "",
    date: startDate,
    items: [
      {
        product_id: "",
        quantity: 0
      }
    ]
  };

  const StockSchema = Yup.object().shape({
    outlet_from_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose an outlet origin."),
    outlet_to_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose an outlet destination."),
    notes: Yup.string(),
    date: Yup.string().required("Please input date"),
    items: Yup.array().of(
      Yup.object().shape({
        product_id: Yup.number()
          .min(1)
          .required("Please input a product"),
        quantity: Yup.number()
          .min(1, "Minimum 1")
          .required("Please input a quantity")
      })
    )
  });

  const formikStock = useFormik({
    initialValues: initialValueStock,
    validationSchema: StockSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      try {
        const stockData = {
          outlet_from_id: values.outlet_from_id,
          outlet_to_id: values.outlet_to_id,
          notes: values.notes,
          date: values.date,
          items: values.items
        };

        if (stockData.outlet_from_id === stockData.outlet_to_id) {
          throw new Error("origin and destination cannot be the same outlet");
        }

        enableLoading();
        await axios.post(`${API_URL}/api/v1/transfer-stock`, stockData);
        disableLoading();
        history.push("/inventory/transfer-stock");
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

  const handleSelectOrigin = (e) => {
    const { value } = e.target;
    formikStock.setFieldValue("outlet_from_id", value);
    formikStock.setFieldValue("items", initialValueStock.items);
    const filterProduct = allProducts.filter(
      (item) => item.outlet_id === parseInt(value)
    );
    setOriginProduct(filterProduct);
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
                <h3>Add Transfer Stock</h3>
              </div>
              <div className="headerEnd">
                <Link to="/inventory/transfer-stock">
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
                  <Form.Label>Origin:</Form.Label>
                  <Form.Control
                    as="select"
                    name="outlet_from_id"
                    {...formikStock.getFieldProps("outlet_from_id")}
                    onChange={handleSelectOrigin}
                    onBlur={handleSelectOrigin}
                    className={validationStock("outlet_from_id")}
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
                  {formikStock.touched.outlet_from_id &&
                  formikStock.errors.outlet_from_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikStock.errors.outlet_from_id}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Destination:</Form.Label>
                  <Form.Control
                    as="select"
                    name="outlet_to_id"
                    {...formikStock.getFieldProps("outlet_to_id")}
                    className={validationStock("outlet_to_id")}
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
                  {formikStock.touched.outlet_to_id &&
                  formikStock.errors.outlet_to_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikStock.errors.outlet_to_id}
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
                    <h6>Quantity</h6>
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
                                      required
                                    >
                                      <option value="" disabled hidden>
                                        Choose Product
                                      </option>
                                      {originProduct.map((item) => {
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
                                      name={`items[${index}].quantity`}
                                      {...formikStock.getFieldProps(
                                        `items[${index}].quantity`
                                      )}
                                      required
                                    />
                                    {formikStock.touched.items &&
                                    formikStock.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikStock.errors.items[index]
                                              ?.quantity
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
