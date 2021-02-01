import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Paper } from "@material-ui/core";
import { Button, InputGroup, Form, Row, Col, Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Search, MoreHoriz } from "@material-ui/icons";

import ConfirmModal from "../../components/ConfirmModal";
import useDebounce from "../../hooks/useDebounce";

import "../style.css";

export const StaffPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState({
    time: "newest",
    role_id: "",
    outlet_id: ""
  });

  const [staff, setStaff] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allAccessLists, setAllAccessLists] = React.useState([]);
  const [filterPrivileges, setFilterPrivileges] = React.useState([]);
  const [allRoles, setAllRoles] = React.useState([]);
  const [staffInfo, setStaffInfo] = React.useState({
    id: "",
    name: ""
  });

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const debouncedSearch = useDebounce(search, 1000);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    setFilter(filterData);
  };

  const closeConfirmModal = () => setConfirmModal(false);
  const openConfirmModal = (data) => {
    setStaffInfo({ id: data.id, name: data.name });
    setConfirmModal(true);
  };

  const getStaffData = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterStaff = `?name=${search}&order=${filter.time}&outlet_id=${filter.outlet_id}&role_id=${filter.role_id}`;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/staff${filterStaff}`);
      setStaff(data.data);
    } catch (err) {
      setStaff([]);
    }
  };

  const handleDelete = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/staff/${id}`);
      setStaff(staff.filter((item) => item.id !== id));
      disableLoading();
      closeConfirmModal();
    } catch (err) {
      disableLoading();
    }
  };

  React.useEffect(() => {
    getStaffData(debouncedSearch, filter);
  }, [debouncedSearch, filter]);

  const getOutlets = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const outlets = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(outlets.data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  const getAccessPrivileges = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/access`);
      setAllAccessLists(data.data);
    } catch (err) {
      setAllAccessLists([]);
    }

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/privilege`);
      setFilterPrivileges(data.data);
    } catch (err) {
      setFilterPrivileges([]);
    }
  };

  const getRoles = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/role`);
      setAllRoles(data.data);
    } catch (err) {
      setAllRoles([]);
    }
  };

  React.useEffect(() => {
    getOutlets();
    getAccessPrivileges();
    getRoles();
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
      name: "Location",
      selector: "location",
      sortable: true
    },
    {
      name: "Role",
      selector: "role",
      sortable: true
    },
    // {
    //   name: "Type",
    //   selector: "type",
    //   sortable: true
    // },
    {
      name: "Actions",
      cell: (rows) => {
        return (
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              <MoreHoriz color="action" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Link
                to={{
                  pathname: `/staff/${rows.id}`,
                  state: {
                    allOutlets,
                    allRoles,
                    allAccessLists
                  }
                }}
              >
                <Dropdown.Item as="button">Staff Detail</Dropdown.Item>
              </Link>
              <Dropdown.Item as="button" onClick={() => openConfirmModal(rows)}>
                Delete Staff
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataStaff = staff.map((item, index) => {
    return {
      id: item.id,
      no: index + 1,
      name: item.name,
      location: item.Outlet.Location.name,
      // type: item.User.type
      role: item.User.Role.name
    };
  });

  return (
    <>
      <ConfirmModal
        title={`Delete Staff - ${staffInfo.name}`}
        body="Are you sure want to delete?"
        buttonColor="danger"
        state={confirmModal}
        closeModal={closeConfirmModal}
        handleClick={() => handleDelete(staffInfo.id)}
        loading={loading}
      />

      <Row>
        <Col md={12}>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>Staff - Main View</h3>
              </div>
              <div className="headerEnd">
                <Link
                  to={{
                    pathname: "/staff/add-staff",
                    state: {
                      allOutlets,
                      allAccessLists,
                      filterPrivileges,
                      allRoles
                    }
                  }}
                >
                  <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                    Add Staff
                  </Button>
                </Link>
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
                    value={search}
                    onChange={handleSearch}
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
                        value={filter.time}
                        onChange={handleFilter}
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
                        value={filter.outlet_id}
                        onChange={handleFilter}
                      >
                        <option value="">All</option>
                        {allOutlets.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.Location.name}
                            </option>
                          );
                        })}
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group as={Row}>
                    <Form.Label
                      style={{ alignSelf: "center", marginBottom: "0" }}
                    >
                      Role:
                    </Form.Label>
                    <Col>
                      <Form.Control
                        as="select"
                        name="role_id"
                        value={filter.role_id}
                        onChange={handleFilter}
                      >
                        <option value="">All</option>
                        {allRoles.map((item, index) => {
                          return (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
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
              data={dataStaff}
              style={{ minHeight: "100%" }}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
