import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import SelectReact from "react-select";
import { KeyboardTimePicker } from "@material-ui/pickers";

import {
  FormControlLabel,
  Switch,
  FormGroup
} from "@material-ui/core";

import { Button, Modal, Spinner, Form, Row, Col, Alert} from "react-bootstrap";

import {
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import { Editor } from '@tinymce/tinymce-react'; 
import ModalMap from './ModalMap'
import axios from 'axios'

const ModalOutlet = ({
  handleSetVacation,
  stateVacation,
  stateModal,
  cancelModal,
  title,
  loading,
  formikOutlet,
  validationOutlet,
  allProvinces,
  allTaxes,
  allCities,
  allLocations,
  handleProvince,
  handleCity,
  alertPhoto,
  photoPreview,
  photo,
  handlePreviewPhoto,
  latitudeLongitude,
  t,
  handleSetStartHour,
  handleSetEndHour,
  timingState
}) => {

  // console.log("bismillah", formikOutlet.values.vacation)

  React.useEffect(() => {
    console.log("useEffect timingState", timingState)
    // const resStartHour = dayjs(timingState.start_hour).format()
    // const resEndHour = dayjs(timingState.end_hour).format()
    formikOutlet.setFieldValue("open_hour", timingState.start_hour);
    formikOutlet.setFieldValue("close_hour", timingState.end_hour);
  }, [timingState])

  const handleStartHour = (e) => handleSetStartHour(e)

  const handleEndHour = (e) => handleSetEndHour(e)

  const date = new Date()
  // console.log("Sekarang hari ke berapa", dayjs(date).format('d'))

  const handleDayChange = (e) => {
    console.log("handle day change ==>", e.target.value)
  }
  
  const optionDay = [
      {
        value: 0,
        label: "Sunday"
      },
      {
        value: 1,
        label: "Monday"
      },
      {
        value: 2,
        label: "Tuesday"
      },
      {
        value: 3,
        label: "Wednesday"
      },
      {
        value: 4,
        label: "Thursday"
      },
      {
        value: 5,
        label: "Friday"
      },
      {
        value: 6,
        label: "Saturday"
      }
    ];

  const defaultOptionDays = formikOutlet.values.open_days.map((item) => {
    console.log("item", item)
    return optionDay.find((val) => val.value === item);
  });
    
  const handleSelectDays = (value, formik) => {
    if (value) {
      console.log("handleSelectDays", value)
      const openDays = value.map((item) => item.value);
      formikOutlet.setFieldValue("open_days", openDays);
    } else {
      formikOutlet.setFieldValue("open_days", []);
    }
  };

  const API_URL = process.env.REACT_APP_API_URL;
  const [conditionCountry, setConditionCountry] = useState("")
  const [paymentDescription, setPaymentDescription] = useState("")
  const [showModalMap, setShowModalMap] = useState(false)
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxSize: 3 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });
  console.log("photoPreview", photoPreview)
  console.log("photo outlet", photo)
  const handleShowModal = () => setShowModalMap(true);
  const cancelDeleteModalOutlet = () => {
    setShowModalMap(false);
  };

  const handleEditorChange = (e) => {
    formikOutlet.setFieldValue("payment_description", e.target.getContent())
    console.log(
      'Content was updated:',
      e.target.getContent()
    );
  }
  useEffect(() => {
    setConditionCountry(localStorage.getItem("checkCountry"))
    setPaymentDescription(formikOutlet.getFieldProps("payment_description").value)
  }, [])
  // Start Map

  console.log("stateVacation", stateVacation)

  return (
    <>
      <ModalMap 
        stateModal={showModalMap}
        cancelModal={cancelDeleteModalOutlet}
        formikOutlet={formikOutlet}
      />
      <Modal show={stateModal} onHide={cancelModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={formikOutlet.handleSubmit}>
          <Modal.Body>
            {/* <Row>
              <Col>
                <div className="wrapper-map">
                  <h2>Location Outlet</h2>
                  <Search />
                  
                </div>
              </Col>
            </Row> */}
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("outletPhoto")}</Form.Label>
                  {alertPhoto ? <Alert variant="danger">{alertPhoto}</Alert> : ""}
                  <div
                    {...getRootProps({
                      className: "boxDashed dropzone"
                    })}
                  >
                    <input {...getInputProps()} />
                    {!photoPreview ? (
                      <>
                        <p>
                          {t("dragAndDrop")}
                        </p>
                        <p style={{ color: "gray" }}>{t("fileSizeLimit")}</p>
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            margin: "auto",
                            width: "120px",
                            height: "120px",
                            overflow: "hidden",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${photoPreview || photo})`
                          }}
                        />
                        <small>
                          {photo?.name
                            ? `${photo.name} - ${photo.size} bytes`
                            : ""}
                        </small>
                      </>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>{t("outletName")}:</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter Outlet Name"
                        {...formikOutlet.getFieldProps("name")}
                        className={validationOutlet("name")}
                        required
                      />
                      {formikOutlet.touched.name && formikOutlet.errors.name ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikOutlet.errors.name}
                          </div>
                        </div>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>{t("phoneNumber")}:</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone_number"
                        placeholder="Enter Phone Number"
                        {...formikOutlet.getFieldProps("phone_number")}
                        className={validationOutlet("phone_number")}
                      />
                      {formikOutlet.touched.phone_number &&
                      formikOutlet.errors.phone_number ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikOutlet.errors.phone_number}
                          </div>
                        </div>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
              {conditionCountry === "true" || formikOutlet.getFieldProps("location_id").value ? (
                <Form.Group>
                  <Form.Label>{t("selectProvince")}:</Form.Label>
                  <Form.Control
                    as="select"
                    name="province_id"
                    value={formikOutlet.getFieldProps("province_id").value}
                    onChange={(e) => handleProvince(e, formikOutlet)}
                    onBlur={(e) => handleProvince(e, formikOutlet)}
                    className={validationOutlet("province_id")}
                    required
                  >
                    <option value="" disabled hidden>
                      {t("chooseAProvince")}
                    </option>
                    {allProvinces?.length
                      ? allProvinces.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })
                      : ""}
                  </Form.Control>
                  {formikOutlet.touched.province_id &&
                  formikOutlet.errors.province_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOutlet.errors.province_id}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              ) : (
                <Form.Group>
                  <Form.Label>{t("pleaseInputProvince")}:</Form.Label>
                  <Form.Control
                    type="text"
                    name="province"
                    placeholder="Enter province"
                    {...formikOutlet.getFieldProps("province")}
                    className={validationOutlet("province")}
                    required
                  />
                  {formikOutlet.touched.province && formikOutlet.errors.province ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOutlet.errors.province}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              )}
              </Col>

              <Col>
              {conditionCountry === "true" || formikOutlet.getFieldProps("location_id").value ? (
                <Form.Group>
                  <Form.Label>{t("selectCity")}:</Form.Label>
                  <Form.Control
                    as="select"
                    name="city_id"
                    value={formikOutlet.getFieldProps("city_id").value}
                    onChange={(e) => handleCity(e, formikOutlet)}
                    onBlur={(e) => handleCity(e, formikOutlet)}
                    className={validationOutlet("city_id")}
                    required
                  >
                    <option value="" disabled hidden>
                      {t("chooseACity")}
                    </option>
                    {allCities?.length
                      ? allCities.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })
                      : ""}
                  </Form.Control>
                  {formikOutlet.touched.city_id && formikOutlet.errors.city_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOutlet.errors.city_id}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              ) : (
                <Form.Group>
                  <Form.Label>{t("pleaseInputCity")}:</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    {...formikOutlet.getFieldProps("city")}
                    className={validationOutlet("city")}
                    required
                  />
                  {formikOutlet.touched.city && formikOutlet.errors.city ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOutlet.errors.city}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              )}
              </Col>
            </Row>

            <Row>
              <Col>
              {conditionCountry === "true" || formikOutlet.getFieldProps("location_id").value ? (
                <Form.Group>
                  <Form.Label>{t("selectLocation")}:</Form.Label>
                  <Form.Control
                    as="select"
                    name="location_id"
                    {...formikOutlet.getFieldProps("location_id")}
                    className={validationOutlet("location_id")}
                    required
                  >
                    <option value="" disabled hidden>
                      {t("chooseALocation")}
                    </option>
                    {allLocations?.length
                      ? allLocations.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })
                      : ""}
                  </Form.Control>
                  {formikOutlet.touched.location_id &&
                  formikOutlet.errors.location_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOutlet.errors.location_id}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              ) : (
                <Form.Group>
                  <Form.Label>{t("pleaseInputLocation")}:</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    {...formikOutlet.getFieldProps("location")}
                    className={validationOutlet("location")}
                    required
                  />
                  {formikOutlet.touched.location && formikOutlet.errors.location ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOutlet.errors.location}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              )}
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>{t("postcode")}:</Form.Label>
                  <Form.Control
                    type="number"
                    name="postcode"
                    placeholder="Enter Postcode"
                    {...formikOutlet.getFieldProps("postcode")}
                    className={validationOutlet("postcode")}
                  />
                  {formikOutlet.touched.postcode &&
                  formikOutlet.errors.postcode ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOutlet.errors.postcode}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("address")}:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="address"
                    placeholder="Enter Address"
                    {...formikOutlet.getFieldProps("address")}
                    className={validationOutlet("address")}
                  />
                  {formikOutlet.touched.address && formikOutlet.errors.address ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOutlet.errors.address}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="btn btn-danger mb-2" onClick={handleShowModal}>{t("pickLocation")}</div>
                <Form.Group as={Row} style={{ padding: "0 1rem" }}>
                  <Form.Label>{t("outletStatus")}:</Form.Label>
                  <Col>
                    {["Active", "Inactive"].map((item, index) => {
                      return (
                        <Form.Check
                          key={index}
                          type="radio"
                          name="status"
                          label={item}
                          value={item.toLowerCase()}
                          checked={
                            item.toLowerCase() ===
                            formikOutlet.getFieldProps("status").value
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            const status = e.target.value;
                            if (status === "active") {
                              formikOutlet.setFieldValue("status", "active");
                            } else {
                              formikOutlet.setFieldValue("status", "inactive");
                            }
                          }}
                          className={validationOutlet("status")}
                        />
                      );
                    })}
                  </Col>
                  {formikOutlet.touched.status && formikOutlet.errors.status ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOutlet.errors.status}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
              {/* <Col>
                <Form.Label>Select Open Day:</Form.Label>
                <FormControl style={{ width: "100%" }}>
                  <InputLabel>Day</InputLabel>
                  <SelectReact
                    isMulti
                    options={optionDay}
                    name="open_days"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(value) =>
                      handleSelectDays(value, formikOutlet)
                    }
                    defaultValue={defaultOptionDays}
                  />
                  {formikOutlet.touched.open_days &&
                  formikOutlet.errors.open_days ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOutlet.errors.open_days}
                      </div>
                    </div>
                  ) : null}
                </FormControl>
                <div className="d-flex justify-content-between align-items-end">
                  <div style={{width: "45%"}}>
                    <KeyboardTimePicker
                      margin="normal"
                      id="open-hour"
                      label="Open"
                      ampm={false}
                      name="open_hour"
                      value={timingState.start_hour}
                      onChange={handleStartHour}
                      KeyboardButtonProps={{
                        "aria-label": "change time"
                      }}
                    />
                  </div>
                  <span className="mb-3">-</span>
                  <div style={{width: "45%"}}>
                    <KeyboardTimePicker
                      margin="normal"
                      id="open-hour"
                      label="Close"
                      ampm={false}
                      name="open_hour"
                      value={timingState.end_hour}
                      onChange={handleEndHour}
                      KeyboardButtonProps={{
                        "aria-label": "change time"
                      }}
                    />
                  </div>
                </div>
              </Col> */}
            </Row>
            {/* <Row>
              <Col>
              </Col>
              <Col>
                <Form.Group style={{ margin: 0 }}>
                  <Form.Label style={{ alignSelf: "center", marginRight: "1rem" }}>
                    {t("Vacation")}
                  </Form.Label>
                  <FormControlLabel
                    value={stateVacation}
                    name="vacation"
                    control={
                      <Switch
                        color="primary"
                        checked={stateVacation === "Active" ? true : false}
                        onChange={(e) => {
                          console.log("switch vacation", e.target.value)
                          if (stateVacation === e.target.value) {
                            if (stateVacation === "Active") {
                              handleSetVacation("Inactive");
                              formikOutlet.setFieldValue("vacation", "Inactive")
                            } else {
                              handleSetVacation("Active");
                              formikOutlet.setFieldValue("vacation", "Active")
                            }
                          }
                        }}
                        name=""
                      />
                    }
                  />
                </Form.Group>
              </Col>
            </Row> */}
            {/* <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("paymentInstruction")}:</Form.Label>
                  <Editor
                    // initialValue={!formikOutlet.getFieldProps("payment_description").value ? "please describe to make a payment at your outlet" : formikOutlet.getFieldProps("payment_description").value }
                    init={{
                      selector: {paymentDescription},
                      menubar: 'file',
                      toolbar: 'fullpage',
                      height: 500,
                      menubar: false,
                      plugins: [
                        'fullpage',
                        'advlist autolink lists link image', 
                        'charmap print preview anchor help',
                        'searchreplace visualblocks code',
                        'insertdatetime media table paste wordcount'
                      ],
                      toolbar:
                        'undo redo | formatselect | bold italic | \
                        alignleft aligncenter alignright | \
                        bullist numlist outdent indent | help'
                    }}
                    outputFormat='text'
                    apiKey="0eeusytyrfgdlkvifhuqjn88hwz7n7zar8qcc3s5dazfhkvl"
                    onChange={handleEditorChange}
                  />
                  {formikOutlet.touched.payment_description && formikOutlet.errors.payment_description ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOutlet.errors.payment_description}
                      </div>
                    </div>
                  ) : null}

                </Form.Group>
              </Col>
            </Row> */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelModal}>
              {t("cancel")}
            </Button>
            <Button variant="primary" type="submit">
              {loading ? (
                <Spinner animation="border" variant="light" size="sm" />
              ) : (
                `${t("saveChanges")}`
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ModalOutlet;
