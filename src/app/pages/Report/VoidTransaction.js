import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import rupiahFormat from "rupiah-format";
import "../style.css";
import { Table } from "react-bootstrap";

const VoidTransaction = ({ selectedOutlet, startDate, endDate }) => {
  const [voidTransaction, setVoidTransaction] = useState([]);
  const getVoidTransaction = async (id, start_range, end_range) => {
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
        `${API_URL}/api/v1/transaction/void${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setVoidTransaction(renderTable(data.data));
    } catch (err) {
      if (err.response.status === 404) {
        setVoidTransaction([]);
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
  const renderTable = (array) => {
    let final = [];
    let seen = {};
    array = array.filter((entry) => {
      let previous;
      if (seen.hasOwnProperty(entry.staff)) {
        previous = seen[entry.staff];
        previous.total_transaksi.push(entry.total);
        return false;
      }

      if (!Array.isArray(entry.array)) {
        entry.staff = [entry.staff];
        entry.total_transaksi = [entry.total];
      }

      seen[entry.staff] = entry;

      return true;
    });

    array.map((i) => {
      final.push({
        tanggal: dayjs(i.tanggal).format("DD/MM/YYYY"),
        receipt: i.receiptId,
        nama_staff: i.staff,
        total_transaksi: sum(i.total_transaksi)
      });
    });
    return final;
  };
  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };
  useEffect(() => {
    getVoidTransaction(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);

  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-void">
          <thead>
            <tr>
              <th>Laporan Transaksi Void / Refund</th>
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
              <th>ID Transaksi</th>
              <th>Staff</th>
              <th>Total Transaksi Void</th>
            </tr>
          </thead>
          <tbody>
            {voidTransaction.length > 0 ? (
              voidTransaction.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.tanggal}</td>
                    <td>{item.receipt}</td>
                    <td>{item.nama_staff}</td>
                    <td>{item.total_transaksi}</td>
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
              <th></th>
              <th></th>
              <th>{sumReports(voidTransaction, "total_transaksi")} </th>
            </tr>
          </tbody>
        </table>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction ID</th>
            <th>Staff</th>
            <th>Total Void Transaction</th>
          </tr>
        </thead>
        <tbody>
          {voidTransaction.length > 0 ? (
            voidTransaction.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.tanggal}</td>
                  <td>{item.receipt}</td>
                  <td>{item.nama_staff}</td>
                  <td>{rupiahFormat.convert(item.total_transaksi)}</td>
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
            <th></th>
            <th></th>
            <th>
              {rupiahFormat.convert(
                sumReports(voidTransaction, "total_transaksi")
              )}{" "}
            </th>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default VoidTransaction;
