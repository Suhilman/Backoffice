import React from "react";

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
  photoPreview,
  photo,
  t
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxSize: 2 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });

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

export default ModalPayment;
