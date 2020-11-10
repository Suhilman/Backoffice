import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Button,
  Row,
  Col,
  Form,
  Alert,
  Spinner,
  Container
} from "react-bootstrap";
import {
  IconButton,
  Paper,
  FormGroup,
  FormControl,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";

import "../style.css";

export const DetailStaffPage = ({ match, location }) => {
  const { staffId } = match.params;
  const { allOutlets, allRoles, allAccessLists } = location.state;

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [statePage, setStatePage] = React.useState("show");
  const [preview, setPreview] = React.useState("");

  const [selectedRole, setSelectedRole] = React.useState("");

  const [image, setImage] = React.useState("");
  const [staff, setStaff] = React.useState({
    outlet_id: "",
    staff_id: "",
    type: "",
    role_id: "",
    name: "",
    email: "",
    phone_number: "",
    location_name: ""
  });
  const [staffInitial, setStaffInitial] = React.useState({
    outlet_id: "",
    staff_id: "",
    type: "",
    role_id: "",
    name: "",
    email: "",
    phone_number: "",
    location_name: ""
  });

  const allTypes = ["Staff", "Manager", "Kasir", "Waiter"];

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
      .required("Please input a staff name."),
    staff_id: Yup.string()
      .min(5)
      .max(10)
      .required("Please input a staff id."),
    email: Yup.string()
      .email()
      .required("Please input an email."),
    phone_number: Yup.number().typeError("Please input a number only")
  });

  const formikStaff = useFormik({
    enableReinitialize: true,
    initialValues: staff,
    validationSchema: StaffSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("staff_id", values.staff_id);
      formData.append("email", values.email);
      formData.append("role_id", values.role_id);
      formData.append("type", values.type);
      formData.append("profile_picture", image);
      formData.append("phone_number", values.phone_number);
      formData.append("outlet_id", values.outlet_id);

      try {
        enableLoading();
        await axios.put(`${API_URL}/api/v1/staff/${staffId}`, formData);
        disableLoading();
        setAlert("");
        setStatePage("show");
      } catch (err) {
        setAlert(err.response.data.message || err.message);
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

  const getStaff = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/staff/${id}`);

      setStaff({
        outlet_id: data.data.outlet_id,
        staff_id: data.data.User.staff_id,
        name: data.data.name,
        email: data.data.User.email,
        phone_number: data.data.phone_number,
        type: data.data.User.type,
        role_id: data.data.User.role_id,
        location_name: data.data.Outlet.Location.name
      });
      setStaffInitial({
        outlet_id: data.data.outlet_id,
        staff_id: data.data.User.staff_id,
        name: data.data.name,
        email: data.data.User.email,
        phone_number: data.data.phone_number,
        type: data.data.User.type,
        role_id: data.data.User.role_id,
        location_name: data.data.Outlet.Location.name
      });

      setImage(
        `${
          data.data.profile_picture
            ? `${API_URL}/${data.data.profile_picture}`
            : ""
        }`
      );

      setSelectedRole(parseInt(data.data.User.role_id));
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getStaff(staffId);
  }, [staffId]);

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

  const handleStatePage = () => {
    if (statePage === "show") {
      setStatePage("edit");
    } else {
      formikStaff.resetForm();
      setSelectedRole(parseInt(staffInitial.role_id));
      setStatePage("show");
    }
  };

  const privilegesData = (role_id) => {
    if (!role_id) {
      return [];
    }
    const staffPrivileges = allRoles.find((item) => item.id === selectedRole);
    const sortedPrivileges = staffPrivileges.Role_Privileges.sort(
      (a, b) => a.privilege_id - b.privilege_id
    );
    return sortedPrivileges;
  };

  return (
    <>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            {alert ? <Alert variant="danger">{alert}</Alert> : ""}

            <Form onSubmit={formikStaff.handleSubmit}>
              <div className="headerPage">
                <div className="headerStart">
                  <h3>Staff Information</h3>
                </div>

                <div className="headerEnd">
                  {statePage === "show" ? (
                    <Link to="/staff">
                      <Button
                        variant="secondary"
                        style={{ marginRight: "1rem" }}
                      >
                        Back to Staff List
                      </Button>
                    </Link>
                  ) : (
                    ""
                  )}

                  <Button
                    variant={statePage === "show" ? "primary" : "secondary"}
                    onClick={handleStatePage}
                  >
                    {statePage === "show" ? "Edit Staff Data" : "Cancel"}
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

                  <p className="text-muted mt-1">
                    Allowed file types: .png, .jpg, .jpeg
                  </p>
                </Col>

                <Col md={3}>
                  <div className="title">Staff Name</div>
                  {statePage === "show" ? (
                    <h5 className="mb-5">{formikStaff.values.name}</h5>
                  ) : (
                    <>
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
                    </>
                  )}

                  <div className="title">Staff Email</div>
                  {statePage === "show" ? (
                    <h5>{formikStaff.values.email}</h5>
                  ) : (
                    <>
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
                    </>
                  )}

                  <div className="title">Staff ID</div>
                  {statePage === "show" ? (
                    <h5>{formikStaff.values.staff_id}</h5>
                  ) : (
                    <>
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
                    </>
                  )}
                </Col>

                <Col md={3}>
                  <div className="title">Staff Role</div>
                  {statePage === "show" ? (
                    allRoles.map((item) => {
                      if (item.id === parseInt(formikStaff.values.role_id)) {
                        return (
                          <h5 key={item.id} className="mb-5">
                            {item.name}
                          </h5>
                        );
                      }

                      return "";
                    })
                  ) : (
                    <>
                      <Form.Control
                        as="select"
                        name="role_id"
                        {...formikStaff.getFieldProps("role_id")}
                        onChange={(e) => {
                          const { value } = e.target;
                          formikStaff.setFieldValue("role_id", value);
                          setSelectedRole(parseInt(value));
                        }}
                        onBlur={(e) => {
                          const { value } = e.target;
                          formikStaff.setFieldValue("role_id", value);
                          setSelectedRole(parseInt(value));
                        }}
                        className={validationStaff("email")}
                        required
                      >
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
                    </>
                  )}

                  <div className="title">Staff Type</div>
                  {statePage === "show" ? (
                    <h5>{formikStaff.values.type}</h5>
                  ) : (
                    <>
                      <Form.Control
                        as="select"
                        name="type"
                        {...formikStaff.getFieldProps("type")}
                        className={validationStaff("type")}
                        required
                      >
                        {allTypes.map((item, index) => {
                          return (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          );
                        })}
                      </Form.Control>
                      {formikStaff.touched.type && formikStaff.errors.type ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikStaff.errors.type}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}
                </Col>

                <Col md={3}>
                  <div className="title">Staff Location</div>
                  {statePage === "show" ? (
                    <h5 className="mb-5">{formikStaff.values.location_name}</h5>
                  ) : (
                    <>
                      <Form.Control
                        as="select"
                        name="outlet_id"
                        {...formikStaff.getFieldProps("outlet_id")}
                        className={validationStaff("outlet_id")}
                        required
                      >
                        {allOutlets.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.Location.name}
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
                    </>
                  )}

                  <div className="title">Staff Phone Number</div>
                  {statePage === "show" ? (
                    <h5>{formikStaff.values.phone_number}</h5>
                  ) : (
                    <>
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
                    </>
                  )}
                </Col>
              </Row>

              <Row>
                <Col>
                  <div className="headerPage">
                    <div className="headerStart">
                      <h3>Access List</h3>
                    </div>
                  </div>

                  <Row>
                    {selectedRole
                      ? allAccessLists.map((access) => {
                          return (
                            <Col key={access.id} style={{ paddingTop: "1rem" }}>
                              <Paper
                                elevation={2}
                                style={{ padding: "1rem", height: "100%" }}
                              >
                                <h5>{access.name} Access List</h5>

                                <FormControl
                                  component="fieldset"
                                  style={{ width: "100%" }}
                                >
                                  <FormGroup row>
                                    <Container style={{ padding: "0" }}>
                                      {privilegesData(selectedRole).map(
                                        (privilege, index) => {
                                          if (
                                            access.name ===
                                            privilege.Privilege.Access.name
                                          ) {
                                            return (
                                              <Row
                                                key={index}
                                                style={{
                                                  padding: "0.5rem 1rem"
                                                }}
                                              >
                                                <Col
                                                  style={{
                                                    alignSelf: "center"
                                                  }}
                                                >
                                                  <Form.Label>
                                                    {privilege.Privilege.name}
                                                  </Form.Label>
                                                </Col>
                                                <Col
                                                  style={{ textAlign: "end" }}
                                                >
                                                  <FormControlLabel
                                                    key={privilege.Privilege.id}
                                                    control={
                                                      <Switch
                                                        key={
                                                          privilege.Privilege.id
                                                        }
                                                        value={
                                                          privilege.Privilege
                                                            .name
                                                        }
                                                        color="primary"
                                                        checked={
                                                          privilege.allow
                                                        }
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
                                        }
                                      )}
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
            </Form>
          </Paper>
        </Col>
      </Row>
    </>
  );
};
