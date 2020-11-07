import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Paper } from "@material-ui/core";
import { Button, InputGroup, Form, Row, Col, Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Search, MoreHoriz } from "@material-ui/icons";

export const CustomerPage = () => {
  const [customers, setCustomers] = React.useState([]);

  const getCustomer = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/customer`);
      setCustomers(data.data);
    } catch (err) {
      setCustomers([]);
    }
  };

  React.useEffect(() => {
    getCustomer();
  }, []);

  const columns = [
    {
      name: "No.",
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: "Name",
      selector: "name",
      sortable: true
    },
    {
      name: "Actions",
      cell: (rows) => {
        return (
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              <MoreHoriz color="action" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {/*<Link
                to={{
                  pathname: `/staff/${rows.id}`,
                  state: {
                    allOutlets,
                    allRoles,
                    allAccessLists
                  }
                }}
              >*/}
              <Dropdown.Item as="button">Customer Detail</Dropdown.Item>
              {/*</Link>*/}
              <Dropdown.Item
                as="button"
                // onClick={() => openConfirmModal(rows)}
              >
                Delete Customer
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataCustomer = customers.map((item, index) => {
    return {
      id: item.id,
      no: index + 1,
      name: item.name
    };
  });

  return (
    <>
      <Row>
        <Col md={12}>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>Customer Management</h3>
              </div>
              <div className="headerEnd">
                {/*<Link
                  to={{
                    pathname: "/staff/add-staff",
                    state: {
                      allOutlets,
                      allAccessLists,
                      filterPrivileges,
                      allRoles
                    }
                  }}
                >*/}
                <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                  Add Customer
                </Button>
                {/*</Link>*/}
              </div>
            </div>

            <div className="filterSection lineBottom">
              <Row>
                <InputGroup className="pb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text style={{ background: "transparent" }}>
                      <Search />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    placeholder="Search..."
                    // value={search}
                    // onChange={handleSearch}
                  />
                </InputGroup>
              </Row>

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
                        // value={filter.time}
                        // onChange={handleFilter}
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group as={Row}>
                    <Form.Label
                      style={{ alignSelf: "center", marginBottom: "0" }}
                    >
                      Location:
                    </Form.Label>
                    <Col>
                      <Form.Control
                        as="select"
                        name="outlet_id"
                        // value={filter.outlet_id}
                        // onChange={handleFilter}
                      >
                        <option value="">All</option>
                        {/*{allOutlets.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.Location.name}
                            </option>
                          );
                        })}*/}
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group as={Row}>
                    <Form.Label
                      style={{ alignSelf: "center", marginBottom: "0" }}
                    >
                      Type:
                    </Form.Label>
                    <Col>
                      <Form.Control
                        as="select"
                        name="type"
                        // value={filter.type}
                        // onChange={handleFilter}
                      >
                        <option value="">All</option>
                        {/*{["Kasir", "Waiter", "Staff", "Manager"].map(
                          (item, index) => {
                            return (
                              <option key={index} value={item}>
                                {item}
                              </option>
                            );
                          }
                        )}*/}
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
