import React from "react";
import { Table } from "react-bootstrap";
import rupiahFormat from "rupiah-format";

import "../style.css";

export const SalesSummaryTab = ({
  getTransactions,
  allTransactions,
  reports,
  selectedOutlet,
  startDate,
  endDate
}) => {
  React.useEffect(() => {
    getTransactions(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);

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
              <td>{selectedOutlet.name}</td>
            </tr>
          </thead>
          <thead>
            <tr>
              <th>Tanggal</th>
              <td>{`${startDate} - ${endDate}`}</td>
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
    </>
  );
};
