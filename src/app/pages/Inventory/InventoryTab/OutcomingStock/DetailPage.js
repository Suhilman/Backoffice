import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import Pdf from "react-to-pdf";
import beetposLogo from '../../../../../images/396 PPI-06 1.png'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { Paper } from "@material-ui/core";
import { Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";

export const DetailOutcomingStockPage = ({ match }) => {
  dayjs.extend(localizedFormat)
  const { t } = useTranslation();
  const ref = React.createRef()
  const { stockId } = match.params;

  const [outcomingStock, setOutcomingStock] = React.useState("");
  const [dateTime, setDateTime] = React.useState("")

  const getOutcomingStock = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    // const filterCustomer = `?name=${search}&sort=${filter.time}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/outcoming-stock/${id}`
      );
      const dt = new Date();
      setDateTime(`${
        (dt.getMonth()+1).toString().padStart(2, '0')}-${
        dt.getDate().toString().padStart(2, '0')}-${
        dt.getFullYear().toString().padStart(4, '0')}_${
        dt.getHours().toString().padStart(2, '0')}-${
        dt.getMinutes().toString().padStart(2, '0')}-${
        dt.getSeconds().toString().padStart(2, '0')}`)
      setOutcomingStock(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getOutcomingStock(stockId);
  }, [stockId]);

  const columns = [
    {
      name: "Product Name",
      selector: "product_name",
      sortable: true
    },
    {
      name: "Quantity",
      selector: "quantity",
      sortable: true
    },
    {
      name: "Unit",
      selector: "unit",
      sortable: true
    },
    {
      name: "Expired Date",
      selector: "expired_date",
      sortable: true
    }
  ];

  const dataStock = outcomingStock
    ? outcomingStock.Outcoming_Stock_Products.map((item) => {
        return {
          product_name: item.Stock.Product ? item.Stock.Product.name : "-",
          quantity: item.quantity,
          unit: item.Unit?.name || "-",
          expired_date: item.Stock.expired_date
            ? dayjs(item.Stock.expired_date).format("DD-MMM-YYYY")
            : "-"
        };
      })
    : [];

  console.log("dataStock", dataStock)
  console.log("outcomingStock", outcomingStock)
  const options = {
    orientation: 'landscape'
  };
  const setFileName = () => {
    if(outcomingStock) {
      return `Outcoming-Stock_${outcomingStock.Business.name}_${outcomingStock.Outlet.name}_${dateTime}`
    }
  }
  const fileName = setFileName()

  return (
    <>
      <div className="style-pdf" style={{width: 1100, height: "fit-content", color: "black solid"}} ref={ref}>
        <div className="container">
          <div className="row justify-content-between mb-5">
            <div className="col-md-4">
              <h1 className="mb-4 font-bold">{t("outcomingStock")}</h1>
              <div className="d-flex justify-content-between report-date">
                <h4 className="font-bold">{t("reportDate")}</h4>
                <p className="font-bold">{dayjs(outcomingStock.date).format("LLLL")}</p>
              </div>
              <div className="d-flex justify-content-between stock-id">
                <h4 className="font-bold">{t("stockId")}</h4>
                <p className="font-bold">{outcomingStock.code}</p>
              </div>
              <div className="d-flex wrap-content-opname">
                <div className="content-opname-left">
                  <h4 class="font-bold">{outcomingStock.Outlet?.name}</h4>
                  <h4>-</h4>
                  <h4>{outcomingStock.Outlet?.phone_number}</h4>
                </div>
                <div className="bulkhead"></div>
                <div className="content-opname-left">
                  <h4>{t("notes")}</h4>
                  <p className="text-mute">{outcomingStock.notes}</p>
                </div>
              </div>
            </div>
            <div className="col-md-8 d-flex flex-column align-items-end">
              <div className="logo-wrapper">
                <img src={beetposLogo} alt="Logo BeetPOS"/>
              </div>
              <h5 className="text-mute">PT Lifetech Tanpa Batas</h5>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-12">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">{t("products")}</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">{t("quantity")}</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">{t("unit")}</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">{t("expiredDate")}</th>
                  </tr>
                </thead>
                <tbody>
                  {dataStock ? (
                    dataStock.map(item => 
                      <tr>
                        <td>{item.product_name}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{item.quantity}</td>
                        <td></td>
                        <td></td>
                        <td>{item.unit}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{item.expired_date}</td>
                    </tr>
                    )
                  ) : null }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>Outcoming Stock Detail Summary</h3>
              </div>
              <div className="headerEnd">
                <Link
                  to={{
                    pathname: "/inventory/outcoming-stock"
                  }}
                >
                <Pdf targetRef={ref} filename={fileName} options={options} scale={1}>
                  {({ toPdf }) => <Button variant="btn btn-outline-primary mr-2" onClick={toPdf}>Export to PDF</Button>}
                </Pdf>
                  <Button variant="outline-secondary">Back</Button>
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
                  <Form.Label>Stock ID:</Form.Label>
                  <Form.Control
                    type="text"
                    value={outcomingStock ? outcomingStock.code : "-"}
                    disabled
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Location:</Form.Label>
                  <Form.Control
                    type="text"
                    value={outcomingStock ? outcomingStock.Outlet?.name : "-"}
                    disabled
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Date:</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      outcomingStock
                        ? dayjs(outcomingStock.date).format("DD/MM/YYYY")
                        : "-"
                    }
                    disabled
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>Notes:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    value={outcomingStock?.notes || "-"}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataStock}
              style={{ minHeight: "100%" }}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
