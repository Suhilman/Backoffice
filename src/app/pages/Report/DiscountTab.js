import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Table } from "react-bootstrap";
import rupiahFormat from "rupiah-format";

import "../style.css";

export const DiscountSalesTab = ({ selectedOutlet, startDate, endDate }) => {
  const [allPromoSales, setAllPromoSales] = React.useState([]);
  // const [allCategories, setAllCategories] = React.useState([]);

  const getDiscountSales = async (id, start_range, end_range) => {
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
        `${API_URL}/api/v1/transaction/promo-sales${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      console.log(data.data);
      setAllPromoSales(data.data);
    } catch (err) {
      if (err.response.status === 404) {
        setAllPromoSales([]);
      }
      console.log(err);
    }
  };

  // const getCategories = async () => {
  //   const API_URL = process.env.REACT_APP_API_URL;
  //   try {
  //     const { data } = await axios.get(`${API_URL}/api/v1/product-category`);
  //     const categories = data.data.map((item) => item.name);
  //     setAllCategories(categories);
  //   } catch (err) {
  //     if (err.response.status === 404) {
  //       setAllCategories([]);
  //     }
  //     console.log(err);
  //   }
  // };

  React.useEffect(() => {
    getDiscountSales(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);

  // React.useEffect(() => {
  //   getCategories();
  // }, []);

  const promoSalesData = () => {
    const data = [];

    const completedTransactions = allPromoSales.filter(
      (item) => item.Payment?.status === "done"
    );

    const paymentPromos = completedTransactions.filter(
      (item) => item.Payment?.Payment_Promos.length
    );
    // const countSpecialSold = specialPromoSold.map((item, index) => {
    //   return item.reduce((init, curr) => {
    //     const filterPromo = completedTransactions[
    //       index
    //     ].Payment.Payment_Promos.filter((val) => val.Promo.name === curr);
    //     init[curr] = filterPromo.reduce(
    //       (initItem, currItem) => (initItem += currItem || 0),
    //       0
    //     );
    //     return init;
    //   }, {});
    // });

    console.log(paymentPromos);
    // console.log(countSpecialSold);
    // const countTypesTotal = promoSold.map((item, index) => {
    //   return item.reduce((init, curr) => {
    //     const filterProduct = completedTransactions[
    //       index
    //     ].Transaction_Items.filter(
    //       (prod) => prod.Product.Product_Category.name === curr
    //     );
    //     init[curr] = filterProduct.reduce(
    //       (initItem, currItem) =>
    //         (initItem +=
    //           currItem.quantity *
    //           (currItem.price_product -
    //             currItem.price_discount +
    //             currItem.price_service)),
    //       0
    //     );
    //     return init;
    //   }, {});
    // });

    // const categorySold = allCategories.reduce((init, curr) => {
    //   init[curr] = countTypesSold.reduce(
    //     (initItem, currItem) => (initItem += currItem[curr] || 0),
    //     0
    //   );
    //   return init;
    // }, {});
    // const categoryTotal = allCategories.reduce((init, curr) => {
    //   init[curr] = countTypesTotal.reduce(
    //     (initItem, currItem) => (initItem += currItem[curr] || 0),
    //     0
    //   );
    //   return init;
    // }, {});

    // allCategories.forEach((category) => {
    //   data.push({
    //     category,
    //     usage: categorySold[category],
    //     refunded: categoryRefund[category],
    //     total: categoryTotal[category]
    //   });
    // });

    // data.sort((a, b) => b.usage - a.usage);

    // const totalUsage = data.reduce((init, curr) => (init += curr.usage), 0);
    // const totalAmount = data.reduce((init, curr) => (init += curr.total), 0);

    // data.push({
    //   name: "",
    //   usage: totalUsage,
    //   total: totalAmount
    // });

    return data;
  };

  return (
    <>
      <Table striped>
        <thead>
          <tr>
            <th></th>
            <th>Discount Name</th>
            <th>Usage</th>
            <th>Total Collected</th>
          </tr>
        </thead>
        <tbody>
          {promoSalesData().map((item, index) => {
            return (
              <tr key={index}>
                <td></td>
                <td>{item.name}</td>
                <td>{item.usage}</td>
                <td>{rupiahFormat.convert(item.total)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
