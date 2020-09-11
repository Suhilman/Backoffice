import React from "react";
import axios from "axios";

import { Row, Col, Table, Dropdown, DropdownButton } from "react-bootstrap";

import { Paper } from "@material-ui/core";

import "../style.css";

export const SalesSummaryTab = ({ handleRefresh }) => {
  const [loading, setLoading] = React.useState(false);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const summaryData = () => {
    const data = [
      {
        key: "Gross Sales",
        value: 3500000
      },
      {
        key: "(Discount)",
        value: -500000
      },
      {
        key: "(Void)",
        value: 0
      },
      {
        key: "Nett Sales",
        value: 3000000
      },
      {
        key: "(Gratuity)",
        value: 0
      },
      {
        key: "(Tax)",
        value: 0
      },
      {
        key: "(Rounding)",
        value: 0
      },
      {
        key: "Total Collected",
        value: 3000000
      }
    ];

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
              <h3 style={{ margin: "0" }}>Sales Summary</h3>
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
            <tbody>
              {summaryData().map((item, index) => {
                return (
                  <tr key={index}>
                    <td></td>
                    <td>{item.key}</td>
                    <td>{item.value}</td>
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
