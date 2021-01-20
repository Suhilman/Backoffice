import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { Paper } from "@material-ui/core";

import "../style.css";

export const BusinessInformation = () => {
  const [loading, setLoading] = React.useState(false);

  const [previewKtp, setPreviewKtp] = React.useState("");
  const [previewNpwp, setPreviewNpwp] = React.useState("");
  const [previewBusinessImage, setPreviewBusinessImage] = React.useState("");
  const [imageKtp, setImageKtp] = React.useState("");
  const [imageNpwp, setImageNpwp] = React.useState("");
  const [businessImage, setBusinessImage] = React.useState("");

  const [allBusinessTypes, setAllBusinessTypes] = React.useState([]);
  const [allProvinces, setAllProvinces] = React.useState([]);
  const [allCities, setAllCities] = React.useState([]);
  const [allLocations, setAllLocations] = React.useState([]);

  const [stateComponent, setStateComponent] = React.useState("show");
  const [refresh, setRefresh] = React.useState("show");

  const [business, setBusiness] = React.useState({
    name: "",
    province_name: "",
    city_name: "",
    business_location: "",
    business_address: "",
    business_phone_number: "",
    ktp_number: "",
    npwp_number: "",
    business_type: "",
    payment_method: "",
    sales_type: "",
    business_type_id: "",
    province_id: "",
    city_id: "",
    location_id: ""
  });

  const BusinessSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
      .required("Please input a business name."),
    business_address: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
      .required("Please input a business address."),
    business_phone_number: Yup.number()
      .typeError("Please input a number only")
      .required("Please input a business phone_number"),
    ktp_number: Yup.number()
      .typeError("Please input a number only")
      .test("ktp_number", "Must exactly 16 digits", (val) =>
        val ? val.toString().length === 16 : ""
      )
      .required("Please input a ktp_number"),
    npwp_number: Yup.number()
      .typeError("Please input a number only")
      .test("npwp_number", "Must exactly 15 digits", (val) =>
        val ? val.toString().length === 15 : ""
      )
      .required("Please input a npwp_number"),
    business_type_id: Yup.number()
      .integer()
      .min(1)
      .required("Please input a business category"),
    location_id: Yup.number()
      .integer()
      .min(1)
      .required("Please input a business location")
  });

  const formikBusiness = useFormik({
    enableReinitialize: true,
    initialValues: business,
    validationSchema: BusinessSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      const userInfo = JSON.parse(localStorage.getItem("user_info"));

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone_number", values.business_phone_number);
      formData.append("location_id", values.location_id);
      formData.append("ktp_owner", values.ktp_number);
      formData.append("npwp_business", values.npwp_number);
      formData.append("business_type_id", values.business_type_id);
      formData.append("address", values.business_address);

      if (imageKtp) formData.append("ktp_picture", imageKtp);
      if (imageNpwp) formData.append("npwp_picture", imageNpwp);
      if (businessImage) formData.append("image", businessImage);

      try {
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/business/${userInfo.business_id}`,
          formData
        );
        handleRefresh();
        disableLoading();
        setStateComponent("show");
      } catch (err) {
        disableLoading();
      }
    }
  });

  const validationBusiness = (fieldname) => {
    if (formikBusiness.touched[fieldname] && formikBusiness.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikBusiness.touched[fieldname] &&
      !formikBusiness.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const getBusinessInfo = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/business/${userInfo.business_id}`
      );

      setBusiness({
        name: data.data.name,
        province_name: data.data.Location.City.Province.name,
        city_name: data.data.Location.City.name,
        business_location: data.data.Location.name,
        business_type: data.data.Business_Type.name,
        business_address: data.data.address || "",
        business_phone_number: data.data.phone_number,
        ktp_number: data.data.ktp_owner || "",
        npwp_number: data.data.npwp_business || "",
        payment_method: "",
        sales_type: "",
        business_type_id: data.data.business_type_id,
        province_id: data.data.Location.City.Province.id,
        city_id: data.data.Location.City.id,
        location_id: data.data.location_id
      });

      setImageKtp(
        `${data.data.ktp_picture ? `${API_URL}/${data.data.ktp_picture}` : ""}`
      );

      setImageNpwp(
        `${
          data.data.npwp_picture ? `${API_URL}/${data.data.npwp_picture}` : ""
        }`
      );

      setBusinessImage(
        `${data.data.image ? `${API_URL}/${data.data.image}` : ""}`
      );

      getAllProvinces(
        data.data.Location.City.Province.id,
        data.data.Location.City.id
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getAllBusinessTypes = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/business-type`);
      setAllBusinessTypes(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllProvinces = async (province_id, city_id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/province`);
      setAllProvinces(data.data);

      const [cities] = data.data
        .filter((item) => item.id === parseInt(province_id))
        .map((item) => item.Cities);
      setAllCities(cities);

      const [locations] = cities
        .filter((item) => item.id === parseInt(city_id))
        .map((item) => item.Locations);
      setAllLocations(locations);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getAllBusinessTypes();
  }, []);

  React.useEffect(() => {
    getBusinessInfo();
  }, [refresh]);

  const handleRefresh = () => setRefresh((state) => state + 1);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleProvince = (e) => {
    const province_id = e.target.value;
    formikBusiness.setFieldValue("province_id", province_id);
    formikBusiness.setFieldValue("city_id", "");
    formikBusiness.setFieldValue("location_id", "");
    setAllLocations([]);

    const provinces = [...allProvinces];
    const [cities] = provinces
      .filter((item) => item.id === parseInt(province_id))
      .map((item) => item.Cities);
    setAllCities(cities);
  };

  const handleCity = (e) => {
    const city_id = e.target.value;
    formikBusiness.setFieldValue("city_id", city_id);

    if (!city_id) return "";

    if (allCities.length) {
      const cities = [...allCities];
      const [locations] = cities
        .filter((item) => item.id === parseInt(city_id))
        .map((item) => item.Locations);
      setAllLocations(locations);
    }
  };

  const allFields = [
    {
      field: "Business Name",
      value: business.name
    },
    {
      field: "Province",
      value: business.province_name
    },
    {
      field: "City",
      value: business.city_name
    },
    {
      field: "Business Location",
      value: business.business_location
    },
    {
      field: "Business Address",
      value: business.business_address
    },
    {
      field: "Business Phone Number",
      value: business.business_phone_number
    },
    {
      field: "KTP Number",
      value: business.ktp_number
    },
    {
      field: "NPWP Number",
      value: business.npwp_number
    },
    {
      field: "Business Type",
      value: business.business_type
    },
    {
      field: "Payment Method",
      value: business.payment_method
    },
    {
      field: "Sales Type",
      value: business.sales_type
    }
  ];

  const handleStateComponent = () => {
    if (stateComponent === "show") {
      setStateComponent("edit");
    } else {
      formikBusiness.resetForm();
      setStateComponent("show");
    }
  };

  const handlePreviewKtp = (e) => {
    let preview;
    let img;

    if (e.target.files && e.target.files[0]) {
      preview = URL.createObjectURL(e.target.files[0]);
      img = e.target.files[0];
    } else {
      preview = "";
    }

    setImageKtp(img);
    setPreviewKtp(preview);
  };

  const handlePreviewNpwp = (e) => {
    let preview;
    let img;

    if (e.target.files && e.target.files[0]) {
      preview = URL.createObjectURL(e.target.files[0]);
      img = e.target.files[0];
    } else {
      preview = "";
    }

    setImageNpwp(img);
    setPreviewNpwp(preview);
  };

  const handlePreviewBusiness = (e) => {
    let preview;
    let img;

    if (e.target.files && e.target.files[0]) {
      preview = URL.createObjectURL(e.target.files[0]);
      img = e.target.files[0];
    } else {
      preview = "";
    }

    setBusinessImage(img);
    setPreviewBusinessImage(preview);
  };

  return (
    <Row>
      <Col md={12}>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <Form noValidate onSubmit={formikBusiness.handleSubmit}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>Business Information</h3>
              </div>
              <div className="headerEnd">
                {stateComponent === "show" ? (
                  <Button variant="primary" onClick={handleStateComponent}>
                    Change Business Information
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      onClick={handleStateComponent}
                      style={{ marginRight: "1rem" }}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      {loading ? (
                        <Spinner animation="border" variant="light" size="sm" />
                      ) : (
                        "Save changes"
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {stateComponent === "show" ? (
              allFields.map((item, index) => {
                return (
                  <Row key={index} style={{ padding: "1rem" }}>
                    <Col md={4}>{item.field}</Col>
                    <Col md={8}>: {item.value || "-"}</Col>
                  </Row>
                );
              })
            ) : (
              <Row style={{ padding: "1rem" }}>
                <Col>
                  <Row style={{ padding: "1rem" }}>
                    <h5>Change Business Information</h5>
                  </Row>
                  <Row style={{ padding: "1rem" }}>
                    <Col md={6}>
                      <Form.Group style={{ width: "80%" }}>
                        <Form.Label>Business Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          {...formikBusiness.getFieldProps("name")}
                          className={validationBusiness("name")}
                          required
                        />
                        {formikBusiness.touched.email &&
                        formikBusiness.errors.email ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.email}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>

                      <Form.Group style={{ width: "80%" }}>
                        <Form.Label>KTP Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="ktp_number"
                          {...formikBusiness.getFieldProps("ktp_number")}
                          className={validationBusiness("ktp_number")}
                          required
                        />
                        {formikBusiness.touched.ktp_number &&
                        formikBusiness.errors.ktp_number ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.ktp_number}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>

                      <Form.Group style={{ width: "80%" }}>
                        <Form.Label>NPWP Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="npwp_number"
                          {...formikBusiness.getFieldProps("npwp_number")}
                          className={validationBusiness("npwp_number")}
                          required
                        />
                        {formikBusiness.touched.npwp_number &&
                        formikBusiness.errors.npwp_number ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.npwp_number}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>

                      <Form.Group style={{ width: "80%" }}>
                        <Form.Label>Business Category</Form.Label>
                        <Form.Control
                          as="select"
                          name="business_type_id"
                          {...formikBusiness.getFieldProps("business_type_id")}
                          className={validationBusiness("business_type_id")}
                          required
                        >
                          {allBusinessTypes.length
                            ? allBusinessTypes.map((item) => {
                                return (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                );
                              })
                            : ""}
                        </Form.Control>
                        {formikBusiness.touched.business_type_id &&
                        formikBusiness.errors.business_type_id ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.business_type_id}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <label>Upload KTP Picture</label>
                      <Row className="box">
                        <Col>
                          <div
                            style={{
                              width: "120px",
                              height: "120px",
                              overflow: "hidden",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundImage: `url(${previewKtp || imageKtp})`
                            }}
                          />
                        </Col>
                        <Col style={{ alignSelf: "center" }}>
                          <input
                            accept="image/jpeg,image/png"
                            style={{ display: "none" }}
                            id="upload-ktp-file"
                            type="file"
                            onChange={handlePreviewKtp}
                          />
                          <label
                            htmlFor="upload-ktp-file"
                            className="btn btn-primary"
                          >
                            Upload File
                          </label>
                        </Col>
                      </Row>

                      <label>Upload NPWP Picture</label>
                      <Row className="box">
                        <Col>
                          <div
                            style={{
                              width: "120px",
                              height: "120px",
                              overflow: "hidden",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundImage: `url(${previewNpwp ||
                                imageNpwp})`
                            }}
                          />
                        </Col>
                        <Col style={{ alignSelf: "center" }}>
                          <input
                            accept="image/jpeg,image/png"
                            style={{ display: "none" }}
                            id="upload-npwp-file"
                            type="file"
                            onChange={handlePreviewNpwp}
                          />
                          <label
                            htmlFor="upload-npwp-file"
                            className="btn btn-primary"
                          >
                            Upload File
                          </label>
                        </Col>
                      </Row>

                      <label>Upload Business Picture</label>
                      <Row className="box">
                        <Col>
                          <div
                            style={{
                              width: "120px",
                              height: "120px",
                              overflow: "hidden",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundImage: `url(${previewBusinessImage ||
                                businessImage})`
                            }}
                          />
                        </Col>
                        <Col style={{ alignSelf: "center" }}>
                          <input
                            accept="image/jpeg,image/png"
                            style={{ display: "none" }}
                            id="upload-business-file"
                            type="file"
                            onChange={handlePreviewBusiness}
                          />
                          <label
                            htmlFor="upload-business-file"
                            className="btn btn-primary"
                          >
                            Upload File
                          </label>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row style={{ padding: "1rem" }}>
                    <h5>Change Business Location</h5>
                  </Row>
                  <Row style={{ padding: "1rem" }}>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Province</Form.Label>
                        <Form.Control
                          as="select"
                          name="province_id"
                          {...formikBusiness.getFieldProps("province_id")}
                          onChange={handleProvince}
                          onBlur={handleProvince}
                          className={validationBusiness("province_id")}
                          required
                        >
                          {allProvinces.length
                            ? allProvinces.map((item) => {
                                return (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                );
                              })
                            : ""}
                        </Form.Control>
                        {formikBusiness.touched.province_id &&
                        formikBusiness.errors.province_id ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.province_id}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          as="select"
                          name="location_id"
                          {...formikBusiness.getFieldProps("location_id")}
                          className={validationBusiness("location_id")}
                          required
                        >
                          <option value={""} disabled hidden>
                            Choose a Location
                          </option>
                          {allLocations.length
                            ? allLocations.map((item) => {
                                return (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                );
                              })
                            : ""}
                        </Form.Control>
                        {formikBusiness.touched.location_id &&
                        formikBusiness.errors.location_id ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.location_id}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="business_phone_number"
                          {...formikBusiness.getFieldProps(
                            "business_phone_number"
                          )}
                          className={validationBusiness(
                            "business_phone_number"
                          )}
                          required
                        />
                        {formikBusiness.touched.business_phone_number &&
                        formikBusiness.errors.business_phone_number ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.business_phone_number}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          as="select"
                          name="city_id"
                          {...formikBusiness.getFieldProps("city_id")}
                          onChange={handleCity}
                          onBlur={handleCity}
                          className={validationBusiness("city_id")}
                          required
                        >
                          <option value={""} disabled hidden>
                            Choose a City
                          </option>
                          {allCities.length
                            ? allCities.map((item) => {
                                return (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                );
                              })
                            : ""}
                        </Form.Control>
                        {formikBusiness.touched.city_id &&
                        formikBusiness.errors.city_id ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.city_id}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="business_address"
                          {...formikBusiness.getFieldProps("business_address")}
                          className={validationBusiness("business_address")}
                          required
                        />
                        {formikBusiness.touched.business_address &&
                        formikBusiness.errors.business_address ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.business_address}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
          </Form>
        </Paper>
      </Col>
    </Row>
  );
};