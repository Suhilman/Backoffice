import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

import { Paper } from "@material-ui/core";
import { Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";

export const DetailOutcomingMaterialPage = ({ match }) => {
  const { materialId } = match.params;

  const [outcomingStock, setOutcomingStock] = React.useState("");
  const { t } = useTranslation();

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
    getOutcomingStock(materialId);
  }, [materialId]);

  const columns = [
    {
      name: t('rawMaterialName'),
      selector: "material_name",
      sortable: true
    },
    {
      name: t('quantity'),
      selector: "quantity",
      sortable: true
    },
    {
      name: t('unit'),
      selector: "unit",
      sortable: true
    }
  ];

  const dataStock = outcomingStock
    ? outcomingStock.Outcoming_Stock_Products.map((item) => {
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
              <h3>{t('outcomingStockDetailSummary')}</h3>
            </div>
            <div className="headerEnd">
              <Link
                to={{
                  pathname: "/ingredient-inventory/outcoming-stock"
                }}
              >
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
                <Form.Label>{t('stockId')}:</Form.Label>
                <Form.Control
                  type="text"
                  value={outcomingStock ? outcomingStock.code : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>{t('location')}:</Form.Label>
                <Form.Control
                  type="text"
                  value={outcomingStock ? outcomingStock.Outlet?.name : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>{t('date')}:</Form.Label>
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
                <Form.Label>{t('notes')}:</Form.Label>
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
