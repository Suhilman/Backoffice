import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

import { Paper } from "@material-ui/core";
import { Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";

export const DetailPurchaseOrderPage = ({ match }) => {
  const { orderId } = match.params;

  const [purchaseOrder, setPurchaseOrder] = React.useState("");

  const getPurchaseOrder = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/purchase-order/${id}`
      );
      setPurchaseOrder(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getPurchaseOrder(orderId);
  }, [orderId]);

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
      name: "Price",
      selector: "price",
      sortable: true
    },
    {
      name: "Total Price",
      selector: "total_price",
      sortable: true
    }
  ];

  const dataOrder = purchaseOrder
    ? purchaseOrder.Purchase_Order_Products.map((item, index) => {
        return {
          product_name: item.Product.name,
          quantity: item.quantity,
          price: item.price,
          total_price: item.total_price
        };
      })
    : [];

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>Purchase Order Detail Summary</h3>
            </div>
            <div className="headerEnd">
              <Link
                to={{
                  pathname: "/inventory"
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
            <Col sm={3}>
              <Form.Group>
                <Form.Label>P.O ID:</Form.Label>
                <Form.Control
                  type="text"
                  value={purchaseOrder ? purchaseOrder.code : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>P.O Number:</Form.Label>
                <Form.Control
                  type="text"
                  value={purchaseOrder ? purchaseOrder.po_number : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Location:</Form.Label>
                <Form.Control
                  type="text"
                  value={purchaseOrder ? purchaseOrder.Outlet.name : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Date:</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    purchaseOrder
                      ? dayjs(purchaseOrder.date).format("DD/MM/YYYY")
                      : "-"
                  }
                  disabled
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>Supplier:</Form.Label>
                <Form.Control
                  type="text"
                  value={purchaseOrder ? purchaseOrder.Supplier.name : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Notes:</Form.Label>
                <Form.Control
                  as="textarea"
                  name="notes"
                  value={purchaseOrder?.notes || "-"}
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
  );
};
