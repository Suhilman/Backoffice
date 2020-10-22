import React from "react";
import axios from "axios";

import { Row, Col, Table, Dropdown, DropdownButton } from "react-bootstrap";

import { Paper } from "@material-ui/core";

import "../style.css";

import rupiahFormat from "rupiah-format";

export const CategorySalesTab = ({ allOutlets, ranges }) => {
  const [loading, setLoading] = React.useState(false);

  const [allCategorySales, setAllCategorySales] = React.useState([]);
  const [allCategories, setAllCategories] = React.useState([]);
  const [outletId, setOutletId] = React.useState("");
  const [outletName, setOutletName] = React.useState("All Outlets");

  const [rangeId, setRangeId] = React.useState(1);
  const [rangeName, setRangeName] = React.useState("Today");

  const [startRange, setStartRange] = React.useState(new Date());
  const [endRange, setEndRange] = React.useState(new Date());

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const getCategorySales = async (id, range_id, start_range, end_range) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const { date_start, date_end } = ranges(start_range, end_range).find(
      (item) => item.id === range_id
    );

    const outlet_id = id ? `?outlet_id=${id}&` : "?";

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction/category-sales${outlet_id}date_start=${date_start}&date_end=${date_end}`
      );
      setAllCategorySales(data.data);
    } catch (err) {
      if (err.response.status === 404) {
        setAllCategorySales([]);
      }
      console.log(err);
    }
  };

  const getCategories = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product-category`);
      const categories = data.data.map((item) => item.name);
      setAllCategories(categories);
    } catch (err) {
      if (err.response.status === 404) {
        setAllCategories([]);
      }
      console.log(err);
    }
  };

  React.useEffect(() => {
    getCategorySales(outletId, rangeId, startRange, endRange);
  }, [outletId, rangeId, startRange, endRange]);

  React.useEffect(() => {
    getCategories();
  }, []);

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

  const categorySalesData = () => {
    const data = [];

    const completedTransactions = allCategorySales.filter(
      (item) => item.Payment?.status === "done"
    );
    const voidTransactions = allCategorySales.filter(
      (item) => item.Payment?.status === "refund"
    );

    const typesSold = completedTransactions.map((item) =>
      item.Transaction_Items.map((val) => val.Product.Product_Category.name)
    );
    const typesRefund = voidTransactions.map((item) =>
      item.Transaction_Items.map((val) => val.Product.Product_Category.name)
    );
    const countTypesSold = typesSold.map((item, index) => {
      return item.reduce((init, curr) => {
        const filterProduct = completedTransactions[
          index
        ].Transaction_Items.filter(
          (prod) => prod.Product.Product_Category.name === curr
        );
        init[curr] = filterProduct.reduce(
          (initItem, currItem) => (initItem += currItem.quantity),
          0
        );
        return init;
      }, {});
    });
    const countTypesRefund = typesRefund.map((item, index) => {
      return item.reduce((init, curr) => {
        const filterProduct = voidTransactions[index].Transaction_Items.filter(
          (prod) => prod.Product.Product_Category.name === curr
        );
        init[curr] = filterProduct.reduce(
          (initItem, currItem) => (initItem += currItem.quantity),
          0
        );
        return init;
      }, {});
    });
    const countTypesTotal = typesSold.map((item, index) => {
      return item.reduce((init, curr) => {
        const filterProduct = completedTransactions[
          index
        ].Transaction_Items.filter(
          (prod) => prod.Product.Product_Category.name === curr
        );
        init[curr] = filterProduct.reduce(
          (initItem, currItem) =>
            (initItem +=
              currItem.quantity *
              (currItem.price_product -
                currItem.price_discount +
                currItem.price_service)),
          0
        );
        return init;
      }, {});
    });

    const categorySold = allCategories.reduce((init, curr) => {
      init[curr] = countTypesSold.reduce(
        (initItem, currItem) => (initItem += currItem[curr] || 0),
        0
      );
      return init;
    }, {});
    const categoryRefund = allCategories.reduce((init, curr) => {
      init[curr] = countTypesRefund.reduce(
        (initItem, currItem) => (initItem += currItem[curr] || 0),
        0
      );
      return init;
    }, {});
    const categoryTotal = allCategories.reduce((init, curr) => {
      init[curr] = countTypesTotal.reduce(
        (initItem, currItem) => (initItem += currItem[curr] || 0),
        0
      );
      return init;
    }, {});

    allCategories.forEach((category) => {
      data.push({
        category,
        sold: categorySold[category],
        refunded: categoryRefund[category],
        total: categoryTotal[category]
      });
    });

    data.sort((a, b) => b.sold - a.sold);

    const totalSold = data.reduce((init, curr) => (init += curr.sold), 0);
    const totalRefunded = data.reduce(
      (init, curr) => (init += curr.refunded),
      0
    );
    const totalAmount = data.reduce((init, curr) => (init += curr.total), 0);

    data.push({
      category: "",
      sold: totalSold,
      refunded: totalRefunded,
      total: totalAmount
    });

    return data;
  };

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div
            className="headerPage lineBottom"
            style={{ marginBottom: "1rem" }}
          >
            <div className="headerStart">
              <h3 style={{ margin: "0" }}>Category Sales</h3>
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
                  style={{ marginLeft: "1rem" }}
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
              </Row>
            </div>
          </div>

          <div style={{ paddingRight: "1rem", textAlign: "right" }}>
            <p>
              <b>Date:</b>{" "}
              {
                ranges(startRange, endRange).find((item) => item.id === rangeId)
                  .displayDate
              }
            </p>
          </div>

          <Table striped>
            <thead>
              <tr>
                <th></th>
                <th>Category</th>
                <th>Items Sold</th>
                <th>Items Refunded</th>
                <th>Total Collected</th>
              </tr>
            </thead>
            <tbody>
              {categorySalesData().map((item, index) => {
                return (
                  <tr key={index}>
                    <td></td>
                    <td>{item.category}</td>
                    <td>{item.sold}</td>
                    <td>{item.refunded}</td>
                    <td>{rupiahFormat.convert(item.total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Paper>
      </Col>
    </Row>
  );
};
