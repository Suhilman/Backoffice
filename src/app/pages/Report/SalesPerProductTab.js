import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import rupiahFormat from "rupiah-format";
import "../style.css";
import { Table } from "react-bootstrap";

export const SalesPerProductTab = ({ selectedOutlet, startDate, endDate }) => {
  const [salesPerProduct, setSalesPerProduct] = useState([]);
  const getDataSalesPerProduct = async (id, start_range, end_range) => {
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
        `${API_URL}/api/v1/transaction/perproduct${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setSalesPerProduct(renderTable(data.data));
    } catch (err) {
      if (err.response.status === 404) {
        setSalesPerProduct([]);
      }
    }
  };
  const unDuplicateArraySingleValues = (array) => {
    // Check if we are dealing with an Array that is not empty
    if (!array || !Array.isArray(array) || array.length === 0) {
      return array;
    }

    // Return a Array of unique values thanks to the Set
    return [...new Set(array)];
  };
  const unDuplicateArrayObjects = (array, propertyName) => {
    if (
      !array ||
      !Array.isArray(array) ||
      array.length === 0 ||
      !propertyName
    ) {
      return array;
    }
    // Create an Array off the values of the keys we want to check
    let objectArrayKeys = array.map((item) => item[propertyName]);

    // Remove duplicate values from those values with our previous function
    let uniqueKeys = unDuplicateArraySingleValues(objectArrayKeys);

    // Return an Array with only unique Objects
    return uniqueKeys.map((key) =>
      array.find((item) => item[propertyName] === key)
    );
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
    const arr = []; // make final array
    let quantity; // make variable for insert the sum of quantity
    let price_products; // make variable for insert the sum of price product
    let price_discounts; // make variable for insert the sum of price discount
    const duplicate = unDuplicateArrayObjects(array, "product_name"); // check is duplicate object and return it to single object
    quantity = array.map((i) => i.sold_quantity);
    price_products = array.map((i) => i.product_price);
    price_discounts = array.map((i) => i.price_discount);
    duplicate.map((x) => {
      //pushing to final array
      arr.push({
        product: x.product_name,
        category: x.category,
        kuantitas: sum(quantity),
        price_product: sum(price_products),
        price_discount: sum(price_discounts),
        total_sales: sum(price_products) - sum(price_discounts)
      });
    });
    return arr;
  };
  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };
  useEffect(() => {
    getDataSalesPerProduct(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);

  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-sales-per-product">
          <thead>
            <tr>
              <th>Laporan Penjualan Product</th>
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
              <th>Product Name</th>
              <th>Category</th>
              <th>Sold Quantity</th>
              <th>Gross Sales</th>
              <th>Discount Total</th>
              <th>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {salesPerProduct.length > 0 ? (
              salesPerProduct.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.product}</td>
                    <td>{item.category}</td>
                    <td>{item.kuantitas}</td>
                    <td>{item.price_product}</td>
                    <td>{item.price_discount}</td>
                    <td>{item.total_sales}</td>
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
              <th>{sumReports(salesPerProduct, "kuantitas")} </th>
              <th>{sumReports(salesPerProduct, "price_product")} </th>
              <th>{sumReports(salesPerProduct, "price_discount")} </th>
              <th>{sumReports(salesPerProduct, "total_sales")} </th>
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
            <th>Gross Sales</th>
            <th>Discount Total</th>
            <th>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {salesPerProduct.length > 0 ? (
            salesPerProduct.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.category}</td>
                  <td>{item.kuantitas}</td>
                  <td>{rupiahFormat.convert(item.price_product)}</td>
                  <td>{rupiahFormat.convert(item.price_discount)}</td>
                  <td>{rupiahFormat.convert(item.total_sales)}</td>
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
            <th>{sumReports(salesPerProduct, "kuantitas")} </th>
            <th>
              {rupiahFormat.convert(
                sumReports(salesPerProduct, "price_product")
              )}{" "}
            </th>
            <th>
              {rupiahFormat.convert(
                sumReports(salesPerProduct, "price_discount")
              )}{" "}
            </th>
            <th>
              {rupiahFormat.convert(sumReports(salesPerProduct, "total_sales"))}{" "}
            </th>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
