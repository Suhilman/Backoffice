import React from "react";

import { Button, Modal, Spinner, Form, Row, Col, Alert } from "react-bootstrap";
import { IconButton, Paper } from "@material-ui/core";
import { Edit } from "@material-ui/icons";

import "../style.css";

const DevicesModal = ({
  stateModal,
  cancelModal,
  title,
  alert,
  loading,
  formikDevices,
  validationDevices,
  alertPhoto,
  // photoPreview,
  // photo,
  // handlePreviewPhoto,
  t
}) => {
  return (
    <Modal show={stateModal} onHide={cancelModal} size="lg">
      <Modal.Header>{title}</Modal.Header>
      <Form noValidate onSubmit={formikDevices.handleSubmit}>
        <Modal.Body>
          <Row style={{ padding: "1rem" }}>
            {alert ? <Alert variant="danger">{alert}</Alert> : ""}
            {alertPhoto ? <Alert variant="danger">{alertPhoto}</Alert> : ""}

            {/* <Col md={3}>
              <Paper
                elevation={2}
                style={{
                  width: "120px",
                  height: "120px",
                  overflow: "hidden",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: `url(${photoPreview || photo})`
                }}
              >
                <input
                  accept="image/jpeg,image/png"
                  style={{ display: "none" }}
                  id="icon-button-file"
                  type="file"
                  onChange={handlePreviewPhoto}
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
              </Paper>

              <p className="text-muted mt-1">
              {t("allowedFileTypes")}: .png, .jpg, .jpeg | {t("fileSizeLimit")}: 2MB
              </p>
            </Col> */}

            <Col >

            <div className="title">{t("Outlet")}</div>
              <Form.Control
                type="text"
                name="outlate_name"
                {...formikDevices.getFieldProps("outlet_name")}
                className={validationDevices("outlet_name")}
                required
              />
              {formikDevices.touched.outlet_name && formikDevices.errors.outlet_name ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikDevices.errors.outlet_name}
                  </div>
                </div>
              ) : null}

              <div className="title">{t("Devices Name")}</div>
              <Form.Control
                type="text"
                name="devices_name"
                {...formikDevices.getFieldProps("devices_name")}
                className={validationDevices("devices_name")}
                required
              />
              {formikDevices.touched.devices_name && formikDevices.errors.devices_name ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikDevices.errors.devices_name}
                  </div>
                </div>
              ) : null}

              <div className="title">{t("Beetpos Version")}</div>
              <Form.Control
                type="text"
                name="beetpos_version"
                {...formikDevices.getFieldProps("beetpos_version")}
                className={validationDevices("beetpos_version")}
                required
              />
              {formikDevices.touched.beetpos_version && formikDevices.errors.beetpos_version ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikDevices.errors.beetpos_version}
                  </div>
                </div>
              ) : null}
            
              <div className="title">{t("Devices Code")}</div>
              <Form.Control
                type="text"
                name="devices_code"
                {...formikDevices.getFieldProps("devices_code")}
                className={validationDevices("devices_code")}
                required
              />
              {formikDevices.touched.devices_code &&
              formikDevices.errors.devices_code ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikDevices.errors.devices_code}
                  </div>
                </div>
              ) : null}

              {/* <div className="title">{t("Description")}</div>
              <Form.Control
                type="text"
                name="address"
                {...formikDevices.getFieldProps("address")}
                className={validationDevices("address")}
                required
              />
              {formikDevices.touched.address &&
              formikDevices.errors.address ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikDevices.errors.address}
                  </div>
                </div>
              ) : null} */}
            </Col>
          </Row>

          <Row style={{ padding: "1rem" }}>
            <Col>
              <Form.Group>
                <Form.Label>{t("Description")}</Form.Label>
                <Form.Control
                  as="textarea"
                  name="Description"
                  {...formikDevices.getFieldProps("description")}
                  className={validationDevices("description")}
                />
              </Form.Group>
              {formikDevices.touched.description && formikDevices.errors.description ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikDevices.errors.description}
                  </div>
                </div>
              ) : null}
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
              `${t("save & Changes")}`
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DevicesModal;
