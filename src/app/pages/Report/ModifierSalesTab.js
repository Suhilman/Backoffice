import React from "react";
import axios from "axios";

import { Row, Col, Table, Dropdown, DropdownButton } from "react-bootstrap";

import { Paper } from "@material-ui/core";

import "../style.css";

import sum from "./helpers/sum";

export const ModifierSalesTab = ({ handleRefresh }) => {
  const [loading, setLoading] = React.useState(false);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const modifierSalesData = () => {
    const data = [
      {
        modifier: "Boba",
        sold: 20,
        refunded: 0,
        total: 500000
      },
      {
        modifier: "Sosis",
        sold: 12,
        refunded: 0,
        total: 500000
      },
      {
        modifier: "Bakso",
        sold: 30,
        refunded: 0,
        total: 1500000
      }
    ];

    const totalSold = sum(data, "sold");
    const totalRefunded = sum(data, "refunded");
    const totalAmount = sum(data, "total");

    data.push({
      modifier: "",
      sold: totalSold,
      refunded: totalRefunded,
      total: totalAmount
    });

    return data;
  };

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem" }}>
          <div
            className="headerPage lineBottom"
            style={{ marginBottom: "1rem" }}
          >
            <div className="headerStart">
              <h3 style={{ margin: "0" }}>Modifier Sales</h3>
            </div>
            <div className="headerEnd">
              <Row>
                <DropdownButton title="All Outlets">
                  <Dropdown.Item href="#/action-1">All Outlets</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Outlet 1</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Outlet 2</Dropdown.Item>
                </DropdownButton>

                <DropdownButton title="Exports" style={{ margin: "0 1rem" }}>
                  <Dropdown.Item href="#/action-1">PDF</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Excel</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">CSV</Dropdown.Item>
                </DropdownButton>
              </Row>
            </div>
          </div>

          <Table striped>
            <thead>
              <tr>
                <th></th>
                <th>Modifier</th>
                <th>Items Sold</th>
                <th>Items Refunded</th>
                <th>Total Collected</th>
              </tr>
            </thead>
            <tbody>
              {modifierSalesData().map((item, index) => {
                return (
                  <tr key={index}>
                    <td></td>
                    <td>{item.modifier}</td>
                    <td>{item.sold}</td>
                    <td>{item.refunded}</td>
                    <td>{item.total}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Paper>
      </Col>
    </Row>
  );
};
