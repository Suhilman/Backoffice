import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
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
  const { allOutlets, allAccessLists, allRoles } = location.state;

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");

  const [selectedPrivileges, setSelectedPrivileges] = React.useState([]);

  const initialValueStaff = {
    outlet_id: "",
    type: "Staff",
    role_id: "",
    name: "",
    staff_id: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
    pin: ""
  };
  const { t } = useTranslation();
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
    staff_id: Yup.string()
      .min(5)
      .max(10)
      .required("Please input a staff id."),
    email: Yup.string()
      .email()
      .required("Please input an email."),
    phone_number: Yup.number().typeError("Please input a number only"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%*?&]{8,20}$/,
        "Password at least must have one uppercase, one numeric, and 8 characters long."
      )
      .required("Please input a password."),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password do not match")
      .required("Please input a password confirmation."),
    pin: Yup.string()
      .matches(/^\d+$/, "pin must be numbers")
      .min(6)
      .max(6)
      .required("Please input a pin")
  });

  const formikStaff = useFormik({
    enableReinitialize: true,
    initialValues: initialValueStaff,
    validationSchema: StaffSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      const staffData = {
        name: values.name,
        staff_id: values.staff_id,
        email: values.email,
        password: values.password,
        pin: values.pin,
        phone_number: values.phone_number,
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

  const handleChangeRole = (e) => {
    const { name, value } = e.target;

    if (!value) {
      return;
    }

    const selectedId = parseInt(value);
    formikStaff.setFieldValue(name, selectedId);

    const selectedRole = allRoles.find((item) => item.id === selectedId);

    const sortedPrivileges = selectedRole.Role_Privileges.sort(
      (a, b) => a.privilege_id - b.privilege_id
    );
    setSelectedPrivileges(sortedPrivileges);
  };

  return (
    <>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <Form onSubmit={formikStaff.handleSubmit}>
              <div className="headerPage">
                <div className="headerStart">
                  <h3>{t("addStaff")}</h3>
                </div>
                <div className="headerEnd">
                  <Link to="/staff">
                    <Button variant="secondary">{t("cancel")}</Button>
                  </Link>
                  <Button
                    variant="primary"
                    style={{ marginLeft: "0.5rem" }}
                    type="submit"
                  >
                    {t("save")}
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
                    <Form.Label>{t("outlet")}*</Form.Label>
                    <Form.Control
                      as="select"
                      name="outlet_id"
                      {...formikStaff.getFieldProps("outlet_id")}
                      className={validationStaff("outlet_id")}
                      required
                    >
                      <option value={""} disabled hidden>
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
                    {formikStaff.touched.outlet_id &&
                    formikStaff.errors.outlet_id ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.outlet_id}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  {/* <Form.Group>
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
                  </Form.Group> */}

                  <Form.Group>
                    <Form.Label>{t("role")}*</Form.Label>
                    <Form.Control
                      as="select"
                      name="role_id"
                      {...formikStaff.getFieldProps("role_id")}
                      onChange={handleChangeRole}
                      onBlur={handleChangeRole}
                      className={validationStaff("role_id")}
                      required
                    >
                      <option value={""} disabled hidden>
                      {t("chooseRole")}
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
                    <Form.Label>{t("name")}*</Form.Label>
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
                    <Form.Label>{t("staffID")}*</Form.Label>
                    <Form.Control
                      type="text"
                      name="staff_id"
                      {...formikStaff.getFieldProps("staff_id")}
                      className={validationStaff("staff_id")}
                      required
                    />
                    {formikStaff.touched.staff_id &&
                    formikStaff.errors.staff_id ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.staff_id}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>{t("email")}*</Form.Label>
                    <Form.Control
                      type="email"
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
                    <Form.Label>{t("phoneNumber")}*</Form.Label>
                    <Form.Control
                      type="text"
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
                    <Form.Label>{t("password")}*</Form.Label>
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
                    <Form.Label>{t("passwordConfirmation")}*</Form.Label>
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

                  <Form.Group>
                    <Form.Label>{t("pin")}*</Form.Label>
                    <Form.Control
                      type="password"
                      name="pin"
                      {...formikStaff.getFieldProps("pin")}
                      className={validationStaff("pin")}
                      required
                    />
                    {formikStaff.touched.pin && formikStaff.errors.pin ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.pin}
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
            {selectedPrivileges.length
              ? allAccessLists.map((access) => {
                  return (
                    <Col key={access.id}>
                      <Paper
                        elevation={2}
                        style={{ padding: "1rem", height: "100%" }}
                      >
                        <h5>{access.name}{t("accessList")}</h5>

                        <FormControl
                          component="fieldset"
                          style={{ width: "100%" }}
                        >
                          <FormGroup row>
                            <Container style={{ padding: "0" }}>
                              {selectedPrivileges.map((privilege, index) => {
                                if (
                                  access.name ===
                                  privilege.Privilege.Access.name
                                ) {
                                  return (
                                    <Row
                                      key={index}
                                      style={{ padding: "0.5rem 1rem" }}
                                    >
                                      <Col style={{ alignSelf: "center" }}>
                                        <Form.Label>
                                          {privilege.Privilege.name === "Changing Transaction" ? "Delete Transaction" : privilege.Privilege.name}
                                        </Form.Label>
                                      </Col>
                                      <Col style={{ textAlign: "end" }}>
                                        <FormControlLabel
                                          key={privilege.Privilege.id}
                                          control={
                                            <Switch
                                              key={privilege.Privilege.id}
                                              value={privilege.Privilege.name}
                                              color="primary"
                                              checked={privilege.allow}
                                              style={{
                                                cursor: "not-allowed"
                                              }}
                                            />
                                          }
                                        />
                                      </Col>
                                    </Row>
                                  );
                                } else {
                                  return "";
                                }
                              })}
                            </Container>
                          </FormGroup>
                        </FormControl>
                      </Paper>
                    </Col>
                  );
                })
              : ""}
          </Row>
        </Col>
      </Row>
    </>
  );
};
