import React from "react";
import axios from "axios";

import { Row, Col, Table, Dropdown, DropdownButton } from "react-bootstrap";

import { Paper } from "@material-ui/core";

import "../style.css";

import rupiahFormat from "rupiah-format";

export const SalesTypeTab = ({ allOutlets }) => {
  const [loading, setLoading] = React.useState(false);

  const [allSalesTypes, setAllSalesTypes] = React.useState([]);
  const [allTypes, setAllTypes] = React.useState([]);
  const [outletId, setOutletId] = React.useState("");
  const [outletName, setOutletName] = React.useState("All Outlets");

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const getTypes = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/sales-type`);
      const types = data.data.map((item) => item.name);
      setAllTypes(types);
    } catch (err) {
      if (err.response.status === 404) {
        setAllTypes([]);
      }
      console.log(err);
    }
  };

  const getSalesType = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    if (id) {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/transaction/sales-type?outlet_id=${id}`
        );
        setAllSalesTypes(data.data);
      } catch (err) {
        if (err.response.status === 404) {
          setAllSalesTypes([]);
        }
        console.log(err);
      }
    } else {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/transaction/sales-type`
        );
        setAllSalesTypes(data.data);
      } catch (err) {
        if (err.response.status === 404) {
          setAllSalesTypes([]);
        }
        console.log(err);
      }
    }
  };

  React.useEffect(() => {
    getTypes();
  }, []);

  React.useEffect(() => {
    getSalesType(outletId);
  }, [outletId]);

  const handleSelectOutlet = (data) => {
    if (data) {
      setOutletId(data.id);
      setOutletName(data.name);
    } else {
      setOutletId("");
      setOutletName("All Outlets");
    }
  };

  const salesTypeData = () => {
    const data = [];

    for (const type of allTypes) {
      allSalesTypes.forEach((item) => {
        const allTransactions = item.Transactions;
        let totalCollected = 0;

        allTransactions.forEach((val) => {
          val.Transaction_Items.forEach(
            (curr) => (totalCollected += curr.subtotal),
            0
          );
        });

        if (type === item.name) {
          data.push({
            type,
            transaction: allTransactions.length,
            total: totalCollected
          });
        } else {
          data.push({
            type,
            transaction: 0,
            total: 0
          });
        }
      });
    }

    const totalTransactions = data.reduce(
      (init, curr) => (init += curr.transaction),
      0
    );
    const totalAmount = data.reduce((init, curr) => (init += curr.total), 0);

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
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div
            className="headerPage lineBottom"
            style={{ marginBottom: "1rem" }}
          >
            <div className="headerStart">
              <h3 style={{ margin: "0" }}>Sales Type</h3>
            </div>
            <div className="headerEnd">
              <Row>
                <DropdownButton title={outletName}>
                  <Dropdown.Item onClick={() => handleSelectOutlet()}>
                    All Outlets
                  </Dropdown.Item>
                  {allOutlets.map((item, index) => {
                    return (
                      <Dropdown.Item
                        key={index}
                        onClick={() => handleSelectOutlet(item)}
                      >
                        {item.name}
                      </Dropdown.Item>
                    );
                  })}
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
                    <td>{rupiahFormat.convert(item.total)}</td>
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
