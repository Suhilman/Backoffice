import React, { useEffect, useState } from "react";

import { Button, Modal, Spinner, Form, Row, Col } from "react-bootstrap";

import "../../style.css";
import LogoBeetpos from '../../../../images/logo beetPOS small new.png' 
import html2canvas from 'html2canvas'
import axios from 'axios'
import QRCode from 'qrcode.react'
import LogoTextBeetpos from '../../../../images/logo putih.png'
// import { QRCode } from 'react-qrcode-logo';

import IconFacebook from '../../../../images/icons8-facebook-500.png'
import IconInstagram from '../../../../images/icons8-instagram-logo-500.png'
import IconTikTok from '../../../../images/icons8-tiktok-500.png'

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
  const businessId = formikTable.getFieldProps("business_id").value
  const tableId = formikTable.getFieldProps("id").value
  const data = `${process.env.REACT_APP_FRONTEND_URL}/get-data/${tableId}/${businessId}` 
  const [dataTemplateQr, setDataTemplateQr] = useState({})

  const getDataBusinessTable = async () => {
    try {
      if(editDataTable) {
        const dataBusiness = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/business/${editDataTable.business_id}`)
        console.log("dataBusiness data data", dataBusiness.data.data)
        const dataTable = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/table-management/${editDataTable.id}`)
        const phoneSplit = dataBusiness.data.data.phone_number.split("")
        if(phoneSplit[0] == 8) {
          phoneSplit.unshift(0)
        }
        phoneSplit.splice(4, 0, " ")
        phoneSplit.splice(9, 0, " ")

        dataTable.data.data.phone_number = phoneSplit.join("")
        console.log("dataTable.phone_number", dataTable.data.data.phone_number)
        setDataTemplateQr({
          logoBusiness: dataBusiness.data.data.image ? `${process.env.REACT_APP_API_URL}/${dataBusiness.data.data.image}` : null,
          businessName: dataBusiness.data.data.name,
          outletName: dataTable.data.data.Outlet.name,
          tableName: dataTable.data.data.name,
          phoneNumber: dataTable.data.data.phone_number
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const topFunction = async () => {
    const scrollToTopBtn = document.getElementById("kt_scrolltop");
    if (scrollToTopBtn) {
      scrollToTopBtn.click();
      return true
    }
  };

  React.useEffect(() => {
    getDataBusinessTable()
    console.log("editDataTable", editDataTable)
  }, [editDataTable])

  // const data = {
  //   "application": "beetpos",
  //   "outlet_id": formikTable.getFieldProps("outlet_id").value,
  //   "business_id": businessId,
  //   "table_id": tableId,
  //   "url_webview": `${process.env.REACT_APP_FRONTEND_URL}/get-data/${tableId}/${businessId}` 
  // }

  // const dataObj = JSON.stringify(data)
  const dataObj = data

  console.log(dataObj)

  const downloadQR = async () => {

    const scroll = await topFunction()
    if(scroll) {
      setTimeout(() => {
        html2canvas(document.getElementById("qrcodeTest"), { logging: true, letterRendering: 1, useCORS: true } ).then(canvas => {
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
        });
      }, 1200)
    }
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
            <Col className="wrapper-qrcode">
              <Form.Group>
                {formikTable.getFieldProps("name").value ? (
                  <div className="d-flex flex-column align-items-center">
                    <QRCode 
                      onClick={downloadQR}
                      id="qrcode"
                      value={dataObj}
                      level={"L"}
                      size={700}
                      includeMargin={true}
                    />
                    <p>{t("pleaseClickQrcodeForDownload")}</p>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>
          <Row>
          <div className="container-qr-outlet">
            <Row>
              <div 
                className="wrapper-qr-outlet" 
                onClick={downloadQR}
                id="qrcodeTest"
              >
                <div className="bg-qr-outlet">
                  <div className="top-lane-qr-outlet"> 
                    <div className="whatsapp-qr-outlet">
                      WA | {dataTemplateQr.phoneNumber}
                    </div>
                    <div className="wrapper-sosmed-qr-outlet d-flex">
                      <div className="sosmed-qr-outlet">
                        FB | IG | TikTok |
                      </div>
                      <div className="name-sosmed-qr-outlet ml-2">
                        drsusiantowvc
                      </div>
                    </div>
                  </div>
                  <div className="bottom-lane-qr-outlet"> 
                    <div className="powered-qr-outlet">
                      Powered <span className="pl-2"/>by <span className="wrapper-logo-powered-qr-outlet">
                        <img src={LogoTextBeetpos} alt="Logo Beetpos" />
                      </span>
                    </div>
                  </div>
                  
                  {dataTemplateQr.logoBusiness ? (
                    <div className="wrapper-content-qr-outlet d-flex justify-content-center">
                      <div className="wrapper-logo-qr-outlet">
                        <img src={dataTemplateQr.logoBusiness} alt="Logo Business" />
                        {/* <img src="https://beetpos.com/wp-content/uploads/apk/logo.png" alt="Logo Business" /> */}
                      </div>
                    </div>
                    ) : (
                    <div className="d-flex justify-content-end">
                      <div className="logo-business-qr-outlet-empty">
                        {/* <img src="https://dummyimage.com/600x400/ffffff/624863.jpg&text=Logo+Business" alt="Logo Business" /> */}
                      </div>
                    </div>
                    )
                  }
                  <div className="qr-outlet-center">
                    {dataTemplateQr.businessName?.length < 25 ? (
                      <div className="business-name-qr-outlet-min-25">{dataTemplateQr.businessName}</div>
                    ) : (
                      <div className="business-name-qr-outlet-plus-25">{dataTemplateQr.businessName}</div>
                    )}
                    {dataTemplateQr.outletName?.length < 25 ? (
                      <div className="outlet-name-qr-outlet-min-25">{dataTemplateQr.outletName}</div>
                    ) : (
                      <div className="outlet-name-qr-outlet-plus-25">{dataTemplateQr.outletName}</div>
                    )}
                    <QRCode 
                      value={dataObj} 
                      level={"H"}
                      includeMargin={true}
                      size={1100}
                    />
                    {dataTemplateQr.tableName?.length < 25 ? (
                      <div className="table-name-qr-outlet-min-25">{dataTemplateQr.tableName}</div>
                    ) : (
                      <div className="table-name-qr-outlet-plus-25">{dataTemplateQr.tableName}</div>
                    )}
                    <div className="desc-qr-outlet mt-3">
                      Scan to view Beet eMenu (non-Member)<br />or BeetCustomer (Member)
                    </div>
                      {/* <div className="wrapper-icon-sosmed-qr-outlet">
                        <div className="icon-facebook-qr-outlet">
                          <img src={IconFacebook} alt="Icon Facebook" />
                        </div>
                        <div className="icon-instagram-qr-outlet">
                          <img src={IconInstagram} alt="Icon Instagram" />
                        </div>
                        <div className="icon-tiktok-qr-outlet">
                          <img src={IconTikTok} alt="Icon TikTok" />
                        </div>
                      </div> */}
                  </div>
                </div>
              </div>
            </Row>
          </div>
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
