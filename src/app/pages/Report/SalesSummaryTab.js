import React from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import rupiahFormat from "rupiah-format";
import dayjs from "dayjs";

import "../style.css";

export const SalesSummaryTab = ({ selectedOutlet, startDate, endDate }) => {
  const [allTransactions, setAllTransactions] = React.useState([]);
  const [reports, setReports] = React.useState([
    {
      product_name: "",
      addons_name: "",
      category_name: "",
      sku: "",
      totalItems: 0,
      grossSales: 0,
      discountSales: 0,
      totalSales: 0
    }
  ]);

  const getTransactions = async (id, start_range, end_range) => {
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

    let allSales = [];
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setAllTransactions(data.data);
      allSales = data.data;
    } catch (err) {
      if (err.response?.status === 404) {
        setAllTransactions([]);
      }
      allSales = [];
      console.log(err);
    }

    const completedTransactions = allSales.filter(
      (item) => item.Payment?.status === "done"
    );

    const transItems = [];
    const prodIdList = [];
    for (const item of completedTransactions) {
      item.Transaction_Items.forEach((val) => {
        transItems.push(val);
        if (!prodIdList.includes(val.product_id))
          prodIdList.push(val.product_id);
      });
    }

    // sort transItems by product
    transItems.sort((a, b) => {
      if (a.product_id > b.product_id) return 1;
      if (b.product_id > a.product_id) return -1;
    });
    prodIdList.sort();

    // get gross sales of each product
    let allItems2 = [];
    prodIdList.forEach((val) => {
      const temp = transItems.filter((item) => item.product_id === val);
      const grossSales = temp.reduce(
        (init, curr) => (init += curr.price_total + curr.price_discount),
        0
      );
      // const discountSales = temp.reduce(
      //   (init, curr) => (init += curr.),
      //   0
      // );
      const totalSales = temp.reduce(
        (init, curr) => (init += curr.price_total),
        0
      );
      const quantity = temp.reduce((init, curr) => (init += curr.quantity), 0);
      let joinedAddons = "";
      for (const item of temp) {
        const currAddons = item.Transaction_Item_Addons.map(
          (addons) => addons.Addon?.name
        ).filter((val) => val);

        joinedAddons = currAddons.length ? currAddons.join(",") : "";
      }

      allItems2.push({
        product_name: temp[0].Product.name,
        addons_name: joinedAddons,
        category_name: temp[0].Product.Product_Category?.name,
        sku: temp[0].Product?.sku,
        totalItems: quantity,
        grossSales: grossSales,
        // discountSales: discountSales,
        totalSales: totalSales
      });
    });

    //
    //
    //
    // const allItems = completedTransactions.map((item) => {
    //   const grossSales = item.Transaction_Items.reduce(
    //     (init, curr) => (init += curr.price_total + curr.price_discount),
    //     0
    //   );
    //   const discountSales = item.Transaction_Items.reduce(
    //     (init, curr) => (init += curr.price_discount),
    //     0
    //   );
    //   const totalSales = item.Transaction_Items.reduce(
    //     (init, curr) => (init += curr.price_total),
    //     0
    //   );

    //   const output = item.Transaction_Items.map((val) => {
    //     const currAddons = val.Transaction_Item_Addons.map(
    //       (addons) => addons.Addon?.name
    //     ).filter((val) => val);

    //     const joinedAddons = currAddons.length ? currAddons.join(",") : "";

    //     return {
    //       product_name: val.Product.name,
    //       addons_name: joinedAddons,
    //       category_name: val.Product.Product_Category?.name,
    //       sku: val.Product?.sku,
    //       totalItems: val.quantity,
    //       grossSales: grossSales,
    //       discountSales: discountSales,
    //       totalSales: totalSales
    //     };
    //   });

    //   return output;
    // });

    const allProductNames = allItems2.flat(1).reduce((init, curr) => {
      init[`${curr.product_name}-${curr.addons_name}`] = curr?.category_name;
      return init;
    }, {});

    const compileReports = Object.keys(allProductNames).map((item) => {
      const name = item.split("-")[0];
      const addons = item.split("-")[1];
      const category = allProductNames[item];

      const sku = allItems2
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init = curr?.sku), "");

      const totalItems = allItems2
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init += curr.totalItems), 0);

      const grossSales = allItems2
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init += curr.grossSales), 0);

      // const discountSales = allItems2
      //   .flat(1)
      //   .filter(
      //     (val) => val.product_name === name && val.addons_name === addons
      //   )
      //   .reduce((init, curr) => (init += curr.discountSales), 0);
      const totalSales = allItems2
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init += curr.totalSales), 0);
      return {
        product_name: name,
        addons_name: addons,
        category_name: category,
        sku,
        totalItems,
        grossSales,
        // discountSales,
        totalSales
      };
    });
    setReports(compileReports);
  };

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
    const nettSales = grossSales - voidSales;
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

  let totalDiscount = 0;
  if (allTransactions.length) {
    const temp = allTransactions.filter(
      (item) => item.Payment?.status === "done"
    );
    // temp.forEach((item) => {
    //   totalDiscount += item.Payment.payment_discount;
    // });
    totalDiscount = temp.reduce(
      (init, curr) => (init += curr.Payment?.payment_discount),
      0
    );
  }

  const grandTotal = sumReports(reports, "totalSales") - totalDiscount;

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
              <td>{selectedOutlet?.name}</td>
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
                  <td>{item.totalSales}</td>
                </tr>
              );
            })}
            <tr>
              <th>Subtotal</th>
              <th></th>
              <th></th>
              <th></th>
              <th>{sumReports(reports, "totalItems")} </th>
              <th>{sumReports(reports, "grossSales")} </th>
              <th>{sumReports(reports, "totalSales")} </th>
            </tr>
            <tr>
              <th>Discount Given</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th>{totalDiscount}</th>
            </tr>
            <tr>
              <th>Grand Total</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th>{grandTotal}</th>
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
