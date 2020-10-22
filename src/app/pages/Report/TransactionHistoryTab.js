import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Row,
  Col,
  Button,
  Form,
  Dropdown,
  InputGroup,
  ListGroup,
  DropdownButton
} from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Paper } from "@material-ui/core";
import { Search, MoreHoriz } from "@material-ui/icons";

import "../style.css";

export const TransactionHistoryTab = ({ allOutlets, ranges }) => {
  const [outletId, setOutletId] = React.useState("");
  const [outletName, setOutletName] = React.useState("All Outlets");

  const [rangeId, setRangeId] = React.useState(1);
  const [rangeName, setRangeName] = React.useState("Today");

  const [startRange, setStartRange] = React.useState(new Date());
  const [endRange, setEndRange] = React.useState(new Date());

  const [allTransactions, setAllTransactions] = React.useState([]);

  const getTransactions = async (id, range_id, start_range, end_range) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const { date_start, date_end } = ranges(start_range, end_range).find(
      (item) => item.id === range_id
    );

    const outlet_id = id ? `&outlet_id=${id}` : "";

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction?order=newest&per_page=999${outlet_id}&date_start=${date_start}&date_end=${date_end}`
      );
      setAllTransactions(data.data);
    } catch (err) {
      if (err.response.status === 404) {
        setAllTransactions([]);
      }
      console.log(err);
    }
  };

  React.useEffect(() => {
    getTransactions(outletId, rangeId, startRange, endRange);
  }, [outletId, rangeId, startRange, endRange]);

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

  const columns = [
    {
      name: "No.",
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: "Receipt ID",
      selector: "receipt_id",
      sortable: true
    },
    {
      name: "Outlet Name",
      selector: "outlet_name",
      sortable: true
    },
    {
      name: "Payment Total",
      selector: "payment_total",
      sortable: true
    },
    {
      name: "Created At",
      selector: "created_at",
      sortable: true
    },
    {
      name: "Status",
      selector: "status",
      sortable: true
    }
  ];

  const dataTransactions = () => {
    return allTransactions.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
        receipt_id: item.receipt_id,
        payment_total: item.Payment?.payment_total || 0,
        outlet_name: item.Outlet.name,
        created_at: dayjs(item.createdAt).format("DD-MM-YYYY HH:mm:ss"),
        status: item.status,
        items: item.Transaction_Items
      };
    });
  };

  const ExpandableComponent = ({ data }) => {
    const head = ["Sales Type", "Product", "Addons", "Quantity", "Price"];
    const body = data.items.map((item) => {
      const addons = item.Transaction_Item_Addons.map((val) => val.Addon.name);

      return [
        item.Sales_Type.name,
        item.Product.name,
        addons.join(","),
        item.quantity,
        item.price_product
      ];
    });

    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          <ListGroup.Item>
            <Row>
              {head.map((item, index) => {
                return (
                  <Col key={index} style={{ fontWeight: "700" }}>
                    {item}
                  </Col>
                );
              })}
            </Row>
          </ListGroup.Item>
          {body.map((item, index) => {
            return (
              <ListGroup.Item key={index}>
                <Row>
                  {item.map((val, valIndex) => {
                    return <Col key={valIndex}>{val}</Col>;
                  })}
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </>
    );
  };

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>Transaction History</h3>
            </div>
            <div className="headerEnd">
              {/* <Button
                variant="primary"
                style={{ marginLeft: "0.5rem" }}
                // onClick={showAddModalOutlet}
              >
                Add New Outlet
              </Button> */}
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

          {/* <div className="filterSection lineBottom">
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
                <Row>
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
                          {allStatuses.map((item, index) => {
                            return (
                              <option key={index} value={item.toLowerCase()}>
                                {item}
                              </option>
                            );
                          })}
                        </Form.Control>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div> */}

          <div
            style={{
              paddingRight: "1rem",
              paddingTop: "1rem",
              textAlign: "right"
            }}
          >
            <p>
              <b>Date:</b>{" "}
              {
                ranges(startRange, endRange).find((item) => item.id === rangeId)
                  .displayDate
              }
            </p>
          </div>

          <DataTable
            noHeader
            pagination
            columns={columns}
            data={dataTransactions()}
            expandableRows
            expandableRowsComponent={<ExpandableComponent />}
            style={{ minHeight: "100%" }}
          />
        </Paper>
      </Col>
    </Row>
  );
};
