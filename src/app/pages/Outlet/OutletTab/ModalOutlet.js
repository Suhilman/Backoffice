import React, { useEffect, useState } from "react";

import { Button, Modal, Spinner, Form, Row, Col, Alert } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { Editor } from '@tinymce/tinymce-react'; 

import "../../style.css";

const ModalOutlet = ({
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
  t
}) => {
  const [paymentDescription, setPaymentDescription] = useState("")
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxSize: 3 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });

  const handleEditorChange = (e) => {
    formikOutlet.setFieldValue("payment_description", e.target.getContent())
    console.log(
      'Content was updated:',
      e.target.getContent()
    );
  }
  useEffect(() => {
    setPaymentDescription(formikOutlet.getFieldProps("payment_description").value)
  }, [])
  return (
    <Modal show={stateModal} onHide={cancelModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikOutlet.handleSubmit}>
        <Modal.Body>
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
            </Col>

            <Col>
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
            </Col>
          </Row>

          <Row>
            <Col>
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
          {console.log("address", formikOutlet.getFieldProps("address"))}
          {console.log()}
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("paymentInstruction")}:</Form.Label>
                {/* <Editor
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
                ) : null} */}

              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
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
          </Row>
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
  );
};

export default ModalOutlet;
