import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  Container
} from "react-bootstrap";
import {
  Paper,
  FormGroup,
  FormControl,
  FormControlLabel,
  Switch
} from "@material-ui/core";

import "../style.css";

export const AddStaffPage = ({ location }) => {
  const history = useHistory();
  const {
    allOutlets,
    allAccessLists,
    allRoles,
    filterPrivileges
  } = location.state;

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  // const [cashierAccessList, setCashierAccessList] = React.useState([]);
  // const [backendAccessList, setBackendAccessList] = React.useState([]);

  const initialValueStaff = {
    outlet_id: "",
    type: "",
    role_id: "",
    name: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: ""
  };

  const StaffSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose an outlet."),
    type: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
      .required("Please choose a type."),
    role_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose a role."),
    name: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
      .required("Please input a product name."),
    email: Yup.string()
      .email()
      .required("Please input an email."),
    phone_number: Yup.number()
      .integer()
      .min(1),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%*?&]{8,20}$/,
        "Password at least must have one uppercase, one numeric, and 8 characters long."
      )
      .required("Please input a password."),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password do not match")
      .required("Please input a password confirmation.")
  });

  const formikStaff = useFormik({
    enableReinitialize: true,
    initialValues: initialValueStaff,
    validationSchema: StaffSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      const staffData = {
        name: values.name,
        email: values.email,
        password: values.password,
        phone_number: JSON.stringify(values.phone_number),
        type: values.type,
        role_id: values.role_id,
        outlet_id: values.outlet_id
      };

      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/staff`, staffData);
        disableLoading();
        history.push("/staff");
      } catch (err) {
        setAlert(err.response?.message);
        disableLoading();
      }
    }
  });

  const validationStaff = (fieldname) => {
    if (formikStaff.touched[fieldname] && formikStaff.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikStaff.touched[fieldname] && !formikStaff.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  return (
    <>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem" }}>
            <Form onSubmit={formikStaff.handleSubmit}>
              <div className="headerPage">
                <div className="headerStart">
                  <h3>Add Staff</h3>
                </div>
                <div className="headerEnd">
                  <Link to="/staff">
                    <Button variant="secondary">Cancel</Button>
                  </Link>
                  <Button
                    variant="primary"
                    style={{ marginLeft: "0.5rem" }}
                    type="submit"
                  >
                    Save
                    {loading && (
                      <Spinner animation="border" variant="light" size="sm" />
                    )}
                  </Button>
                </div>
              </div>

              <Row style={{ padding: "1rem" }}>
                {alert ? <Alert variant="danger">{alert}</Alert> : ""}

                <Col>
                  <Form.Group>
                    <Form.Label>Outlet*</Form.Label>
                    <Form.Control
                      as="select"
                      name="outlet_id"
                      {...formikStaff.getFieldProps("outlet_id")}
                      className={validationStaff("outlet_id")}
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
                    {formikStaff.touched.outlet_id &&
                    formikStaff.errors.outlet_id ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.outlet_id}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Type*</Form.Label>
                    <Form.Control
                      as="select"
                      name="type"
                      {...formikStaff.getFieldProps("type")}
                      className={validationStaff("type")}
                      required
                    >
                      <option value={""} disabled hidden>
                        Choose Type
                      </option>
                      {["Kasir", "Waiter", "Staff", "Manager"].map(
                        (item, index) => {
                          return (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          );
                        }
                      )}
                    </Form.Control>
                    {formikStaff.touched.type && formikStaff.errors.type ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.type}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Role*</Form.Label>
                    <Form.Control
                      as="select"
                      name="role_id"
                      {...formikStaff.getFieldProps("role_id")}
                      className={validationStaff("role_id")}
                      required
                    >
                      <option value={""} disabled hidden>
                        Choose Role
                      </option>
                      {allRoles.map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Form.Control>
                    {formikStaff.touched.role_id &&
                    formikStaff.errors.role_id ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.role_id}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Name*</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      {...formikStaff.getFieldProps("name")}
                      className={validationStaff("name")}
                      required
                    />
                    {formikStaff.touched.name && formikStaff.errors.name ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.name}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Email*</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      {...formikStaff.getFieldProps("email")}
                      className={validationStaff("email")}
                      required
                    />
                    {formikStaff.touched.email && formikStaff.errors.email ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.email}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Phone Number*</Form.Label>
                    <Form.Control
                      type="number"
                      name="phone_number"
                      {...formikStaff.getFieldProps("phone_number")}
                      className={validationStaff("phone_number")}
                      required
                    />
                    {formikStaff.touched.phone_number &&
                    formikStaff.errors.phone_number ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.phone_number}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Password*</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      {...formikStaff.getFieldProps("password")}
                      className={validationStaff("password")}
                      required
                    />
                    {formikStaff.touched.password &&
                    formikStaff.errors.password ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.password}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Password Confirmation*</Form.Label>
                    <Form.Control
                      type="password"
                      name="password_confirmation"
                      {...formikStaff.getFieldProps("password_confirmation")}
                      className={validationStaff("password_confirmation")}
                      required
                    />
                    {formikStaff.touched.password_confirmation &&
                    formikStaff.errors.password_confirmation ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.password_confirmation}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Paper>
        </Col>

        <Col>
          <Row>
            {allAccessLists.map((access) => {
              const cashierWaiter = ["Kasir", "Waiter"];
              const staffManager = ["Staff", "Manager"];

              if (
                cashierWaiter.includes(formikStaff.values.type) &&
                access.name === "Cashier"
              ) {
                return (
                  <Col key={access.id}>
                    <Paper elevation={2} style={{ padding: "1rem" }}>
                      <h5>{access.name} Access List</h5>

                      <FormControl
                        component="fieldset"
                        style={{ width: "100%" }}
                      >
                        <FormGroup row>
                          <Container style={{ padding: "0" }}>
                            {filterPrivileges.map((privilege) => {
                              return (
                                <Row style={{ padding: "0.5rem 1rem" }}>
                                  <Col style={{ alignSelf: "center" }}>
                                    <Form.Label>{privilege.name}</Form.Label>
                                  </Col>
                                  <Col style={{ textAlign: "end" }}>
                                    <FormControlLabel
                                      key={privilege.id}
                                      control={
                                        <Switch
                                          key={privilege.id}
                                          value={privilege.name}
                                          color="primary"
                                          disabled
                                        />
                                      }
                                    />
                                  </Col>
                                </Row>
                              );
                            })}
                          </Container>
                        </FormGroup>
                      </FormControl>
                    </Paper>
                  </Col>
                );
              } else if (staffManager.includes(formikStaff.values.type)) {
                return (
                  <Col key={access.id}>
                    <Paper elevation={2} style={{ padding: "1rem" }}>
                      <h5>{access.name} Access List</h5>

                      <FormControl component="fieldset">
                        <FormGroup row>
                          <Container style={{ padding: "0" }}>
                            {filterPrivileges.map((privilege) => {
                              return (
                                <Row style={{ padding: "0.5rem 1rem" }}>
                                  <Col style={{ alignSelf: "center" }}>
                                    <Form.Label>{privilege.name}</Form.Label>
                                  </Col>
                                  <Col style={{ textAlign: "end" }}>
                                    <FormControlLabel
                                      key={privilege.id}
                                      control={
                                        <Switch
                                          key={privilege.id}
                                          value={privilege.name}
                                          color="primary"
                                          disabled
                                        />
                                      }
                                    />
                                  </Col>
                                </Row>
                              );
                            })}
                          </Container>
                        </FormGroup>
                      </FormControl>
                    </Paper>
                  </Col>
                );
              } else {
                return "";
              }
            })}
          </Row>
        </Col>
      </Row>
    </>
  );
};
