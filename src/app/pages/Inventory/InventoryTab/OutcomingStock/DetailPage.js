import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

import { Paper } from "@material-ui/core";
import { Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";

export const DetailOutcomingStockPage = ({ match }) => {
  const { stockId } = match.params;

  const [outcomingStock, setOutcomingStock] = React.useState("");

  const getOutcomingStock = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    // const filterCustomer = `?name=${search}&sort=${filter.time}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/outcoming-stock/${id}`
      );
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
    }
  ];

  const dataStock = outcomingStock
    ? outcomingStock.Outcoming_Stock_Products.map((item) => {
        return {
          product_name: item.Product.name,
          quantity: item.quantity
        };
      })
    : [];

  return (
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
                <Button variant="outline-secondary">Back</Button>
              </Link>

              <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                Download
              </Button>
            </div>
          </div>

          <Row
            style={{ padding: "1rem", marginBottom: "1rem" }}
            className="lineBottom"
          >
            <Col sm={3} style={{ padding: "1rem" }}>
              <div style={{ fontSize: "1.2rem" }}>
                <b>Stock ID: </b>
                {outcomingStock ? outcomingStock.code : "-"}
              </div>
              <div style={{ fontSize: "1.2rem" }}>
                <b>Location: </b>
                {outcomingStock ? outcomingStock.Outlet.name : "-"}
              </div>
              <div style={{ fontSize: "1.2rem" }}>
                <b>Date: </b>
                {outcomingStock
                  ? dayjs(outcomingStock.date).format("DD/MM/YYYY")
                  : "-"}
              </div>
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
  );
};
