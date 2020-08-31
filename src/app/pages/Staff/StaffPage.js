import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  CssBaseline,
  Button,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Paper
} from "@material-ui/core";
import { Search, MoreHoriz } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import {
  InputGroup,
  FormControl,
  Form,
  Row,
  Col,
  Dropdown,
  Spinner
} from "react-bootstrap";
import { useSubheader } from "../../../_metronic/layout";
import Table from "../../components/Table";
import ConfirmModal from "../../components/ConfirmModal";

const useStyles = makeStyles({
  header: {
    padding: "1rem",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    position: "relative",
    borderBottom: "1px solid #ebedf2",
    width: "100%"
  },
  headerStart: {
    alignContent: "flex-start"
  },
  headerEnd: {
    alignContent: "flex-end"
  },
  margin: {
    margin: "1rem"
  },
  paperForm: {
    padding: "1rem"
  },
  paperHeader: {
    padding: "1rem",
    borderBottom: "1px solid #ebedf2"
  },
  filter: {
    marginTop: "10px",
    marginBottom: "10px"
  },
  divider: {
    borderBottom: "1px solid #ebedf2"
  }
});

export const StaffPage = () => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Staff");

  const classes = useStyles();

  const API_URL = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [staff, setStaff] = React.useState([]);
  const [staffId, setStaffId] = React.useState("");

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleSearch = event => {
    setSearch(event.target.value);
  };

  const closeConfirmModal = () => setConfirmModal(false);
  const openConfirmModal = () => setConfirmModal(true);

  const getStaffData = async search => {
    try {
      if (search) {
        const { data } = await axios.get(
          `${API_URL}/api/v1/staff?name=${search}`
        );
        setStaff(data.data);
      } else {
        const { data } = await axios.get(`${API_URL}/api/v1/staff`);
        setStaff(data.data);
      }
    } catch (err) {
      setStaff([]);
    }
  };

  const handleDelete = async id => {
    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/staff/${id}`);
      setStaff(staff.filter(item => item.id !== id));
      disableLoading();
      closeConfirmModal();
    } catch (err) {
      disableLoading();
    }
  };

  React.useEffect(() => {
    getStaffData(search);
  }, [search]);

  const action = data => {
    setStaffId(data.id);

    return (
      <Dropdown>
        <Dropdown.Toggle variant="secondary">
          <MoreHoriz color="action" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Link to={`/staff/${data.id}`}>
            <Dropdown.Item as="button">Staff Detail</Dropdown.Item>
          </Link>
          <Dropdown.Item as="button" onClick={openConfirmModal}>
            Delete Staff
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Location",
        accessor: "location"
      },
      {
        Header: "Type",
        accessor: "type"
      },
      {
        Header: "Actions",
        Cell: ({ row }) => action(row.original)
      }
    ],
    []
  );

  const data = React.useMemo(() => {
    return staff.map(item => {
      return {
        id: item.id,
        name: item.name,
        location: item.Outlet.Location.name,
        type: item.User.type
      };
    });
  }, [staff]);

  return (
    <>
      <CssBaseline />

      <ConfirmModal
        title="Delete Staff"
        body="Are you sure want to delete?"
        buttonColor="danger"
        state={confirmModal}
        closeModal={closeConfirmModal}
        handleClick={() => handleDelete(staffId)}
        loading={loading}
      />

      <div className="row">
        <div className="col-md-12">
          <Paper elevation={1} className={classes.paperForm}>
            <div className={classes.header}>
              <div className={classes.headerStart}>
                <h3>Staff - Main View</h3>
              </div>
              <div className={classes.headerEnd}>
                <Link to="/staff/add-staff">
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ color: "white" }}
                  >
                    Add Staff
                  </Button>
                </Link>
              </div>
            </div>

            <div className={`${classes.filter} ${classes.divider}`}>
              <InputGroup className={`pb-3 ${classes.divider}`}>
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <Search />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="Search..."
                  value={search}
                  onChange={handleSearch}
                />
              </InputGroup>

              <Form className="pt-3">
                <Form.Row>
                  <Col>
                    <Form.Group as={Row}>
                      <Form.Label column sm={2}>
                        Time
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control as="select" defaultValue={"Default"}>
                          <option value="Default" disabled hidden>
                            Nothing Selected
                          </option>
                          <option>Newest</option>
                          <option>Oldest</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group as={Row}>
                      <Form.Label column sm={2}>
                        Outlet
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control as="select" defaultValue={"Default"}>
                          <option value="Default" disabled hidden>
                            Nothing Selected
                          </option>
                          <option>Newest</option>
                          <option>Oldest</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group as={Row}>
                      <Form.Label column sm={2}>
                        Type
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control as="select" defaultValue={"Default"}>
                          <option value="Default" disabled hidden>
                            Nothing Selected
                          </option>
                          <option>Newest</option>
                          <option>Oldest</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>
                  </Col>
                </Form.Row>
              </Form>
            </div>

            <Table columns={columns} data={data} />

            <Row className="mt-5">
              <Col md={12}>
                <Row>
                  <Col md={2}>
                    <Form.Control as="select" defaultValue="10">
                      <option>20</option>
                      <option>30</option>
                    </Form.Control>
                  </Col>
                  <Col md={10} style={{ alignSelf: "center" }}>
                    Showing 1 - 7 of 7
                  </Col>
                </Row>
              </Col>
            </Row>
          </Paper>
        </div>
      </div>
    </>
  );
};
