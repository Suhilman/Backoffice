import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import rupiahFormat from "rupiah-format";
import "../style.css";
import { Table } from "react-bootstrap";

const COGSReport = ({ selectedOutlet, startDate, endDate }) => {
  const [COGSTransaction, setCOGSTransaction] = useState([]);
  const getDataCOGS = async (id, start_range, end_range) => {
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
        `${API_URL}/api/v1/transaction/cogs${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setCOGSTransaction(renderTable(data.data));
    } catch (err) {
      if (err.response.status === 404) {
        setCOGSTransaction([]);
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
      if (seen.hasOwnProperty(entry.product_name)) {
        previous = seen[entry.product_name];
        previous.quantity.push(entry.sold_quantity);
        return false;
      }

      if (!Array.isArray(entry.array)) {
        entry.product = [entry.product_name];
        entry.quantity = [entry.sold_quantity];
      }

      seen[entry.product] = entry;

      return true;
    });

    array.map((i) => {
      final.push({
        product: i.product_name,
        category: i.category,
        kuantitas: sum(i.quantity),
        product_hpp: i.product_hpp * sum(i.quantity),
        product_sold_price: i.product_sold_price * sum(i.quantity),
        profit:
          i.product_sold_price * sum(i.quantity) -
          i.product_hpp * sum(i.quantity)
      });
    });
    return final;
  };
  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };
  useEffect(() => {
    getDataCOGS(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);
  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-cogs">
          <thead>
            <tr>
              <th>Laporan COGS ( Cost Of Good Sold )</th>
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
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Jumlah Terjual</th>
              <th>Harga Pokok Penjualan</th>
              <th>Harga Jual</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {COGSTransaction.length > 0 ? (
              COGSTransaction.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.product}</td>
                    <td>{item.category}</td>
                    <td>{item.kuantitas}</td>
                    <td>{item.product_hpp}</td>
                    <td>{item.product_sold_price}</td>
                    <td>{item.profit}</td>
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
              <th>{sumReports(COGSTransaction, "kuantitas")} </th>
              <th>{sumReports(COGSTransaction, "product_hpp")} </th>
              <th>{sumReports(COGSTransaction, "product_sold_price")} </th>
              <th>{sumReports(COGSTransaction, "profit")} </th>
            </tr>
          </tbody>
        </table>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Sold Quantity</th>
            <th>Buying Price</th>
            <th>Selling Price</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {COGSTransaction.length > 0 ? (
            COGSTransaction.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.category}</td>
                  <td>{item.kuantitas}</td>
                  <td>{rupiahFormat.convert(item.product_hpp)}</td>
                  <td>{rupiahFormat.convert(item.product_sold_price)}</td>
                  <td>{rupiahFormat.convert(item.profit)}</td>
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
            <th>{sumReports(COGSTransaction, "kuantitas")} </th>
            <th>
              {rupiahFormat.convert(sumReports(COGSTransaction, "product_hpp"))}{" "}
            </th>
            <th>
              {rupiahFormat.convert(
                sumReports(COGSTransaction, "product_sold_price")
              )}{" "}
            </th>
            <th>
              {rupiahFormat.convert(sumReports(COGSTransaction, "profit"))}{" "}
            </th>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default COGSReport;
