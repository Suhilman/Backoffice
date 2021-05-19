import React from "react";
import axios from 'axios'
import Select from "react-select";

import {
  Button,
  Modal,
  Spinner,
  Form,
  Row,
  Col,
  InputGroup,
  Alert
} from "react-bootstrap";
import { useDropzone } from "react-dropzone";

import "../../style.css";

const ModalPayment = ({
  stateModal,
  cancelModal,
  title,
  loading,
  formikPayment,
  validationPayment,
  allTypes,
  handlePreviewPhoto,
  alertPhoto,
  refreshDelete,
  photoPreview,
  photo,
  t,
  idMethod,
  allOutlets,
  handleSelectOutlet,
  state
}) => {
  const API_URL = process.env.REACT_APP_API_URL;
  console.log("state apaan nih", state)
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxSize: 2 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });
  const handleDelete = async () => {
    try {
      const reuslt = await axios.get(`${API_URL}/api/v1/payment-method/delete-qrcode/${idMethod}`)
      console.log("reuslt", reuslt)
      refreshDelete()
    } catch (error) {
      console.log(error)
    }
  }
  
  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValue = optionsOutlet.find(
    (item) => item.value === formikPayment.values.outlet_id
  );
  // const defaultValue = optionsOutlet.find(
  //   (val) => val.value === formikRecipe.values.outlet_id
  // );
  
  console.log("formikPayment.getFieldProps.outlet_id", formikPayment.values.outlet_id === 0)
  console.log("defaultValue", defaultValue)
  console.log("sebelum optionsOutlet", optionsOutlet)
  optionsOutlet.unshift({value: 1, label: 'All Outlets'})
  console.log("sesudah optionsOutlet", optionsOutlet)
  console.log("allOutlets", allOutlets)
  // console.log("defaultValue", defaultValue)

  return (
    <Modal show={stateModal} onHide={cancelModal} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikPayment.handleSubmit}>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("outlet")}:</Form.Label>
                {
                  state === "Edit" || formikPayment.values.outlet_id === 0 ? (
                    <Form.Control
                      as="select"
                      name="outlet_id"
                      {...formikPayment.getFieldProps("outlet_id")}
                      className={validationPayment("outlet_id")}
                      required
                    >
                      <option value="" disabled hidden>
                        {t("chooseAType")}
                      </option>
                      {optionsOutlet?.length
                        ? optionsOutlet.map((item) => {
                            return (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            );
                          })
                        : ""}
                    </Form.Control>
                  ) : (
                    <Select
                      options={optionsOutlet}
                      isMulti
                      name="outlet_id"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={(value) => handleSelectOutlet(value, formikPayment)}
                      // defaultValue={defaultValue}
                    />
                  )
                }
                {formikPayment.touched.outlet_id && formikPayment.errors.outlet_id ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPayment.errors.outlet_id}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("selectType")}:</Form.Label>
                <Form.Control
                  as="select"
                  name="payment_method_type_id"
                  {...formikPayment.getFieldProps("payment_method_type_id")}
                  className={validationPayment("payment_method_type_id")}
                  required
                >
                  <option value="" disabled hidden>
                    {t("chooseAType")}
                  </option>
                  {allTypes?.length
                    ? allTypes.map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })
                    : ""}
                </Form.Control>
                {formikPayment.touched.payment_method_type_id &&
                formikPayment.errors.payment_method_type_id ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPayment.errors.payment_method_type_id}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("name")}:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  {...formikPayment.getFieldProps("name")}
                  className={validationPayment("name")}
                  required
                />
                {formikPayment.touched.name && formikPayment.errors.name ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPayment.errors.name}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("mdr")}:</Form.Label>
                <InputGroup className="pb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text style={{ background: "transparent" }}>
                      %
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="number"
                    name="mdr"
                    placeholder="Enter MDR"
                    {...formikPayment.getFieldProps("mdr")}
                    className={validationPayment("mdr")}
                    required
                  />
                </InputGroup>
                {formikPayment.touched.mdr && formikPayment.errors.mdr ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPayment.errors.mdr}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("qrImage")}:</Form.Label>
                {alertPhoto ? <Alert variant="danger">{alertPhoto}</Alert> : ""}
                <div
                  {...getRootProps({
                    className: "boxDashed dropzone"
                  })}
                >
                  <input {...getInputProps()} />
                  {!photoPreview || photoPreview == null ? (
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
          </Row>
          {photo ? (
            <Row className="justify-content-md-center">
              <div className="btn btn-danger" onClick={handleDelete}>Delete QR Code</div>
            </Row>
          ) : null }
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

export default ModalPayment;
