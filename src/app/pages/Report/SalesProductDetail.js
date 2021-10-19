import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import rupiahFormat from "rupiah-format";
import NumberFormat from 'react-number-format'
import "../style.css";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";

import {
  Paper
} from "@material-ui/core";
import { FeatureReport } from './components/FeatureReport'
import {
  Row,
  Col,
  ListGroup
} from "react-bootstrap";

export const SalesProductDetail = () => {
  const [refresh, setRefresh] = React.useState(0)
  const handleRefresh = () => setRefresh((state) => state + 1)

  const [selectedOutlet, setSelectedOutlet] = React.useState({
    id: "",
    name: "All Outlet"
  })
  const [startDate, setStartDate] = React.useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = React.useState(dayjs().format("YYYY-MM-DD"));
  const [endDateFilename, setEndDateFilename] = React.useState("");
  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date());
  const [tabData, setTabData] = React.useState({
    no: 9,
    table: "table-sales-per-product",
    filename: `laporan-penjualan-per-produk_${startDate}-${endDateFilename}`,
  })
  const [status, setStatus] = React.useState("");
  const { t } = useTranslation();
  const [salesPerProduct, setSalesPerProduct] = useState([]);
  const [salesDetailOriginal, setSalesDetailOriginal] = useState([])
  const [currency, setCurrency] = React.useState("")
  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)

    // console.log("currency nya brpw", data.data.Currency.name)
     

    setCurrency(data.data.Currency.name)
  }
  React.useEffect(() => {
    handleCurrency()
  }, [])

  const getDataSalesPerProduct = async (id, start_range, end_range) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const outlet_id = id ? `?outlet_id=${id}&` : "?";

    console.log("startDate", start_range)
    console.log("endDate", end_range)

    if (start_range === end_range) {
      end_range = dayjs(end_range)
        .add(1, "day")
        .format("YYYY-MM-DD");
    }

    if (new Date(start_range) > new Date(end_range)) {
      start_range = dayjs(start_range)
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      end_range = dayjs(end_range)
        .add(1, "day")
        .format("YYYY-MM-DD");
    }
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction/detail-sales${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      const resFinal = renderTable(data.data)
      console.log("resFinal", resFinal)
      setSalesDetailOriginal(data.data)
      setSalesPerProduct(renderTable(data.data));
    } catch (err) {
      if (err.response.status === 404) {
        setSalesPerProduct([]);
      }
    }
  };
  function sum(input) {
    if (toString.call(input) !== "[object Array]") return false;

    var total = 0;
    for (var i = 0; i < input.length; i++) {
      if (isNaN(input[i])) {
        continue;
      }
      total += Number(input[i]);
    }
    return total;
  }
  const renderTable = (array) => {
    let final = [];
    let seen = {};
    array = array.filter((entry) => {
      let previous;
      if (seen.hasOwnProperty(entry.product_name)) {
        previous = seen[entry.product_name];
        previous.quantity.push(entry.sold_quantity);
        return false;
      }

      if (!Array.isArray(entry.array)) {
        entry.product = [entry.product_name];
        entry.quantity = [entry.sold_quantity];
      }

      seen[entry.product] = entry;

      return true;
    });

    array.map((i) => {
      final.push({
        product_id: i.product_id,
        product: i.product_name,
        category: i.category,
        kuantitas: sum(i.quantity),
        total_sales:
          i.product_price * sum(i.quantity)
      });
    });
    return final;
  };
  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };
  useEffect(() => {
    getDataSalesPerProduct(selectedOutlet.id, startDate, endDate);
    setTabData({
      ...tabData,
      filename: `laporan-penjualan-per-produk_${startDate}-${endDateFilename}`
    })
  }, [selectedOutlet, startDate, endDate, endDateFilename]);
  
  const columns = [
    {
      name: "No.",
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: `${t("productName")}`,
      selector: "product_name",
      sortable: true
    },
    {
      name: `${t("category")}`,
      selector: "category",
      sortable: true
    },
    {
      name: `${t("soldQuantity")}`,
      selector: "sold_quantity",
      sortable: true
    },
    {
      name: `${t("totalSales")}`,
      selector: "total_sales",
      sortable: true
    }
  ];

  const dataTransactions = () => {
    return salesPerProduct.map((item, index) => {
      return {
        no: index + 1,
        product_id: item.product_id,
        product_name: item.product,
        category: item.category,
        sold_quantity: item.kuantitas,
        total_sales: item.total_sales,
      };
    });
  };

  const ExpandableComponent = ({ data }) => {
    console.log("data", data)
    console.log("salesDetailOriginal", salesDetailOriginal)
    const dataItems = salesDetailOriginal.filter(val => val.product_id === data.product_id)
    console.log("dataItems", dataItems)
    const head = ["Product", "Addons", "Quantity Addons", "Price Addons"];
    const body = dataItems.map((item, index) => {
      return [
        item.product_name,
        item.all_addons,
        item.addons_quantity,
        <NumberFormat value={item.total_price_addons} displayType={'text'} thousandSeparator={true} prefix={currency} />
      ];
    });

    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          <ListGroup.Item>
            <Row>
              {head.map((item, index) => {
                return (
                  <Col key={index} style={{ fontWeight: "700" }}>
                    {item}
                  </Col>
                );
              })}
            </Row>
          </ListGroup.Item>
          {body.map((item, index) => {
            return (
              <ListGroup.Item key={index}>
                <Row>
                  {item.map((val, valIndex) => {
                    return <Col key={valIndex}>{val}</Col>;
                  })}
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </>
    );
  };

  const handleStartDate = (date) => setStartDate(date)
  const handleEndDate = (date) => setEndDate(date)
  const handleEndDateFilename = (date) => setEndDateFilename(date)
  const handleSelectedOutlet = (outlet) => setSelectedOutlet(outlet)
  const handleSelectStatus = (status) => setStatus(status.target.value)
  const handleTimeStart = (time) => setStartTime(time)
  const handleTimeEnd = (time) => setEndTime(time)

  return (
    <>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <FeatureReport
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
              tabData={tabData}
              handleEndDateFilename={handleEndDateFilename}
              handleSelectedOutlet={handleSelectedOutlet}
              titleReport="reportDetailSalesPerProduct"
              handleSelectStatus={handleSelectStatus}
              handleTimeStart={handleTimeStart}
              handleTimeEnd={handleTimeEnd}
            />

            <div style={{ display: "none" }}>
              <table id="table-sales-per-product">
                <thead>
                  <tr>
                    <th>{t("productSalesReport")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                </tbody>
                <thead>
                  <tr>
                    <th>{t("outlet")}</th>
                    <td>
                      {selectedOutlet.id === " " ||
                      selectedOutlet.id === null ||
                      selectedOutlet.id === undefined
                        ? "Semua Outlet"
                        : selectedOutlet.name}
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                </tbody>
                <thead>
                  <tr>
                    <th>{t("date")}</th>
                    <td>{`${startDate} - ${endDateFilename}`}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                </tbody>
                <thead>
                  <tr>
                    <th>{t("productName")}</th>
                    <th>{t("category")}</th>
                    <th>{t("amountSold")}</th>
                    <th>{t("totalSales")}</th>
                  </tr>
                </thead>
                <tbody>
                  {salesPerProduct.length > 0 ? (
                    salesPerProduct.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{item.product}</td>
                          <td>{item.category}</td>
                          <td>{item.kuantitas}</td>
                          <td>{item.total_sales}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td>{t("dataNotFound")}</td>
                    </tr>
                  )}
                  <tr>
                    <th>{t("grandTotal")}</th>
                    <th></th>
                    <th>{sumReports(salesPerProduct, "kuantitas")} </th>
                    <th>{sumReports(salesPerProduct, "total_sales")} </th>
                  </tr>
                </tbody>
              </table>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataTransactions()}
              expandableRows
              expandableRowsComponent={<ExpandableComponent />}
              style={{ minHeight: "100%" }}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
