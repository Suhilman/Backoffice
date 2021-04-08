import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import rupiahFormat from "rupiah-format";
import NumberFormat from 'react-number-format'

import { Paper } from "@material-ui/core";
import { Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";

export const DetailStockOpnamePage = ({ match }) => {
  const { stockId } = match.params;
  const [currency, setCurrency] = React.useState("")
  const handleCurrency = async () => {
      const API_URL = process.env.REACT_APP_API_URL;
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
  
      const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)
  
      console.log("currency nya brpw", data.data.Currency.name)
       
  
      if (data.data.Currency.name === 'Rp') {
        setCurrency("Rp.")
      } else if (data.data.Currency.name === '$') {
        setCurrency("$")
      } else {
        setCurrency("Rp.")
      }
    }
    React.useEffect(() => {
      handleCurrency()
    }, [])
  
  const [stockOpname, setOpnameStock] = React.useState("");

  const getStockOpname = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    // const filterCustomer = `?name=${search}&sort=${filter.time}`;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/stock-opname/${id}`);
      setOpnameStock(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getStockOpname(stockId);
  }, [stockId]);

  const columns = [
    {
      name: "Product Name",
      selector: "product_name",
      sortable: true
    },
    {
      name: "Quantity System",
      selector: "quantity_system",
      sortable: true
    },
    {
      name: "Quantity Actual",
      selector: "quantity_actual",
      sortable: true
    },
    {
      name: "Unit",
      selector: "unit",
      sortable: true
    },
    {
      name: "Difference",
      selector: "difference",
      sortable: true
    },
    {
      name: "Price System",
      selector: "price_system",
      sortable: true
    },
    {
      name: "Price New",
      selector: "price_new",
      sortable: true
    }
  ];

  const dataStock = stockOpname
    ? stockOpname.Stock_Opname_Products.map((item) => {
        return {
          product_name: item.Stock.Product ? item.Stock.Product.name : "-",
          quantity_system: item.quantity_system,
          quantity_actual: item.quantity_actual,
          unit: item.Unit?.name || "-",
          difference: item.difference,
          price_system: <NumberFormat value={item.price_system} displayType={'text'} thousandSeparator={true} prefix={currency} />,
          price_new: <NumberFormat value={item.price_new} displayType={'text'} thousandSeparator={true} prefix={currency} />
        };
      })
    : [];

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>Stock Opname Detail Summary</h3>
            </div>
            <div className="headerEnd">
              <Link
                to={{
                  pathname: "/inventory/stock-opname"
                }}
              >
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
                  value={stockOpname ? stockOpname.code : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Location:</Form.Label>
                <Form.Control
                  type="text"
                  value={stockOpname ? stockOpname.Outlet?.name : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Date:</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    stockOpname
                      ? dayjs(stockOpname.date).format("DD/MM/YYYY")
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
                  value={stockOpname?.notes || "-"}
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
  );
};
