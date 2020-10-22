import React from "react";
import axios from "axios";

import { Row, Col, Table, Dropdown, DropdownButton } from "react-bootstrap";

import { Paper } from "@material-ui/core";

import "../style.css";

import rupiahFormat from "rupiah-format";

export const SalesTypeTab = ({ allOutlets, ranges }) => {
  const [loading, setLoading] = React.useState(false);

  const [allSalesTypes, setAllSalesTypes] = React.useState([]);
  const [allTypes, setAllTypes] = React.useState([]);
  const [outletId, setOutletId] = React.useState("");
  const [outletName, setOutletName] = React.useState("All Outlets");

  const [rangeId, setRangeId] = React.useState(1);
  const [rangeName, setRangeName] = React.useState("Today");

  const [startRange, setStartRange] = React.useState(new Date());
  const [endRange, setEndRange] = React.useState(new Date());

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

  const getSalesType = async (id, range_id, start_range, end_range) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const { date_start, date_end } = ranges(start_range, end_range).find(
      (item) => item.id === range_id
    );

    const outlet_id = id ? `?outlet_id=${id}&` : "?";

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction/sales-type${outlet_id}date_start=${date_start}&date_end=${date_end}`
      );
      setAllSalesTypes(data.data);
    } catch (err) {
      if (err.response.status === 404) {
        setAllSalesTypes([]);
      }
      console.log(err);
    }
  };

  React.useEffect(() => {
    getTypes();
  }, []);

  React.useEffect(() => {
    getSalesType(outletId, rangeId, startRange, endRange);
  }, [outletId, rangeId, startRange, endRange]);

  const handleSelectOutlet = (data) => {
    if (data) {
      setOutletId(data.id);
      setOutletName(data.name);
    } else {
      setOutletId("");
      setOutletName("All Outlets");
    }
  };

  const handleSelectRange = (data) => {
    setRangeId(data.id);
    setRangeName(data.value);

    if (data.id === 9) {
      setStartRange(new Date());
      setEndRange(new Date());
    }
  };

  const salesTypeData = () => {
    const data = [];

    const allTransactions = allSalesTypes.filter(
      (item) => item.Payment?.status === "done"
    );
    const types = allTransactions.map((item) =>
      [
        ...new Set(
          item.Transaction_Items.map((val) => {
            return val.Sales_Type.name;
          })
        )
      ].join(" + ")
    );
    const newTypes = types.map((item, index) => {
      return { type: item, transaction: allTransactions[index] };
    });
    const numberTransactions = newTypes.reduce((map, val) => {
      map[val.type] = (map[val.type] || 0) + 1;
      return map;
    }, {});
    const joinedTransactions = newTypes.reduce((init, curr, index, self) => {
      init[curr.type] = self
        .filter((item) => item.type === curr.type)
        .map((item) => item.transaction);
      return init;
    }, {});

    const newAllTypes = [...new Set([...types, ...allTypes])];
    const haveTransactions = Object.keys(numberTransactions);
    newAllTypes.forEach((type) => {
      if (haveTransactions.includes(type)) {
        const totalCollected = joinedTransactions[type].reduce(
          (init, curr) => (init += curr.Payment.payment_total),
          0
        );

        data.push({
          type,
          transaction: numberTransactions[type],
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

    data.sort((a, b) => b.transaction - a.transaction);

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
                <DropdownButton title={rangeName} variant="outline-secondary">
                  {ranges(startRange, endRange).map((item) => {
                    if (item.id === 9) return "";

                    return (
                      <Dropdown.Item
                        key={item.id}
                        onClick={() => handleSelectRange(item)}
                      >
                        {item.value}
                      </Dropdown.Item>
                    );
                  })}
                </DropdownButton>

                <DropdownButton
                  title={outletName}
                  style={{ marginLeft: "1rem" }}
                  variant="outline-secondary"
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
              </Row>
            </div>
          </div>

          <div style={{ paddingRight: "1rem", textAlign: "right" }}>
            <p>
              <b>Date:</b>{" "}
              {
                ranges(startRange, endRange).find((item) => item.id === rangeId)
                  .displayDate
              }
            </p>
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
