import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import rupiahFormat from "rupiah-format";
import "../style.css";
import { Table } from "react-bootstrap";

const ProfitReport = ({ selectedOutlet, startDate, endDate }) => {
  const [profitReport, setProfitReport] = useState([]);
  const getProfitReport = async (id, start_range, end_range) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const outlet_id = id ? `?outlet_id=${id}&` : "?";

    if (start_range === end_range) {
      end_range = dayjs(end_range)
        .add(1, "day")
        .format("YYYY-MM-DD");
    }

    if (new Date(start_range) > new Date(end_range)) {
      start_range = dayjs(start_range)
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      end_range = dayjs(end_range)
        .add(1, "day")
        .format("YYYY-MM-DD");
    }
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction/profit${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setProfitReport(renderTable(data.data));
    } catch (err) {
      if (err.response.status === 404) {
        setProfitReport([]);
      }
    }
  };
  function sum(input) {
    if (toString.call(input) !== "[object Array]") return false;

    var total = 0;
    for (var i = 0; i < input.length; i++) {
      if (isNaN(input[i])) {
        continue;
      }
      total += Number(input[i]);
    }
    return total;
  }
  const handlePercentage = (data) => {
    data = data.map((i) => {
      return (i.laba_kotor / i.penjualan_kotor) * 100;
    });
    let hasil = sum(data) / data.length;
    if (hasil === NaN) {
      return "0";
    } else {
      return Math.round(hasil);
    }
  };
  const renderTable = (array) => {
    let final = [];
    let seen = {};
    array = array.filter((entry) => {
      let previous;
      if (seen.hasOwnProperty(dayjs(entry.tanggal).format("DD/MM/YYYY"))) {
        previous = seen[dayjs(entry.tanggal).format("DD/MM/YYYY")];
        previous.penjualan_kotor.push(entry.penjualan_kotor);
        previous.diskon.push(entry.diskon);
        return false;
      }

      if (!Array.isArray(entry.array)) {
        entry.tanggal = [dayjs(entry.tanggal).format("DD/MM/YYYY")];
        entry.penjualan_kotor = [entry.penjualan_kotor];
        entry.diskon = [entry.diskon];
      }

      seen[entry.tanggal] = entry;

      return true;
    });
    array.map((i) => {
      final.push({
        tanggal: i.tanggal,
        penjualan_kotor: sum(i.penjualan_kotor),
        diskon: sum(i.diskon),
        pembulatan: 0,
        laba_kotor: sum(i.penjualan_kotor) - sum(i.diskon)
      });
    });
    return final;
  };
  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };
  useEffect(() => {
    getProfitReport(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);

  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-profit">
          <thead>
            <tr>
              <th>Laporan Perhitungan Laba</th>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>Outlet</th>
              <td>
                {selectedOutlet.id === " " ||
                selectedOutlet.id === null ||
                selectedOutlet.id === undefined
                  ? "Semua Outlet"
                  : selectedOutlet.name}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
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
              <th>Tanggal</th>
              <th>Penjualan Kotor</th>
              <th>Total Diskon</th>
              <th>Pembulatan</th>
              <th>Laba Kotor</th>
              <th>% Laba Kotor</th>
            </tr>
          </thead>
          <tbody>
            {profitReport.length > 0 ? (
              profitReport.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.tanggal}</td>
                    <td>{item.penjualan_kotor}</td>
                    <td>{item.diskon}</td>
                    <td>{item.pembulatan}</td>
                    <td>{item.laba_kotor}</td>
                    <td>{`${Math.round(
                      (item.laba_kotor / item.penjualan_kotor) * 100
                    )}%`}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>Data Not Found</td>
              </tr>
            )}
            <tr>
              <th>Grand Total</th>
              <th>{sumReports(profitReport, "penjualan_kotor")} </th>
              <th>{sumReports(profitReport, "diskon")} </th>
              <th>{sumReports(profitReport, "pembulatan")} </th>
              <th>{sumReports(profitReport, "laba_kotor")}</th>
              <th>{`${handlePercentage(profitReport)}%`}</th>
            </tr>
          </tbody>
        </table>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Gross Sales</th>
            <th>Discount Total</th>
            <th>Rounding</th>
            <th>Gross Profit</th>
            <th>% Gross Profit</th>
          </tr>
        </thead>
        <tbody>
          {profitReport.length > 0 ? (
            profitReport.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.tanggal}</td>
                  <td>{rupiahFormat.convert(item.penjualan_kotor)}</td>
                  <td>{rupiahFormat.convert(item.diskon)}</td>
                  <td>{rupiahFormat.convert(item.pembulatan)}</td>
                  <td>{rupiahFormat.convert(item.laba_kotor)}</td>
                  <td>{`${Math.round(
                    (item.laba_kotor / item.penjualan_kotor) * 100
                  )}%`}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>Data Not Found</td>
            </tr>
          )}
          <tr>
            <th>Grand Total</th>
            <th>
              {rupiahFormat.convert(
                sumReports(profitReport, "penjualan_kotor")
              )}{" "}
            </th>
            <th>{rupiahFormat.convert(sumReports(profitReport, "diskon"))} </th>
            <th>
              {rupiahFormat.convert(sumReports(profitReport, "pembulatan"))}
            </th>
            <th>
              {rupiahFormat.convert(sumReports(profitReport, "laba_kotor"))}
            </th>
            <th>{`${handlePercentage(profitReport)}%`}</th>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default ProfitReport;
