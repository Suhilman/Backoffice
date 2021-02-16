import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import rupiahFormat from "rupiah-format";
import "../style.css";
import { Table } from "react-bootstrap";

const SalesPerHour = ({
  selectedOutlet,
  endDate,
  startDate,
  startTime,
  endTime
}) => {
  const [salesPerHour, setSalesPerHour] = useState([]);
  const getDataSalesPerHour = async (
    id,
    start_range,
    end_range,
    start_time,
    end_time
  ) => {
    let timeStart = dayjs(start_time).format("HH:mm:ss");
    let timeEnd = dayjs(end_time).format("HH:mm:ss");
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
    if (timeStart === timeEnd) {
      timeEnd = dayjs(end_time)
        .add(1, "hour")
        .format("HH:mm");
    }
    let times_start = dayjs(start_time).format("HH");
    let times_end = dayjs(end_time).format("HH");
    let switched;
    if (parseInt(times_start) > parseInt(times_end)) {
      switched = timeStart;
      timeStart = timeEnd;
      timeEnd = switched;
    }
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction/sales-hour${outlet_id}date_start=${start_range}&date_end=${end_range}&time_start=${timeStart}&time_end=${timeEnd}`
      );
      setSalesPerHour(renderTable(data.data));
    } catch (err) {
      if (err.response.status === 404) {
        setSalesPerHour([]);
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
  function compare(a, b) {
    const timeA = parseInt(a.time);
    const timeB = parseInt(b.time);

    let comparison = 0;
    if (timeA > timeB) {
      comparison = 1;
    } else if (timeA < timeB) {
      comparison = -1;
    }
    return comparison;
  }
  const renderTable = (array) => {
    let final = [];
    let seen = {};
    array = array.filter((entry) => {
      let previous;
      if (seen.hasOwnProperty(entry.time)) {
        previous = seen[entry.time];
        previous.penjualan.push(entry.penjualan);
        return false;
      }

      if (!Array.isArray(entry.array)) {
        entry.time = [entry.time];
        entry.penjualan = [entry.penjualan];
      }

      seen[entry.time] = entry;

      return true;
    });

    array.map((i) => {
      final.push({
        time: i.time[0],
        total_penjualan: sum(i.penjualan),
        penjualan: i.penjualan,
        jumlah_transaksi: i.penjualan.length,
        rata_rata: Math.round(sum(i.penjualan) / i.penjualan.length)
      });
    });
    return final.sort(compare);
  };
  const timeSet = (time) => {
    return `${time}:00 - ${time + 1}:00`;
  };
  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };
  useEffect(() => {
    getDataSalesPerHour(
      selectedOutlet.id,
      startDate,
      endDate,
      startTime,
      endTime
    );
  }, [selectedOutlet, startDate, endDate, startTime, endTime]);

  console.log(salesPerHour);
  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-sales-per-hour">
          <thead>
            <tr>
              <th>Laporan Penjualan Per Jam</th>
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
              <th>Waktu</th>
              <td>{`${dayjs(startTime).format("HH:mm:ss")} - ${dayjs(
                endTime
              ).format("HH:mm:ss")}`}</td>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Jumlah Transaksi</th>
              <th>Penjualan</th>
              <th>Rata-Rata Penjualan</th>
            </tr>
          </thead>
          <tbody>
            {salesPerHour.length > 0 ? (
              salesPerHour.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{timeSet(parseInt(item.time))}</td>
                    <td>{item.jumlah_transaksi}</td>
                    <td>{item.total_penjualan}</td>
                    <td>{item.rata_rata}</td>
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
              <th>{sumReports(salesPerHour, "jumlah_transaksi")}</th>
              <th>{sumReports(salesPerHour, "total_penjualan")} </th>
              <th>{sumReports(salesPerHour, "rata_rata")} </th>
            </tr>
          </tbody>
        </table>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Total Transaction</th>
            <th>Total Sales</th>
            <th>Average Sales</th>
          </tr>
        </thead>
        <tbody>
          {salesPerHour.length > 0 ? (
            salesPerHour.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{timeSet(parseInt(item.time))}</td>
                  <td>{item.jumlah_transaksi}</td>
                  <td>{rupiahFormat.convert(item.total_penjualan)}</td>
                  <td>{rupiahFormat.convert(item.rata_rata)}</td>
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
            <th>{sumReports(salesPerHour, "jumlah_transaksi")}</th>
            <th>
              {rupiahFormat.convert(
                sumReports(salesPerHour, "total_penjualan")
              )}{" "}
            </th>
            <th>
              {rupiahFormat.convert(sumReports(salesPerHour, "rata_rata"))}{" "}
            </th>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default SalesPerHour;
