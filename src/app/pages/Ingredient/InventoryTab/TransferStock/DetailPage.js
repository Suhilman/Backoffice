import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

import { Paper } from "@material-ui/core";
import { Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";

export const DetailTransferMaterialPage = ({ match }) => {
  const { materialId } = match.params;

  const [transferStock, setTransferStock] = React.useState("");

  const getTransferStock = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    // const filterCustomer = `?name=${search}&sort=${filter.time}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/transfer-stock/${id}`
      );
      setTransferStock(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getTransferStock(materialId);
  }, [materialId]);

  const columns = [
    {
      name: "Raw Material Name",
      selector: "material_name",
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
    }
  ];

  const dataStock = transferStock
    ? transferStock.Transfer_Stock_Products.map((item) => {
        return {
          material_name: item.Stock.Raw_Material.name,
          quantity: item.quantity,
          unit: item.Unit?.name || "-"
        };
      })
    : [];

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>Transfer Stock Detail Summary</h3>
            </div>
            <div className="headerEnd">
              <Link
                to={{
                  pathname: "/ingredient-inventory/transfer-stock"
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
                <Form.Label>Stock ID:</Form.Label>
                <Form.Control
                  type="text"
                  value={transferStock ? transferStock.code : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Origin:</Form.Label>
                <Form.Control
                  type="text"
                  value={transferStock ? transferStock.Origin.name : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Destination:</Form.Label>
                <Form.Control
                  type="text"
                  value={transferStock ? transferStock.Destination.name : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Date:</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    transferStock
                      ? dayjs(transferStock.date).format("DD/MM/YYYY")
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
                  value={transferStock?.notes || "-"}
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
