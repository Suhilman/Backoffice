import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Button, Row, Col, Form, Alert, Spinner } from "react-bootstrap";
import { IconButton, Paper } from "@material-ui/core";
import { Edit } from "@material-ui/icons";

import "../style.css";

export const DetailCustomerPage = ({ match }) => {
  const { customerId } = match.params;

  const [refresh, setRefresh] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [statePage, setStatePage] = React.useState("show");
  const [preview, setPreview] = React.useState("");
  const [image, setImage] = React.useState("");
  const [previewInitial, setPreviewInitial] = React.useState("");
  const [imageInitial, setImageInitial] = React.useState("");

  const [customer, setCustomer] = React.useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    notes: ""
  });
  const [customerInitial, setCustomerInitial] = React.useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    notes: ""
  });

  const CustomerSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
      .required("Please input a customer name."),
    email: Yup.string()
      .email()
      .required("Please input an email."),
    phone_number: Yup.number()
      .typeError("Please input a number only")
      .required("Please input a phone number."),
    address: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
      .required("Please input an address."),
    notes: Yup.string()
  });

  const formikCustomer = useFormik({
    enableReinitialize: true,
    initialValues: customer,
    validationSchema: CustomerSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      if (image) formData.append("profile_picture", image);
      formData.append("phone_number", values.phone_number);
      formData.append("address", values.address);
      formData.append("notes", values.notes);

      try {
        enableLoading();
        await axios.put(`${API_URL}/api/v1/customer/${customerId}`, formData);
        handleRefresh();
        disableLoading();
        setAlert("");
        setStatePage("show");
      } catch (err) {
        setAlert(err.response.data.message || err.message);
        disableLoading();
      }
    }
  });

  const validationCustomer = (fieldname) => {
    if (formikCustomer.touched[fieldname] && formikCustomer.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikCustomer.touched[fieldname] &&
      !formikCustomer.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const getCustomer = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/customer/${id}`);
      setCustomer({
        name: data.data.name,
        email: data.data.email,
        phone_number: data.data.phone_number,
        address: data.data.address,
        notes: data.data.notes
      });
      setCustomerInitial({
        name: data.data.name,
        email: data.data.email,
        phone_number: data.data.phone_number,
        address: data.data.address,
        notes: data.data.notes
      });
      if (data.data.profile_picture) {
        setImage(`${API_URL}${data.data.profile_picture}`);
        setPreview(`${API_URL}${data.data.profile_picture}`);

        setImageInitial(`${API_URL}${data.data.profile_picture}`);
        setPreviewInitial(`${API_URL}${data.data.profile_picture}`);
      }
    } catch (err) {
      setAlert(err.response.data.message || err.message);
    }
  };

  React.useEffect(() => {
    getCustomer(customerId);
  }, [refresh, customerId]);

  const handleRefresh = () => setRefresh((state) => state + 1);
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleStatePage = () => {
    if (statePage === "show") {
      setStatePage("edit");
    } else {
      setCustomer(customerInitial);
      setImage(imageInitial);
      setPreview(previewInitial);
      setStatePage("show");
    }
  };

  const handleImage = (e) => {
    let preview;
    let img;

    if (e.target.files && e.target.files[0]) {
      preview = URL.createObjectURL(e.target.files[0]);
      img = e.target.files[0];
    } else {
      preview = "";
    }

    setImage(img);
    setPreview(preview);
  };

  return (
    <>
      <Row>
        <Col>
          <Form noValidate onSubmit={formikCustomer.handleSubmit}>
            <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
              <div className="headerPage">
                <div className="headerStart">
                  <h3>Customer Information</h3>
                </div>

                <div className="headerEnd">
                  {statePage === "show" ? (
                    <Link to="/customer">
                      <Button
                        variant="secondary"
                        style={{ marginRight: "1rem" }}
                      >
                        Back to Customer List
                      </Button>
                    </Link>
                  ) : (
                    ""
                  )}

                  <Button
                    variant={statePage === "show" ? "primary" : "secondary"}
                    onClick={handleStatePage}
                  >
                    {statePage === "show" ? "Edit Customer Data" : "Cancel"}
                  </Button>

                  {statePage === "show" ? (
                    ""
                  ) : (
                    <Button
                      variant="primary"
                      style={{ marginLeft: "1rem" }}
                      type="submit"
                    >
                      {loading ? (
                        <Spinner animation="border" variant="light" size="sm" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <Row style={{ padding: "1rem" }}>
                {alert ? <Alert variant="danger">{alert}</Alert> : ""}

                <Col md={3}>
                  <Paper
                    elevation={2}
                    style={{
                      width: "120px",
                      height: "120px",
                      overflow: "hidden",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage: `url(${preview || image})`
                    }}
                  >
                    {statePage === "edit" ? (
                      <>
                        <input
                          accept="image/jpeg,image/png"
                          style={{ display: "none" }}
                          id="icon-button-file"
                          type="file"
                          onChange={handleImage}
                        />
                        <label htmlFor="icon-button-file">
                          <IconButton
                            color="secondary"
                            aria-label="upload picture"
                            component="span"
                            style={{
                              position: "absolute",
                              left: "-5px",
                              top: "-20px"
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </label>
                      </>
                    ) : (
                      ""
                    )}
                  </Paper>

                  {statePage === "edit" ? (
                    <p className="text-muted mt-1">
                      Allowed file types: .png, .jpg, .jpeg
                    </p>
                  ) : (
                    ""
                  )}
                </Col>

                <Col md={3}>
                  <div className="title">Customer Name</div>
                  {statePage === "show" ? (
                    <h5 className="mb-5">{formikCustomer.values.name}</h5>
                  ) : (
                    <>
                      <Form.Control
                        type="text"
                        name="name"
                        {...formikCustomer.getFieldProps("name")}
                        className={validationCustomer("name")}
                        required
                      />
                      {formikCustomer.touched.name &&
                      formikCustomer.errors.name ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikCustomer.errors.name}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}

                  <div className="title">Customer Email</div>
                  {statePage === "show" ? (
                    <h5>{formikCustomer.values.email}</h5>
                  ) : (
                    <>
                      <Form.Control
                        type="email"
                        name="email"
                        {...formikCustomer.getFieldProps("email")}
                        className={validationCustomer("email")}
                        required
                      />
                      {formikCustomer.touched.email &&
                      formikCustomer.errors.email ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikCustomer.errors.email}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}
                </Col>

                <Col md={3}>
                  <div className="title">Customer Phone Number</div>
                  {statePage === "show" ? (
                    <h5>{formikCustomer.values.phone_number}</h5>
                  ) : (
                    <>
                      <Form.Control
                        type="text"
                        name="phone_number"
                        {...formikCustomer.getFieldProps("phone_number")}
                        className={validationCustomer("phone_number")}
                        required
                      />
                      {formikCustomer.touched.phone_number &&
                      formikCustomer.errors.phone_number ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikCustomer.errors.phone_number}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}

                  <div className="title">Customer Address</div>
                  {statePage === "show" ? (
                    <h5>{formikCustomer.values.address}</h5>
                  ) : (
                    <>
                      <Form.Control
                        type="text"
                        name="address"
                        {...formikCustomer.getFieldProps("address")}
                        className={validationCustomer("address")}
                        required
                      />
                      {formikCustomer.touched.address &&
                      formikCustomer.errors.address ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikCustomer.errors.address}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}
                </Col>
              </Row>
              <Row style={{ padding: "1rem" }}>
                <Col>
                  <Form.Group>
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      disabled={statePage === "show" ? true : false}
                      {...formikCustomer.getFieldProps("notes")}
                      className={validationCustomer("notes")}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Paper>
          </Form>
        </Col>
      </Row>
    </>
  );
};
