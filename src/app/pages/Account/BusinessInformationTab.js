import React from "react";
import axios from "axios";

import { Row, Col, Button, Form } from "react-bootstrap";

import { useStyles } from "./AccountPage";

export const BusinessInformation = () => {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

  const [name, setName] = React.useState("-");
  const [provinceName, setProvinceName] = React.useState("-");
  const [cityName, setCityName] = React.useState("-");
  const [locationName, setLocationName] = React.useState("-");
  const [businessCategoryName, setBusinessCategoryName] = React.useState("-");

  const [address, setAddress] = React.useState("-");
  const [phonenumber, setPhonenumber] = React.useState("-");
  const [ktpOwner, setKtpOwner] = React.useState("-");
  const [npwpBusiness, setNpwpBusiness] = React.useState("-");
  const [paymentMethod, setPaymentMethod] = React.useState("-");
  const [sellingType, setSellingType] = React.useState("-");

  const [previewKtp, setPreviewKtp] = React.useState("");
  const [previewNpwp, setPreviewNpwp] = React.useState("");
  const [previewBusinessImage, setPreviewBusinessImage] = React.useState("");
  const [imageKtp, setImageKtp] = React.useState("");
  const [imageNpwp, setImageNpwp] = React.useState("");
  const [businessImage, setBusinessImage] = React.useState("");

  const [province, setProvince] = React.useState("");
  const [city, setCity] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [businessCategory, setBusinessCategory] = React.useState("-");

  const [allBusinessCategories, setAllBusinessCategories] = React.useState([]);
  const [allProvinces, setAllProvinces] = React.useState([]);
  const [allCities, setAllCities] = React.useState([]);
  const [allLocations, setAllLocations] = React.useState([]);

  const [stateComponent, setStateComponent] = React.useState("show");

  const userInfo = JSON.parse(localStorage.getItem("user_info"));

  const getBusinessInfo = async () => {
    try {
      const business = await axios.get(
        `${API_URL}/api/v1/business/${userInfo.business_id}`
      );

      setProvince(business.data.data.Location.City.Province.id);
      setCity(business.data.data.Location.City.id);
      setLocation(business.data.data.location_id);
      setBusinessCategory(business.data.data.business_category_id);

      setName(business.data.data.name || "-");
      setProvinceName(business.data.data.Location.City.Province.name || "-");
      setCityName(business.data.data.Location.City.name || "-");
      setLocationName(business.data.data.Location.name || "-");
      setBusinessCategoryName(business.data.data.Business_Category.name || "-");
      setAddress(business.data.data.address || "-");
      setPhonenumber(business.data.data.phone_number || "-");
      setKtpOwner(business.data.data.ktp_owner || "-");
      setNpwpBusiness(business.data.data.npwp_business || "-");
      setPaymentMethod(business.data.data.payment_method || "-");
      sellingType(business.data.data.selling_type || "-");

      setImageKtp(business.data.data.ktp_picture || "");
      setImageNpwp(business.data.data.npwp_picture || "");
      setBusinessImage(business.data.data.image || "");
    } catch (err) {
      console.log(err);
    }
  };

  const getAllBusinessCategories = async () => {
    try {
      const businessCategories = await axios.get(
        `${API_URL}/api/v1/business-category`
      );
      setAllBusinessCategories(businessCategories.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllProvinces = async () => {
    try {
      const provinces = await axios.get(`${API_URL}/api/v1/province`);
      setAllProvinces(provinces.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getProvinceById = async id => {
    try {
      const cities = await axios.get(`${API_URL}/api/v1/province/${id}`);
      setAllCities(cities.data.data.Cities);
    } catch (err) {
      console.log(err);
    }
  };

  const getCityById = async id => {
    try {
      const locations = await axios.get(`${API_URL}/api/v1/city/${id}`);
      setAllLocations(locations.data.data.Locations);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getBusinessInfo();
    getAllProvinces();
    getAllBusinessCategories();
  }, []);

  React.useEffect(() => {
    getProvinceById(province);
  }, [province]);

  React.useEffect(() => {
    getCityById(city);
  }, [city]);

  const allFields = [
    {
      field: "Business Name",
      value: name
    },
    {
      field: "Province",
      value: provinceName
    },
    {
      field: "City",
      value: cityName
    },
    {
      field: "Business Location",
      value: locationName
    },
    {
      field: "Business Address",
      value: address
    },
    {
      field: "Business Phone Number",
      value: phonenumber
    },
    {
      field: "KTP Number",
      value: ktpOwner
    },
    {
      field: "NPWP Number",
      value: npwpBusiness
    },
    {
      field: "Business Category",
      value: businessCategoryName
    },
    {
      field: "Payment Method",
      value: paymentMethod
    },
    {
      field: "Selling Type",
      value: sellingType
    }
  ];

  const handleStateComponent = () => {
    if (stateComponent === "show") {
      setStateComponent("edit");
    } else {
      setStateComponent("show");
    }
  };

  const handleOnChange = e => {
    const key = e.target.name;
    const value = e.target.value;

    const states = [
      {
        name: "name",
        state: val => setName(val)
      },
      {
        name: "ktpOwner",
        state: val => setKtpOwner(val)
      },
      {
        name: "npwpBusiness",
        state: val => setNpwpBusiness(val)
      }
    ];

    for (const item of states) {
      if (key === item.name) {
        item.state(value);
      }
    }
  };

  const handlePreviewKtp = e => {
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

  const handlePreviewNpwp = e => {
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

  const handlePreviewBusiness = e => {
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

  const handleSelectProvince = e => setProvince(e.target.value);
  const handleSelectCity = e => setCity(e.target.value);
  const handleSelectLocation = e => setLocation(e.target.value);
  const handleAddress = e => setAddress(e.target.value);
  const handlePhonenumber = e => setPhonenumber(e.target.value);
  const handleBusinessCategory = e => setBusinessCategory(e.target.value);

  const handleSend = async () => {
    const businessData = new FormData();
    businessData.append("name", name);
    businessData.append("phone_number", phonenumber);
    businessData.append("location_id", location);
    businessData.append("address", address);
    businessData.append("ktp_owner", ktpOwner);
    businessData.append("npwp_business", npwpBusiness);
    businessData.append("ktp_picture", imageKtp);
    businessData.append("npwp_picture", imageNpwp);
    businessData.append("image", businessImage);
    businessData.append("business_category_id", businessCategory);

    try {
      await axios.put(
        `${API_URL}/api/v1/business/${userInfo.business_id}`,
        businessData
      );
      setStateComponent("show");
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <Row>
      <Col md={12}>
        <div className={classes.header}>
          <div className={classes.headerStart}>
            <h3>Business Information</h3>
          </div>
          <div className={classes.headerEnd}>
            {stateComponent === "show" ? (
              <Button variant="outline-primary" onClick={handleStateComponent}>
                Change Business Information
              </Button>
            ) : (
              <>
                <Button
                  variant="outline-secondary"
                  onClick={handleStateComponent}
                  style={{ marginRight: "1rem" }}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSend}>
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        {stateComponent === "show" ? (
          allFields.map((item, index) => {
            return (
              <Row key={index} className={classes.padding}>
                <Col md={4}>{item.field}</Col>
                <Col md={8}>{item.value}</Col>
              </Row>
            );
          })
        ) : (
          <Row className={classes.padding}>
            <Col>
              <Row className={classes.padding}>
                <h5>Change Business Information</h5>
              </Row>
              <Row className={classes.padding}>
                <Col md={6}>
                  <Form>
                    <Form.Group style={{ width: "80%" }}>
                      <Form.Label>Business Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        name="name"
                        onChange={handleOnChange}
                      />
                    </Form.Group>

                    <Form.Group style={{ width: "80%" }}>
                      <Form.Label>KTP Number</Form.Label>
                      <Form.Control
                        type="number"
                        value={ktpOwner}
                        name="ktpOwner"
                        onChange={handleOnChange}
                      />
                    </Form.Group>

                    <Form.Group style={{ width: "80%" }}>
                      <Form.Label>NPWP Number</Form.Label>
                      <Form.Control
                        type="number"
                        value={npwpBusiness}
                        name="npwpBusiness"
                        onChange={handleOnChange}
                      />
                    </Form.Group>

                    <Form.Group style={{ width: "80%" }}>
                      <Form.Label>Business Category</Form.Label>
                      <Form.Control
                        as="select"
                        value={businessCategory}
                        onChange={handleBusinessCategory}
                      >
                        {allBusinessCategories.length
                          ? allBusinessCategories.map(item => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })
                          : ""}
                      </Form.Control>
                    </Form.Group>
                  </Form>
                </Col>
                <Col md={6}>
                  <label>Upload KTP Picture</label>
                  <Row className={classes.box}>
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
                  <Row className={classes.box}>
                    <Col>
                      <div
                        style={{
                          width: "120px",
                          height: "120px",
                          overflow: "hidden",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundImage: `url(${previewNpwp || imageNpwp})`
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
                  <Row className={classes.box}>
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

              <Row className={classes.padding}>
                <h5>Change Business Location</h5>
              </Row>
              <Row className={classes.padding}>
                <Col md={6}>
                  <Form>
                    <Form.Group>
                      <Form.Label>Province</Form.Label>
                      <Form.Control
                        as="select"
                        value={province}
                        onChange={handleSelectProvince}
                      >
                        {allProvinces.length
                          ? allProvinces.map(item => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })
                          : ""}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        as="select"
                        value={location}
                        onChange={handleSelectLocation}
                      >
                        {allLocations.length
                          ? allLocations.map(item => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })
                          : ""}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="number"
                        value={phonenumber}
                        onChange={handlePhonenumber}
                      />
                    </Form.Group>
                  </Form>
                </Col>
                <Col md={6}>
                  <Form>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        as="select"
                        value={city}
                        onChange={handleSelectCity}
                      >
                        {allCities.length
                          ? allCities.map(item => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })
                          : ""}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        value={address}
                        onChange={handleAddress}
                      />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
};
