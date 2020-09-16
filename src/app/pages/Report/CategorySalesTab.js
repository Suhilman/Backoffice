import React from "react";
import axios from "axios";

import { Row, Col, Table, Dropdown, DropdownButton } from "react-bootstrap";

import { Paper } from "@material-ui/core";

import "../style.css";

import rupiahFormat from "rupiah-format";

export const CategorySalesTab = ({ allOutlets }) => {
  const [loading, setLoading] = React.useState(false);

  const [allCategorySales, setAllCategorySales] = React.useState([]);
  const [outletId, setOutletId] = React.useState("");
  const [outletName, setOutletName] = React.useState("All Outlets");

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const getCategorySales = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    if (id) {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/transaction/category-sales?outlet_id=${id}`
        );
        setAllCategorySales(data.data);
      } catch (err) {
        if (err.response.status === 404) {
          setAllCategorySales([]);
        }
        console.log(err);
      }
    } else {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/transaction/category-sales`
        );
        setAllCategorySales(data.data);
      } catch (err) {
        if (err.response.status === 404) {
          setAllCategorySales([]);
        }
        console.log(err);
      }
    }
  };

  React.useEffect(() => {
    getCategorySales(outletId);
  }, [outletId]);

  const handleSelectOutlet = (data) => {
    if (data) {
      setOutletId(data.id);
      setOutletName(data.name);
    } else {
      setOutletId("");
      setOutletName("All Outlets");
    }
  };

  const categorySalesData = () => {
    const data = [];

    allCategorySales.forEach((item) => {
      const allProducts = item.Products;
      let totalCollected = 0;
      let sold = 0;
      let refunded = 0;

      if (allProducts.length) {
        allProducts.forEach((val) => {
          val.Transaction_Items.forEach((curr) => {
            totalCollected += curr.subtotal;

            if (curr.Transaction.Transaction_Refund) {
              refunded += curr.quantity;
            } else {
              sold += curr.quantity;
            }
          });

          data.push({
            category: item.name,
            sold,
            refunded,
            total: totalCollected
          });
        });
      } else {
        data.push({
          category: item.name,
          sold: 0,
          refunded: 0,
          total: 0
        });
      }
    });

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
                <DropdownButton title={outletName}>
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

                <DropdownButton title="Exports" style={{ margin: "0 1rem" }}>
                  <Dropdown.Item href="#/action-1">PDF</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Excel</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">CSV</Dropdown.Item>
                </DropdownButton>
              </Row>
            </div>
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
