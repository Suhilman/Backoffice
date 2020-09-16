import React from "react";
import axios from "axios";

import { Row, Col, Table, Dropdown, DropdownButton } from "react-bootstrap";

import { Paper } from "@material-ui/core";

import rupiahFormat from "rupiah-format";

import "../style.css";

export const PaymentMethodTab = ({ allOutlets }) => {
  const [loading, setLoading] = React.useState(false);

  const [allPaymentMethods, setAllPaymentMethods] = React.useState([]);
  const [outletId, setOutletId] = React.useState("");
  const [outletName, setOutletName] = React.useState("All Outlets");

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const getPaymentMethod = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    if (id) {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/transaction/payment-method?outlet_id=${id}`
        );
        setAllPaymentMethods(data.data);
      } catch (err) {
        if (err.response.status === 404) {
          setAllPaymentMethods([]);
        }
        console.log(err);
      }
    } else {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/transaction/payment-method`
        );
        setAllPaymentMethods(data.data);
      } catch (err) {
        if (err.response.status === 404) {
          setAllPaymentMethods([]);
        }
        console.log(err);
      }
    }
  };

  React.useEffect(() => {
    getPaymentMethod(outletId);
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

  const paymentMethodData = () => {
    const data = [];

    allPaymentMethods.forEach((item) => {
      const allPayments = item.Payments;
      let totalCollected = 0;

      allPayments.forEach((val) => {
        val.Transaction.Transaction_Items.forEach(
          (curr) => (totalCollected += curr.subtotal),
          0
        );
      });

      data.push({
        method: item.name,
        transaction: item.Payments.length,
        total: totalCollected
      });
    });

    const totalTransactions = data.reduce(
      (init, curr) => (init += curr.transaction),
      0
    );
    const totalAmount = data.reduce((init, curr) => (init += curr.total), 0);

    data.push({
      method: "",
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
              <h3 style={{ margin: "0" }}>Payment Method</h3>
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
                <th>Payment Method</th>
                <th>Number of Transaction</th>
                <th>Total Collected</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethodData().map((item, index) => {
                return (
                  <tr key={index}>
                    <td></td>
                    <td>{item.method}</td>
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
