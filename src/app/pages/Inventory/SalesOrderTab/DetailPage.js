import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ExportExcel from "react-html-table-to-excel";

import dayjs from "dayjs";
import { jsPDF } from "jspdf"
import Pdf from "react-to-pdf";
import beetposLogo from '../../../../images/logo beetPOS new.png'
import NumberFormat from 'react-number-format'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { Paper } from "@material-ui/core";
import { Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";

export const DetailSalesOrderPage = ({ match }) => {
  const { orderId } = match.params;
  const { t } = useTranslation();

  const ref = React.createRef()

  dayjs.extend(localizedFormat)

  const [SalesOrder, setSalesOrder] = React.useState("");
  const [dateTime, setDateTime] = React.useState("")
  const [dataToPdf, setDataToPdf] = React.useState({})
  const [currency, setCurrency] = React.useState("")

  const getPurchaseOrder = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const data = await axios.get(
        `${API_URL}/api/v1/sales-order/${id}`
      );
      console.log("data sales order", data.data)
      if (data.request.status === 200) {
        const resultCustomer = await axios.get(
          `${API_URL}/api/v1/customer/${data.data.data.customer_id}`
        )
        const resultBusiness = await axios.get(
          `${API_URL}/api/v1/business/${data.data.data.business_id}`
        )
        if (resultBusiness.request.status === 200) {
          const resultOwner = await axios.get(
            `${API_URL}/api/v1/owner/${resultBusiness.data.data.owner_id}`
          )
          const allData = {
            dataPembelian: data.data.data.date,
            // orderPurchase: data.data.data.Sales_Order_Products,
            // hargaUnit: data.data.data.Sales_Order_Products[0].price,
            // kuantitas: data.data.data.Sales_Order_Products[0].quantity,
            // produk: data.data.data.Sales_Order_Products[0].Product.name,
            namaCustomer: resultCustomer.data.data.name,
            alamatCustomer: resultCustomer.data.data.address,
            nomorTeleponCustomer: resultCustomer.data.data.phone_number,
            emailCustomer: resultCustomer.data.data.email,
            namaBusiness: resultBusiness.data.data.name,
            alamatBusiness: `${resultBusiness.data.data.Location.name}, ${resultBusiness.data.data.Location.City.name} ${resultBusiness.data.data.Location.City.Province.name}`,
            emailBusiness: resultOwner.data.data.email
          }
          setDataToPdf(allData)
          setSalesOrder(data.data.data)
          const dt = new Date();
          setDateTime(`${
            (dt.getMonth()+1).toString().padStart(2, '0')}-${
            dt.getDate().toString().padStart(2, '0')}-${
            dt.getFullYear().toString().padStart(4, '0')}_${
            dt.getHours().toString().padStart(2, '0')}-${
            dt.getMinutes().toString().padStart(2, '0')}-${
            dt.getSeconds().toString().padStart(2, '0')}`)
        }
      } else {
        console.log('something went wrong')
      }
    } catch (err) {
      console.log("error sales order", err);
    }
  };
  // console.log('ini semua data', SalesOrder.Sales_Order_Products)

  React.useEffect(() => {
    getPurchaseOrder(orderId);
  }, [orderId]);
  const handleCurrency = () => {
    if (localStorage.getItem("prefix") === 'Rp') {
      setCurrency("Rp.")
    } else if (localStorage.getItem("prefix") === '$') {
      setCurrency("$")
    } else {
      setCurrency("Rp.")
    }
  }

  React.useEffect(() => {
    handleCurrency()
  }, [])
  const columns = [
    {
      name: `${t("productName")}`,
      selector: "product_name",
      sortable: true
    },
    {
      name: `${t("quantity")}`,
      selector: "quantity",
      sortable: true
    },
    {
      name: `${t("price")}`,
      selector: "price",
      sortable: true
    },
    {
      name: `${t("priceTotal")}`,
      selector: "total_price",
      sortable: true
    }
  ];

  const handleExportPdf = () => {
    // console.log('hello pdf')
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "in",
    });
    
    doc.text("Purchase Order", 1, 1);
    doc.text("lagi lagi", 1, 1.2);
    doc.text("lagi lagi lagi", 1, 1.4);    
    doc.save("two-by-four.pdf");
  }

  const options = {
    orientation: 'landscape'
  };
  console.log("SalesOrder", SalesOrder)
  const setFileName = () => {
    if(SalesOrder) {
      return `Purchase-Order_${dataToPdf.namaBusiness}_${SalesOrder.Outlet.name}_${dateTime}`
    }
  }
  const fileName = setFileName()
  console.log("fileName", fileName)

  const dataOrder = SalesOrder
    ? SalesOrder.Sales_Order_Products.map((item, index) => {
        return {
          product_name: item.Product.name,
          quantity: item.quantity,
          price: item.price,
          total_price: item.total_price
        };
      })
    : [];
  return (
    <>
      <div className="style-pdf" style={{width: 1100, height: "fit-content", color: "black solid"}} ref={ref}>
          <div className="container">
            <div className="row justify-content-between mb-5">
              <div className="col-md-6">
                <h1 className="mb-3">{t("SalesOrder")}</h1>
                <div className="d-flex justify-content-between">
                  <h4>{t("purchaseDate")}</h4>
                  <p className="text-mute">{dayjs(dataToPdf.dataPembelian).format("LLLL")}</p>
                </div>
                <h4>{t("priceTotal")}</h4>
                <h2><NumberFormat value={dataToPdf.tagihan} displayType={'text'} thousandSeparator={true} prefix={currency} /></h2>
              </div>
              <div className="col-md-6 d-flex flex-column align-items-end">
                <div className="logo-wrapper">
                  <img src={beetposLogo} alt="Logo BeetPOS"/>
                </div>
                <h5 className="text-mute">PT Lifetech Tanpa Batas</h5>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-4">
                <h4 className="font-weight-bold">{t("to")}</h4>
                <h6>{dataToPdf.namaCustomer}</h6>
                <h6>{dataToPdf.alamatCustomer}</h6>
                <h6>{dataToPdf.nomorTelephoneCustomer}</h6>
                <h6>{dataToPdf.emailCustomer}</h6>
              </div>
              <div className="col-md-8">
                <h4 className="font-weight-bold">{t("buyer")}</h4>
                <h6>{dataToPdf.namaBusiness}</h6>
                <h6>{dataToPdf.alamatBusiness}</h6>
                <h6>{dataToPdf.emailBusiness}</h6>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-12">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">{t("products")}</th>
                      <th scope="col">{t("quantity")}</th>
                      <th scope="col">{t("price")} {currency}</th>
                      <th scope="col">{t("priceTotal")} {currency}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SalesOrder ? 
                      SalesOrder.Sales_Order_Products.map((item) => 
                        <tr>
                          <td>{item.Product.name}</td>
                          <td>{item.quantity}</td>
                          <td><NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
                          <td><NumberFormat value={item.total_price} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
                        </tr> 
                        )
                    : ""}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row align-items-end flex-column mr-3">
              <div className="d-flex">
                <p className="text-mute mr-5">{t("priceSubtotal")}</p>
                <p className="text-mute ml-5"><NumberFormat value={dataToPdf.tagihan} displayType={'text'} thousandSeparator={true} prefix={currency} /></p>
              </div>
              <div className="d-flex">
                <h4 className="mr-5">{t("totalBill")}</h4>
                <h4 className="text-mute ml-5"><NumberFormat value={dataToPdf.tagihan} displayType={'text'} thousandSeparator={true} prefix={currency} /></h4>
              </div>
            </div>
          </div>
        </div>
      <Row className="modal-detail">
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("SalesOrderDetailSummary")}</h3>
              </div>
              <div className="headerEnd">
                <Link
                  to={{
                    pathname: "/inventory"
                  }}
                >
                  <ExportExcel
                    id="test-table-xls-button"
                    className="btn btn-outline-info mx-2"
                    table="table-to-xls"
                    filename={fileName}
                    sheet="tablexls"
                    buttonText={t("exportToExcel")}
                  />
                  <div style={{ display: "none" }}>
                    <table id="table-to-xls">
                      <tr>
                        <th>{t("exportPurchaseOrderResult")}</th>
                      </tr>
                      <tr>
                        <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("products")}</th>
                        <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("quantity")}</th>
                        <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("price")} {currency}</th>
                        <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("priceTotal")} {currency}</th>
                      </tr>
                      {SalesOrder ? (
                      SalesOrder.Sales_Order_Products.map(item => 
                        <tr>
                          <td>{item.Product.name}</td>
                          <td>{item.quantity}</td>
                          <td><NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
                          <td><NumberFormat value={item.total_price} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
                        </tr>
                      )
                    ) : null }
                    </table>
                  </div>
                  <Pdf targetRef={ref} filename={fileName} options={options} scale={1}>
                    {({ toPdf }) => <Button variant="btn btn-outline-primary mr-2" onClick={toPdf}>{t('exportToPdf')}</Button>}
                  </Pdf>
                  {/* <Button variant="btn btn-outline-primary mr-2" onClick={handleExportPdf}>Export</Button> */}
                  <Button variant="outline-secondary">{t('back')}</Button>
                </Link>

                {/* <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                  Download
                </Button> */}
              </div>
            </div>

            <Row
              style={{ padding: "1rem", marginBottom: "1rem" }}
              className="lineBottom"
            >
              <Col sm={3}>
                <Form.Group>
                  <Form.Label>S.O ID:</Form.Label>
                  <Form.Control
                    type="text"
                    value={SalesOrder ? SalesOrder.code : "-"}
                    disabled
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>{t("poNumber")}:</Form.Label>
                  <Form.Control
                    type="text"
                    value={SalesOrder ? SalesOrder.so_number : "-"}
                    disabled
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>{t("location")}:</Form.Label>
                  <Form.Control
                    type="text"
                    value={SalesOrder ? SalesOrder.Outlet?.name : "-"}
                    disabled
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>{t("date")}:</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      SalesOrder
                        ? dayjs(SalesOrder.date).format("DD/MM/YYYY")
                        : "-"
                    }
                    disabled
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>{t("supplier")}:</Form.Label>
                  <Form.Control
                    type="text"
                    value={SalesOrder ? SalesOrder.Customer.name : "-"}
                    disabled
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>{t("notes")}:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    value={SalesOrder?.notes || "-"}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataOrder}
              style={{ minHeight: "100%" }}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
