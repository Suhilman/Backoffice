import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Paper } from "@material-ui/core";
import { Button, InputGroup, Form, Row, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";

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

  const dataCustomer = inventory.map((item, index) => {
    let adjusment = 0;
    let incoming_stock = 0;
    let outcoming_stock = 0;

    if (item.Product_Adjusment) {
      const difference =
        item.Product_Adjusment.stock_current -
        item.Product_Adjusment.stock_previous;
      adjusment = difference < 1 ? difference : "+" + difference;
    }

    if (item.Incoming_Stock_Products.length) {
      item.Incoming_Stock_Products.forEach(
        (item) => (incoming_stock += item.quantity)
      );
    }

    if (item.Outcoming_Stock_Products.length) {
      item.Outcoming_Stock_Products.forEach(
        (item) => (outcoming_stock += item.quantity)
      );
    }

    return {
      id: item.id,
      no: index + 1,
      outlet_name: item.Outlet.name,
      name: item.name,
      stock: item.stock,
      stock_starting: item.stock_starting,
      incoming_stock,
      outcoming_stock,
      adjusment
    };
  });

  return (
    <>
      <Row>
        <Col md={12}>
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
              data={dataCustomer}
              style={{ minHeight: "100%" }}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};

export default InventoryTab;
