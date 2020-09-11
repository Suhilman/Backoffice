import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Row, Col, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { Paper } from "@material-ui/core";

import "../style.css";

export const AccountInformation = () => {
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [stateModal, setStateModal] = React.useState(false);
  const [account, setAccount] = React.useState({
    name: "-",
    email: "-",
    phone_number: "-",
    registration_date: "-",
    last_login: "-",
    staff_id: "-",
    store_id: "-",
    old_password: "",
    new_password: "",
    password_confirmation: ""
  });

  const AccountSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required("Please input an email."),
    phone_number: Yup.number()
      .integer()
      .min(1),
    old_password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%*?&]{8,20}$/,
        "Password at least must have one uppercase, one numeric, and 8 characters long."
      )
      .required("Please input a password."),
    new_password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%*?&]{8,20}$/,
        "Password at least must have one uppercase, one numeric, and 8 characters long."
      )
      .required("Please input a password."),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("new_password"), null], "Password do not match")
      .required("Please input a password confirmation.")
  });

  const formikAccount = useFormik({
    enableReinitialize: true,
    initialValues: account,
    validationSchema: AccountSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      let url;

      const accountData = {
        email: values.email,
        phone_number: JSON.stringify(values.phone_number),
        old_password: values.old_password,
        new_password: values.new_password
      };

      if (isOwner) {
        url = `${API_URL}/api/v1/owner/${userInfo.owner_id}`;
      } else {
        url = `${API_URL}/api/v1/staff/${userInfo.user_id}`;
      }

      try {
        enableLoading();
        await axios.put(url, accountData);
        disableLoading();
        closeModal();
      } catch (err) {
        setAlert(err.response?.message || err);
        disableLoading();
      }
    }
  });

  const validationAccount = (fieldname) => {
    if (formikAccount.touched[fieldname] && formikAccount.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikAccount.touched[fieldname] && !formikAccount.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);
  const openModal = () => setStateModal(true);
  const closeModal = () => setStateModal(false);

  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const isOwner = userInfo.owner_id ? true : false;

  const getUserInfo = async (user, owner) => {
    const registrationDateFormat = (date) => dayjs(date).format("DD-MM-YYYY");
    const loginDateFormat = (date) => dayjs(date).format("DD-MM-YYYY HH:mm:ss");
    const API_URL = process.env.REACT_APP_API_URL;

    let storeStaffId = "";
    let url;

    if (owner) {
      url = `${API_URL}/api/v1/owner/${user.owner_id}`;
    } else {
      url = `${API_URL}/api/v1/staff/${user.user_id}`;
    }

    const { data } = await axios.get(url);

    if (owner) {
      storeStaffId = data.data.Business.store_id;
    } else {
      storeStaffId = data.data.Business.staff_id;
    }

    setAccount({
      ...account,
      name: data.data.Business.name,
      phone_number: data.data.Business.phone_number,
      email: data.data.email,
      registration_date: registrationDateFormat(data.data.created_at),
      last_login: data.data.last_login
        ? loginDateFormat(data.data.last_login)
        : "-",
      [owner ? "store_id" : "staff_id"]: storeStaffId
    });
  };

  React.useEffect(() => {
    getUserInfo(userInfo, isOwner);
  }, []);

  const allFields = [
    {
      field: isOwner ? "Business Name" : "Name",
      value: account.name
    },
    {
      field: "Email",
      value: account.email
    },
    {
      field: "Phone number",
      value: account.phone_number
    },
    {
      field: "Registration Date",
      value: account.registration_date
    },
    {
      field: "Last Login",
      name: "last_login",
      value: account.last_login
    },
    {
      field: isOwner ? "Store ID" : "Staff ID",
      value: isOwner ? account.store_id : account.staff_id
    }
  ];

  return (
    <>
      <ModalAccountInformation
        state={stateModal}
        closeModal={closeModal}
        loading={loading}
        accountData={account}
        alert={alert}
        formikAccount={formikAccount}
        validationAccount={validationAccount}
      />

      <Row>
        <Col md={12}>
          <Paper elevation={2} style={{ padding: "1rem" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>Account Information</h3>
              </div>
              <div className="headerEnd">
                <Button variant="primary" onClick={openModal}>
                  Change Account Information
                </Button>
              </div>
            </div>

            {allFields.map((item, index) => {
              return (
                <Row key={index} style={{ padding: "1rem" }}>
                  <Col md={4}>{item.field}</Col>
                  <Col md={8}>: {item.value}</Col>
                </Row>
              );
            })}
          </Paper>
        </Col>
      </Row>
    </>
  );
};

const ModalAccountInformation = ({
  state,
  closeModal,
  loading,
  alert,
  formikAccount,
  validationAccount
}) => {
  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Change Account Information</Modal.Title>
      </Modal.Header>

      <Form onSubmit={formikAccount.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  {...formikAccount.getFieldProps("email")}
                  className={validationAccount("email")}
                  required
                />
                {formikAccount.touched.email && formikAccount.errors.email ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikAccount.errors.email}
                    </div>
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="number"
                  name="phone_number"
                  {...formikAccount.getFieldProps("phone_number")}
                  className={validationAccount("phone_number")}
                  required
                />
                {formikAccount.touched.phone_number &&
                formikAccount.errors.phone_number ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikAccount.errors.phone_number}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                  type="password"
                  name="old_password"
                  {...formikAccount.getFieldProps("old_password")}
                  className={validationAccount("old_password")}
                  required
                />
                {formikAccount.touched.old_password &&
                formikAccount.errors.old_password ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikAccount.errors.old_password}
                    </div>
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="new_password"
                  {...formikAccount.getFieldProps("new_password")}
                  className={validationAccount("new_password")}
                  required
                />
                {formikAccount.touched.new_password &&
                formikAccount.errors.new_password ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikAccount.errors.new_password}
                    </div>
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password_confirmation"
                  {...formikAccount.getFieldProps("password_confirmation")}
                  className={validationAccount("password_confirmation")}
                  required
                />
                {formikAccount.touched.password_confirmation &&
                formikAccount.errors.password_confirmation ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikAccount.errors.password_confirmation}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              "Save changes"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
