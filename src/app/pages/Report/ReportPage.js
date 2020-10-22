import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import { Tabs, Tab } from "react-bootstrap";

import { SalesSummaryTab } from "./SalesSummaryTab";
import { PaymentMethodTab } from "./PaymentMethodTab";
import { SalesTypeTab } from "./SalesTypeTab";
import { CategorySalesTab } from "./CategorySalesTab";
import { TransactionHistoryTab } from "./TransactionHistoryTab";

export const ReportPage = () => {
  const [tabs, setTabs] = React.useState("sales-summary");
  const [allOutlets, setAllOutlets] = React.useState([]);
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

  const ranges = (startRange, endRange) => [
    {
      id: 1,
      value: "Today",
      valueId: "Hari Ini",
      displayDate: dayjs().format("DD-MM-YYYY"),
      date_start: dayjs().format("YYYY-MM-DD"),
      date_end: dayjs()
        .add(1, "day")
        .format("YYYY-MM-DD")
    },
    {
      id: 2,
      value: "This Week",
      valueId: "Pekan Ini",
      displayDate: `${dayjs()
        .startOf("week")
        .format("DD-MM-YYYY")} - ${dayjs()
        .endOf("week")
        .format("DD-MM-YYYY")}`,
      date_start: dayjs()
        .startOf("week")
        .format("YYYY-MM-DD"),
      date_end: dayjs()
        .endOf("week")
        .format("YYYY-MM-DD")
    },
    {
      id: 3,
      value: "Last Week",
      valueId: "Pekan Lalu",
      displayDate: `${dayjs()
        .startOf("week")
        .subtract(1, "week")
        .format("DD-MM-YYYY")} - ${dayjs()
        .endOf("week")
        .subtract(1, "week")
        .format("DD-MM-YYYY")}`,
      date_start: dayjs()
        .startOf("week")
        .subtract(1, "week")
        .format("YYYY-MM-DD"),
      date_end: dayjs()
        .endOf("week")
        .subtract(1, "week")
        .format("YYYY-MM-DD")
    },
    {
      id: 4,
      value: "This Month",
      valueId: "Bulan Ini",
      displayDate: `${dayjs()
        .startOf("month")
        .format("DD-MM-YYYY")} - ${dayjs()
        .endOf("month")
        .format("DD-MM-YYYY")}`,
      date_start: dayjs()
        .startOf("month")
        .format("YYYY-MM-DD"),
      date_end: dayjs()
        .endOf("month")
        .format("YYYY-MM-DD")
    },
    {
      id: 5,
      value: "Last Month",
      valueId: "Bulan Lalu",
      displayDate: `${dayjs()
        .subtract(1, "month")
        .startOf("month")
        .format("DD-MM-YYYY")} - ${dayjs()
        .subtract(1, "month")
        .endOf("month")
        .format("DD-MM-YYYY")}`,
      date_start: dayjs()
        .subtract(1, "month")
        .startOf("month")
        .format("YYYY-MM-DD"),
      date_end: dayjs()
        .subtract(1, "month")
        .endOf("month")
        .format("YYYY-MM-DD")
    },
    // {
    //   id: 6,
    //   value: "Last 6 Months",
    //   date_start: dayjs()
    //     .subtract(6, "month")
    //     .date(1)
    //     .format("YYYY-MM-DD"),
    //   date_end: dayjs()
    //     .endOf("month")
    //     .format("YYYY-MM-DD")
    // },
    {
      id: 7,
      value: "This Year",
      valueId: "Tahun Ini",
      displayDate: `${dayjs()
        .startOf("year")
        .format("DD-MM-YYYY")} - ${dayjs()
        .endOf("year")
        .format("DD-MM-YYYY")}`,
      date_start: dayjs()
        .startOf("year")
        .format("YYYY-MM-DD"),
      date_end: dayjs()
        .endOf("year")
        .format("YYYY-MM-DD")
    },
    {
      id: 8,
      value: "Last Year",
      valueId: "Tahun Lalu",
      displayDate: `${dayjs()
        .subtract(1, "year")
        .startOf("year")
        .format("DD-MM-YYYY")} - ${dayjs()
        .subtract(1, "year")
        .endOf("year")
        .format("DD-MM-YYYY")}`,
      date_start: dayjs()
        .subtract(1, "year")
        .startOf("year")
        .format("YYYY-MM-DD"),
      date_end: dayjs()
        .subtract(1, "year")
        .endOf("year")
        .format("YYYY-MM-DD")
    },
    {
      id: 9,
      value: `${dayjs(startRange).format("YYYY-MM-DD")} - ${dayjs(
        endRange
      ).format("YYYY-MM-DD")}`,
      valueId: "",
      displayDate: `${dayjs(startRange).format("DD-MM-YYYY")} - ${dayjs(
        endRange
      ).format("DD-MM-YYYY")}`,
      date_start: dayjs(startRange).format("YYYY-MM-DD"),
      date_end: dayjs(endRange).format("YYYY-MM-DD")
    }
  ];

  const getOutlets = async () => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getTransactions = async (id, range_id, start_range, end_range) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const { date_start, date_end } = ranges(start_range, end_range).find(
      (item) => item.id === range_id
    );

    const outlet_id = id ? `?outlet_id=${id}&` : "?";

    let allSales;
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction${outlet_id}date_start=${date_start}&date_end=${date_end}`
      );
      setAllTransactions(data.data);
      allSales = data.data;
    } catch (err) {
      if (err.response.status === 404) {
        setAllTransactions([]);
      }
      allSales = [];
      console.log(err);
    }

    const completedTransactions = allSales.filter(
      (item) => item.Payment?.status === "done"
    );

    const allItems = completedTransactions.map((item) => {
      const grossSales = item.Transaction_Items.reduce(
        (init, curr) => (init += curr.price_total + curr.price_discount),
        0
      );
      const discountSales = item.Transaction_Items.reduce(
        (init, curr) => (init += curr.price_discount),
        0
      );
      const totalSales = item.Transaction_Items.reduce(
        (init, curr) => (init += curr.price_total),
        0
      );

      const output = item.Transaction_Items.map((val, index, self) => {
        const currAddons = val.Transaction_Item_Addons.map(
          (addons) => addons.Addon?.name
        ).filter((val) => val);

        const joinedAddons = currAddons.length ? currAddons.join(",") : "";

        return {
          product_name: val.Product.name,
          addons_name: joinedAddons,
          category_name: val.Product.Product_Category.name,
          sku: val.Product.sku,
          totalItems: val.quantity,
          grossSales: grossSales,
          discountSales: discountSales,
          totalSales: totalSales
        };
      });

      return output;
    });

    const allProductNames = allItems.flat(1).reduce((init, curr) => {
      init[`${curr.product_name}-${curr.addons_name}`] = curr.category_name;
      return init;
    }, {});

    const compileReports = Object.keys(allProductNames).map((item) => {
      const name = item.split("-")[0];
      const addons = item.split("-")[1];
      const category = allProductNames[item];

      const sku = allItems
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init = curr.sku), "");

      const totalItems = allItems
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init += curr.totalItems), 0);

      const grossSales = allItems
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init += curr.grossSales), 0);

      const discountSales = allItems
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init += curr.discountSales), 0);

      const totalSales = allItems
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
        discountSales,
        totalSales
      };
    });

    setReports(compileReports);
  };

  React.useEffect(() => {
    getOutlets();
  }, []);

  return (
    <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
      <Tab eventKey="sales-summary" title="Sales Summary">
        <SalesSummaryTab
          allOutlets={allOutlets}
          getTransactions={getTransactions}
          allTransactions={allTransactions}
          ranges={ranges}
          reports={reports}
        />
      </Tab>

      <Tab eventKey="payment-method" title="Payment Method">
        <PaymentMethodTab allOutlets={allOutlets} ranges={ranges} />
      </Tab>

      <Tab eventKey="sales-type" title="Sales Type">
        <SalesTypeTab allOutlets={allOutlets} ranges={ranges} />
      </Tab>

      <Tab eventKey="category-sales" title="Category Sales">
        <CategorySalesTab allOutlets={allOutlets} ranges={ranges} />
      </Tab>

      <Tab eventKey="transaction-history" title="Transaction History">
        <TransactionHistoryTab allOutlets={allOutlets} ranges={ranges} />
      </Tab>
    </Tabs>
  );
};
