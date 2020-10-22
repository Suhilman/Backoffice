import React from "react";

import { Row, Col, Table, Dropdown, DropdownButton } from "react-bootstrap";

import { Paper } from "@material-ui/core";

import { sum } from "lodash";
import rupiahFormat from "rupiah-format";
import ExportExcel from "react-html-table-to-excel";

import "../style.css";

export const SalesSummaryTab = ({
  allOutlets,
  getTransactions,
  allTransactions,
  ranges,
  reports
}) => {
  // const [loading, setLoading] = React.useState(false);

  const [outletId, setOutletId] = React.useState("");
  const [outletName, setOutletName] = React.useState("All Outlets");

  const [rangeId, setRangeId] = React.useState(1);
  const [rangeName, setRangeName] = React.useState("Today");

  const [startRange, setStartRange] = React.useState(new Date());
  const [endRange, setEndRange] = React.useState(new Date());

  // const enableLoading = () => setLoading(true);
  // const disableLoading = () => setLoading(false);

  React.useEffect(() => {
    getTransactions(outletId, rangeId, startRange, endRange);
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

  const summaryData = () => {
    const data = [
      {
        key: "(Income)",
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
        key: "(Bonus)",
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

    const completedTransactions = allTransactions.filter(
      (item) =>
        item.Payment?.status === "done" || item.Payment?.status === "refund"
    );
    const doneTransactions = allTransactions.filter(
      (item) => item.Payment?.status === "done"
    );
    const voidTransactions = allTransactions.filter(
      (item) => item.Payment?.status === "refund"
    );

    const income = completedTransactions.reduce(
      (init, curr) => (init += curr.Payment?.payment_total),
      0
    );

    // income sales
    const incomeSales = income;
    data[0].value = incomeSales;

    // gross sales dikurangi hpp
    const grossSales = income;
    data[1].value = grossSales;

    // discount
    const discount = completedTransactions.reduce(
      (init, curr) => (init += curr.Payment?.payment_discount),
      0
    );
    data[2].value = discount;

    // refund / void
    const voidSales = voidTransactions.reduce(
      (init, curr) => (init += curr.Payment.payment_total),
      0
    );
    data[3].value = voidSales;

    // nett sales
    const nettSales = grossSales - discount - voidSales;
    data[4].value = nettSales;

    // bonus
    const bonus = 0;
    data[5].value = bonus;

    // tax
    const taxSales = doneTransactions.reduce(
      (init, curr) => (init += curr.Payment.payment_tax),
      0
    );
    data[6].value = taxSales;

    // rounding
    const roundingSales = 0;
    data[7].value = roundingSales;

    // total
    const totalCollected = nettSales - bonus - taxSales + roundingSales;
    data[8].value = totalCollected;

    return data;
  };

  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };

  const filename = () => {
    const value = ranges(startRange, endRange).find(
      (item) => item.id === rangeId
    ).valueId;
    const date = ranges(startRange, endRange).find(
      (item) => item.id === rangeId
    ).displayDate;

    const processValue = value
      .split(" ")
      .join("-")
      .toLowerCase();
    return `transaksi-penjualan-produk-${processValue}_${date}`;
  };

  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-summary">
          <thead>
            <tr>
              <th>Laporan Penjualan Produk</th>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>Outlet</th>
              <td>{outletName}</td>
            </tr>
          </thead>
          <thead>
            <tr>
              <th>Tanggal</th>
              <td>
                {
                  ranges(startRange, endRange).find(
                    (item) => item.id === rangeId
                  ).displayDate
                }
              </td>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>Nama Produk</th>
              <th>Nama Opsi Tambahan</th>
              <th>Kategori</th>
              <th>SKU</th>
              <th>Terjual</th>
              <th>Penjualan Kotor</th>
              <th>Diskon</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.product_name}</td>
                  <td>{item.addons_name}</td>
                  <td>{item.category_name}</td>
                  <td>{item.sku}</td>
                  <td>{item.totalItems}</td>
                  <td>{item.grossSales}</td>
                  <td>{item.discountSales}</td>
                  <td>{item.totalSales}</td>
                </tr>
              );
            })}
            <tr>
              <th>Grand Total</th>
              <th></th>
              <th></th>
              <th></th>
              <th>{sumReports(reports, "totalItems")} </th>
              <th>{sumReports(reports, "grossSales")} </th>
              <th></th>
              <th>{sumReports(reports, "totalSales")} </th>
            </tr>
          </tbody>
        </table>
      </div>

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
                    style={{ margin: "0 1rem" }}
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

                  <ExportExcel
                    className="btn btn-outline-primary"
                    table="table-summary"
                    filename={filename()}
                    sheet="transaction-report"
                    buttonText="Export"
                  />
                </Row>
              </div>
            </div>

            <div style={{ paddingRight: "1rem", textAlign: "right" }}>
              <p>
                <b>Date:</b>{" "}
                {
                  ranges(startRange, endRange).find(
                    (item) => item.id === rangeId
                  ).displayDate
                }
              </p>
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
    </>
  );
};
