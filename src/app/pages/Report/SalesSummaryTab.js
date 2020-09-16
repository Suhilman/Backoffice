import React from "react";
import axios from "axios";

import { Row, Col, Table, Dropdown, DropdownButton } from "react-bootstrap";

import { Paper } from "@material-ui/core";

import { sum } from "lodash";
import rupiahFormat from "rupiah-format";

import "../style.css";

export const SalesSummaryTab = ({ allOutlets }) => {
  const [loading, setLoading] = React.useState(false);

  const [allTransactions, setAllTransactions] = React.useState([]);
  const [outletId, setOutletId] = React.useState("");
  const [outletName, setOutletName] = React.useState("All Outlets");

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const getTransactions = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    if (id) {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/transaction?outlet_id=${id}`
        );
        setAllTransactions(data.data);
      } catch (err) {
        if (err.response.status === 404) {
          setAllTransactions([]);
        }
        console.log(err);
      }
    } else {
      try {
        const { data } = await axios.get(`${API_URL}/api/v1/transaction`);
        setAllTransactions(data.data);
      } catch (err) {
        if (err.response.status === 404) {
          setAllTransactions([]);
        }
        console.log(err);
      }
    }
  };

  React.useEffect(() => {
    getTransactions(outletId);
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

  const summaryData = () => {
    const data = [
      {
        key: "(Income)",
        value: 0
      },
      {
        key: "(HPP)",
        value: 0
      },
      {
        key: "Gross Sales",
        value: 0
      },
      {
        key: "(Discount)",
        value: 0
      },
      {
        key: "(Void)",
        value: 0
      },
      {
        key: "Nett Sales",
        value: 0
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
        value: 0
      }
    ];

    // const hpp = allTransactions.reduce((init, curr) => {
    //   curr.Transaction_Items.forEach((val) => {
    //     init += val.product_price * val.quantity;
    //   });

    //   return init;
    // }, 0);

    const hpp = 0;

    const income = sum(
      allTransactions.map((item) => {
        return item.Transaction_Items.reduce(
          (init, curr) => (init += curr.subtotal),
          0
        );
      })
    );

    // income sales
    const incomeSales = income;
    data[0].value = incomeSales;

    // hpp sales
    const hppSales = hpp;
    data[1].value = hppSales;

    // gross sales
    const grossSales = income - hpp;
    data[2].value = grossSales;

    // discount
    const discount = allTransactions.reduce(
      (init, curr) => (init += curr.promo_amount || 0),
      0
    );
    data[3].value = discount;

    // refund / void
    const voidSales = 0;
    data[4].value = voidSales;

    // nett sales
    const nettSales = grossSales - discount - voidSales;
    data[5].value = nettSales;

    // graduity
    const graduitySales = 0;
    data[6].value = graduitySales;

    // tax
    const taxSales = allTransactions.reduce(
      (init, curr) => (init += curr.tax_amount || 0),
      0
    );
    data[7].value = taxSales;

    // rounding
    const roundingSales = 0;
    data[8].value = roundingSales;

    // total
    const totalCollected = nettSales + graduitySales + taxSales + roundingSales;
    data[9].value = totalCollected;

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
              <h3 style={{ margin: "0" }}>Sales Summary</h3>
            </div>
            <div className="headerEnd">
              <Row>
                {/* <DropdownButton title="All Time">
                  <Dropdown.Item href="#/action-1">All Time</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">This Week</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">This Month</Dropdown.Item>
                </DropdownButton> */}

                <DropdownButton
                  title={outletName}
                  style={{ marginLeft: "1rem" }}
                >
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
            <tbody>
              {summaryData().map((item, index) => {
                return (
                  <tr key={index}>
                    <td></td>
                    <td>{item.key}</td>
                    <td>{rupiahFormat.convert(item.value)}</td>
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
