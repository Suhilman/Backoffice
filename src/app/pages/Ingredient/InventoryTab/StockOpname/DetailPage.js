import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

import { Paper } from "@material-ui/core";
import { Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";

export const DetailOpnameMaterialPage = ({ match }) => {
  const { materialId } = match.params;

  const [stockOpname, setStockOpname] = React.useState("");

  const getStockOpname = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    // const filterCustomer = `?name=${search}&sort=${filter.time}`;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/stock-opname/${id}`);
      setStockOpname(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getStockOpname(materialId);
  }, [materialId]);

  const columns = [
    {
      name: "Raw Material Name",
      selector: "material_name",
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
    }
  ];

  const dataStock = stockOpname
    ? stockOpname.Stock_Opname_Products.map((item) => {
        return {
          material_name: item.Raw_Material.name,
          quantity_system: item.quantity_system,
          quantity_actual: item.quantity_actual,
          unit: item.Unit.name,
          difference: item.difference
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
                  pathname: "/ingredient-inventory/stock-opname"
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
                  value={stockOpname ? stockOpname.code : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Location:</Form.Label>
                <Form.Control
                  type="text"
                  value={stockOpname ? stockOpname.Outlet.name : "-"}
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
