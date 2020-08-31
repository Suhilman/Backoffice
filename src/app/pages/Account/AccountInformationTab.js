import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import { Row, Col, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";

import { useStyles } from "./AccountPage";

export const AccountInformation = () => {
  const classes = useStyles();

  // default states
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");

  // modals
  const [stateModal, setStateModal] = React.useState(false);

  // states
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
    confirm_password: ""
  });

  // handles
  const writeAlert = val => setAlert(val);
  const enableLoading = e => setLoading(true);
  const disableLoading = e => setLoading(false);
  const openModal = e => setStateModal(true);
  const closeModal = e => setStateModal(false);

  const handleChangeAccount = e => {
    const { name, value } = e.target;
    setAccount({
      ...account,
      [name]: value
    });
  };

  const handleSave = async () => {
    writeAlert("");
    enableLoading();

    if (account.new_password !== account.confirm_password) {
      return writeAlert("Password do not match");
    }

    const data = {
      email: account.email,
      phone_number: account.phone_number,
      old_password: account.old_password,
      new_password: account.new_password
    };

    let url;
    const API_URL = process.env.REACT_APP_API_URL;

    if (isOwner) {
      url = `${API_URL}/api/v1/owner/${userInfo.owner_id}`;
    } else {
      url = `${API_URL}/api/v1/staff/${userInfo.user_id}`;
    }

    try {
      await axios.put(url, data);

      disableLoading();
      closeModal();

      setAccount({
        ...account,
        old_password: "",
        new_password: "",
        confirm_password: ""
      });
    } catch (err) {
      disableLoading();

      if (err.response?.data?.message) {
        writeAlert(err.response.data.message);
      }

      writeAlert(err);
    }
  };

  // functions
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const isOwner = userInfo.owner_id ? true : false;

  const getUserInfo = async (user, owner) => {
    const registrationDateFormat = date => dayjs(date).format("DD-MM-YYYY");
    const loginDateFormat = date => dayjs(date).format("DD-MM-YYYY HH:mm:ss");
    const API_URL = process.env.REACT_APP_API_URL;

    let storeStaffId = "";
    let url;

    if (owner) {
      url = `${API_URL}/api/v1/owner/${user.owner_id}`;
    } else {
      url = `${API_URL}/api/v1/staff/${user.user_id}`;
    }

    try {
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
    } catch (err) {
      if (err.response?.data?.message) {
        writeAlert(err.response.data.message);
      }

      writeAlert(err);

      Object.keys(account).forEach(key => {
        setAccount({
          ...account,
          [key]: "-"
        });
      });
    }
  };

  React.useEffect(() => {
    getUserInfo(userInfo, isOwner);
  }, []);

  // input fields
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
        handleSave={handleSave}
        handleOnChange={handleChangeAccount}
        loading={loading}
        accountData={account}
        alert={alert}
      />

      <Row>
        <Col md={12}>
          <div className={classes.header}>
            <div className={classes.headerStart}>
              <h3>Account Information</h3>
            </div>
            <div className={classes.headerEnd}>
              <Button variant="outline-primary" onClick={openModal}>
                Change Account Information
              </Button>
            </div>
          </div>

          {allFields.map((item, index) => {
            return (
              <Row key={index} className={classes.padding}>
                <Col md={4}>{item.field}</Col>
                <Col md={8}>{item.value}</Col>
              </Row>
            );
          })}
        </Col>
      </Row>
    </>
  );
};

const ModalAccountInformation = ({
  state,
  closeModal,
  handleSave,
  handleOnChange,
  loading,
  accountData,
  alert
}) => {
  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Change Account Information</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {alert ? <Alert variant="danger">{alert}</Alert> : ""}

        <Form onSubmit={handleSave}>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={accountData.email}
                  name="email"
                  onChange={handleOnChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="number"
                  value={accountData.phone_number}
                  name="phone_number"
                  onChange={handleOnChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                  type="password"
                  value={accountData.old_password}
                  name="old_password"
                  onChange={handleOnChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={accountData.new_password}
                  name="new_password"
                  onChange={handleOnChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={accountData.confirm_password}
                  name="confirm_password"
                  onChange={handleOnChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button onClick={handleSave}>
          {loading ? (
            <Spinner animation="border" variant="light" size="sm" />
          ) : (
            "Save changes"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
