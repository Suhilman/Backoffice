import React from "react";
import axios from "axios";

import { Row, Col, Table, Dropdown, DropdownButton } from "react-bootstrap";

import { Paper } from "@material-ui/core";

import "../style.css";

import sum from "./helpers/sum";

export const SalesTypeTab = ({ handleRefresh }) => {
  const [loading, setLoading] = React.useState(false);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const salesTypeData = () => {
    const data = [
      {
        type: "Dine-In",
        transaction: 10,
        total: 50000
      },
      {
        type: "Take-Away",
        transaction: 8,
        total: 20000
      }
    ];

    const totalTransactions = sum(data, "transaction");
    const totalAmount = sum(data, "total");

    data.push({
      type: "",
      transaction: totalTransactions,
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
              <h3 style={{ margin: "0" }}>Payment Method</h3>
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
                <th>Type</th>
                <th>Number of Transaction</th>
                <th>Total Collected</th>
              </tr>
            </thead>
            <tbody>
              {salesTypeData().map((item, index) => {
                return (
                  <tr key={index}>
                    <td></td>
                    <td>{item.type}</td>
                    <td>{item.transaction}</td>
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
