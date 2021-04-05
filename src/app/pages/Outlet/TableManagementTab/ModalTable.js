import React, { useEffect, useState } from "react";

import { Button, Modal, Spinner, Form, Row, Col } from "react-bootstrap";

import "../../style.css";

import QRCode from 'qrcode.react'

const ModalPayment = ({
  stateModal,
  cancelModal,
  title,
  loading,
  formikTable,
  validationTable,
  allOutlets,
  t
}) => {
  const [imageUrl, setImageUrl] = useState({})
  const data = {
    "application": "beetpos",
    "outlet_id": formikTable.getFieldProps("outlet_id").value,
    "business_id": formikTable.getFieldProps("business_id").value,
    "table_id": formikTable.getFieldProps("id").value
  }
  const dataObj = JSON.stringify(data)
  console.log(dataObj)

  const downloadQR = () => {
    const canvas = document.getElementById("qrcode");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qrcode-outlet-beetpos.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Modal show={stateModal} onHide={cancelModal} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikTable.handleSubmit}>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("selectOutlet")}:</Form.Label>
                <Form.Control
                  as="select"
                  name="outlet_id"
                  {...formikTable.getFieldProps("outlet_id")}
                  className={validationTable("outlet_id")}
                  required
                >
                  <option value="" disabled hidden>
                    {t("chooseAnOutlet")}
                  </option>
                  {allOutlets?.length
                    ? allOutlets.map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })
                    : ""}
                </Form.Control>
                {formikTable.touched.outlet_id &&
                formikTable.errors.outlet_id ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikTable.errors.outlet_id}
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
                  {...formikTable.getFieldProps("name")}
                  className={validationTable("name")}
                  required
                />
                {formikTable.touched.name && formikTable.errors.name ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikTable.errors.name}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("capacity")}:</Form.Label>
                <Form.Control
                  type="number"
                  name="capacity"
                  placeholder="Enter Capacity"
                  {...formikTable.getFieldProps("capacity")}
                  className={validationTable("capacity")}
                  required
                />
                {formikTable.touched.capacity && formikTable.errors.capacity ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikTable.errors.capacity}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md="auto">
              <Form.Group>
                {formikTable.getFieldProps("name").value ? (
                  <div className="">
                    <QRCode 
                      id="qrcode"
                      value={dataObj} 
                      level={"L"}
                      includeMargin={true}
                      onClick={downloadQR}
                    />
                    <p>{t("pleaseClickQrcodeForDownload")}</p>
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

export default ModalPayment;
