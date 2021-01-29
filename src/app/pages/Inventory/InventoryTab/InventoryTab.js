import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Paper } from "@material-ui/core";
import { Button, InputGroup, Form, Row, Col, ListGroup } from "react-bootstrap";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";

import { Search } from "@material-ui/icons";
import useDebounce from "../../../hooks/useDebounce";

const InventoryTab = ({ refresh }) => {
  // const [alert, setAlert] = React.useState("");
  // const [loading, setLoading] = React.useState(false);

  const [search, setSearch] = React.useState("");
  // const debouncedSearch = useDebounce(search, 1000);

  const [filter, setFilter] = React.useState({
    time: "newest"
  });

  const [inventory, setInventory] = React.useState([]);

  const getInventory = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    // const filterCustomer = `?name=${search}&sort=${filter.time}`;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product`);
      setInventory(data.data);
    } catch (err) {
      setInventory([]);
    }
  };

  React.useEffect(() => {
    getInventory();
  }, [refresh]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    setFilter(filterData);
  };

  const columns = [
    {
      name: "No.",
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: "Outlet Name",
      selector: "outlet_name",
      sortable: true
    },
    {
      name: "Name",
      selector: "name",
      sortable: true
    },
    {
      name: "Starting Stock",
      selector: "stock_starting",
      sortable: true
    },
    {
      name: "Current Stock",
      selector: "stock",
      sortable: true
    },
    {
      name: "Incoming Stock",
      selector: "incoming_stock",
      sortable: true
    },
    {
      name: "Outcoming Stock",
      selector: "outcoming_stock",
      sortable: true
    },
    {
      name: "Adjusment",
      selector: "adjusment",
      sortable: true
    }
  ];

  const dataInventory = inventory.map((item, index) => {
    let adjusment = 0;
    let incoming_stock = 0;
    let outcoming_stock = 0;

    if (item.Product_Adjusment) {
      const difference =
        item.Product_Adjusment.stock_current -
        item.Product_Adjusment.stock_previous;
      adjusment = difference < 1 ? difference : "+" + difference;
    }

    if (item.Stocks.length) {
      for (const val of item.Stocks) {
        if (val.Incoming_Stock?.Incoming_Stock_Products.length) {
          for (const stock of val.Incoming_Stock.Incoming_Stock_Products) {
            incoming_stock += stock.quantity;
          }
        }

        if (val.Outcoming_Stock_Products.length) {
          for (const stock of val.Outcoming_Stock_Products) {
            outcoming_stock += stock.quantity;
          }
        }
      }
    }

    return {
      id: item.id,
      no: index + 1,
      outlet_name: item.Outlet?.name,
      name: item.name,
      stock: item.stock,
      stock_starting: item.stock_starting,
      incoming_stock,
      outcoming_stock,
      adjusment,
      stocks: item.Stocks
    };
  });

  const ExpandableComponent = ({ data }) => {
    const stockData = data.stocks.map((item) => {
      return {
        batch: item.Incoming_Stock
          ? item.Incoming_Stock.code
          : item.Transfer_Stock
          ? item.Transfer_Stock.code
          : "-",
        stock: item.stock || 0,
        unit: item.Unit?.name || "-",
        expired_date: item.expired_date
          ? dayjs(item.expired_date).format("DD-MMM-YYYY")
          : "-"
      };
    });

    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          <ListGroup.Item>
            <Row>
              <Col style={{ fontWeight: "700" }}>Batch</Col>
              <Col style={{ fontWeight: "700" }}>Stock</Col>
              <Col style={{ fontWeight: "700" }}>Unit</Col>
              <Col style={{ fontWeight: "700" }}>Expired Date</Col>
            </Row>
          </ListGroup.Item>
          {stockData.length ? (
            stockData.map((val, index) => {
              return (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col>{val.batch}</Col>
                    <Col>{val.stock}</Col>
                    <Col>{val.unit}</Col>
                    <Col>{val.expired_date}</Col>
                  </Row>
                </ListGroup.Item>
              );
            })
          ) : (
            <ListGroup.Item>
              <Row>
                <Col>-</Col>
                <Col>-</Col>
                <Col>-</Col>
              </Row>
            </ListGroup.Item>
          )}
        </ListGroup>
      </>
    );
  };

  return (
    <>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>Inventory Management</h3>
              </div>
              <div className="headerEnd">
                <Link to={{ pathname: "/inventory/incoming-stock" }}>
                  <Button variant="primary">Incoming Stock</Button>
                </Link>

                <Link to={{ pathname: "/inventory/outcoming-stock" }}>
                  <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                    Outcoming Stock
                  </Button>
                </Link>

                <Link to={{ pathname: "/inventory/transfer-stock" }}>
                  <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                    Transfer Stock
                  </Button>
                </Link>

                <Link to={{ pathname: "/inventory/stock-opname" }}>
                  <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                    Stock Opname
                  </Button>
                </Link>
              </div>
            </div>

            <div className="filterSection lineBottom">
              <Row>
                <Col>
                  <InputGroup className="pb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text style={{ background: "transparent" }}>
                        <Search />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      placeholder="Search..."
                      value={search}
                      onChange={handleSearch}
                    />
                  </InputGroup>
                </Col>

                <Col>
                  <Form.Group as={Row}>
                    <Form.Label
                      style={{ alignSelf: "center", marginBottom: "0" }}
                    >
                      Time:
                    </Form.Label>
                    <Col>
                      <Form.Control
                        as="select"
                        name="time"
                        value={filter.time}
                        onChange={handleFilter}
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataInventory}
              expandableRows
              expandableRowsComponent={<ExpandableComponent />}
              style={{ minHeight: "100%" }}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};

export default InventoryTab;
