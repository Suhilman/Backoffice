import React, { useEffect, useState } from "react";

import { Button, Modal, Spinner, Form, Row, Col } from "react-bootstrap";

import html2canvas from 'html2canvas'
import axios from 'axios'
import "../../style.css";
import LogoBeetpos from '../../../../images/logo beetPOS small new.png' 

import LogoTextBeetpos from '../../../../images/logo beetPOS new.png'

import QRCode from 'qrcode.react'

// import { QRCode } from 'react-qrcode-logo';

const ModalPayment = ({
  stateModal,
  cancelModal,
  title,
  loading,
  formikTable,
  validationTable,
  allOutlets,
  t,
  editDataTable
}) => {
  const [imageUrl, setImageUrl] = useState({})
  const [dataTemplateQr, setDataTemplateQr] = useState({})
  const businessId = formikTable.getFieldProps("business_id").value
  const tableId = formikTable.getFieldProps("id").value
  const data = `${process.env.REACT_APP_FRONTEND_URL}/get-data/${tableId}/${businessId}`
  const dataObj = JSON.stringify(data)
  console.log("data business", businessId)
  console.log("data table management", tableId)

  console.log("formikTable.values.business_id", formikTable.values.business_id)

  const getDataBusinessTable = async () => {
    try {
      if(editDataTable) {
        const dataBusiness = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/business/${editDataTable.business_id}`)
        const dataTable = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/table-management/${editDataTable.id}`)
        setDataTemplateQr({
          logoBusiness: dataBusiness.data.data.image ? `${process.env.REACT_APP_API_URL}/${dataBusiness.data.data.image}` : null,
          businessName: dataBusiness.data.data.name,
          outletName: dataTable.data.data.Outlet.name,
          tableName: dataTable.data.data.name
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    getDataBusinessTable()
    console.log("editDataTable", editDataTable)
  }, [editDataTable])

  const downloadQR = () => {
    console.log("download")
    const canvas = document.getElementById("qrcode");
    console.log("qrcode", canvas)
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

  const downloadTest = async () => {
    console.log("download")
    const canvas = await html2canvas(document.getElementById("qrcodeTest"))
    console.log("qrcodeTest", canvas)
    const pngUrl = canvas
      .toDataURL("image/jpeg", 1.0)
    console.log("pngUrl", pngUrl)
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qrcode-outlet-beetpos.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // const downloadTest = async () => {
  //   console.log("download")
  //   const canvas = await html2canvas(document.getElementById("qrcodeTest"))
  //   console.log("qrcodeTest", canvas)
  //   const pngUrl = canvas
  //     .toDataURL("image/jpeg", 1.0)
  //   console.log("pngUrl", pngUrl)
  //   let downloadLink = document.createElement("a");
  //   downloadLink.href = pngUrl;
  //   downloadLink.download = "qrcode-outlet-beetpos.png";
  //   document.body.appendChild(downloadLink);
  //   downloadLink.click();
  //   document.body.removeChild(downloadLink);
  // };

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
            <Col className="wrapper-qrcode">
              <Form.Group>
                {formikTable.getFieldProps("name").value ? (
                  <div className="d-flex flex-column align-items-center">
                    <QRCode 
                      onClick={downloadTest}
                      id="qrcode"
                      value={dataObj} 
                      // ecLevel={"L"}
                      level={"L"}
                      // logoImage={LogoBeetpos}
                      // logoWidth={50}
                      // logoHeigth={60}
                      includeMargin={true}
                    />
                    <p>{t("pleaseClickQrcodeForDownload")}</p>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>
          <div className="container-qr-outlet">
            <Row>
              <div 
                className="wrapper-qr-outlet" 
                onClick={downloadTest}
                id="qrcodeTest"
              >
                <div className="bg-qr-outlet">
                  <div className="top-lane-qr-outlet" />
                  <div className="bottom-lane-qr-outlet" />
                  
                  {/* {dataTemplateQr.logoBusiness ? (
                    <div className="d-flex justify-content-end">
                      <div className="wrapper-logo-qr-outlet">
                        <img src={dataTemplateQr.logoBusiness} alt="Logo Business" />
                      </div>
                    </div>
                    ) : (
                      <div className="logo-business-qr-outlet">
                        [Logo Business]
                      </div>
                    )
                  } */}
                  <div className="qr-outlet-center">
                    <div className="business-name-qr-outle">{dataTemplateQr.businessName}</div>
                    <div className="outlet-name-qr-outlet">{dataTemplateQr.outletName}</div>
                    <QRCode 
                      value={dataObj} 
                      level={"L"}
                      includeMargin={true}
                    />
                    <div className="table-name-qr-outlet">{dataTemplateQr.tableName}</div>
                    <div className="desc-qr-outlet">
                      Scan to view Beet EMenu (non-member)<br />or BeetCustomer (Member)
                    </div>
                    <div className="powered-qr-outlet">
                      Powered <span className="pl-1"/>by <span className="wrapper-logo-powered-qr-outlet">
                        <img src={LogoTextBeetpos} alt="Logo Beetpos" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Row>
          </div>
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
