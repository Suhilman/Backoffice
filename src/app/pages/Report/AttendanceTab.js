import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Row,
  Col,
  Form,
  Dropdown,
  ListGroup,
  DropdownButton
} from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Paper } from "@material-ui/core";
// import { Search, MoreHoriz } from "@material-ui/icons";
import ExportExcel from "react-html-table-to-excel";

import "../style.css";

export const AttendanceTab = ({ allOutlets, ranges }) => {
  const [outletId, setOutletId] = React.useState("");
  const [outletName, setOutletName] = React.useState("All Outlets");

  const [rangeId, setRangeId] = React.useState(1);
  const [rangeName, setRangeName] = React.useState("Today");

  const [startRange, setStartRange] = React.useState(new Date());
  const [endRange, setEndRange] = React.useState(new Date());

  const [allAttendances, setAllAttendances] = React.useState([]);

  const [status, setStatus] = React.useState("");

  const [reports, setReports] = React.useState([
    {
      user: {
        email: "",
        name: "",
        phone_number: ""
      },
      date: "",
      check_in: "",
      check_out: ""
    }
  ]);

  const getAttendances = async (
    id,
    status,
    range_id,
    start_range,
    end_range
  ) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const { date_start, date_end } = ranges(start_range, end_range).find(
      (item) => item.id === range_id
    );

    const outlet_id = id ? `outlet_id=${id}` : "";
    const filter = status ? `&status=${status}` : "";

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/attendance?${outlet_id}&start_date=${date_start}&end_date=${date_end}${filter}`
      );
      setAllAttendances(data.data);

      const compileReports = data.data.map((item) => {
        return {
          user: {
            email: item.User.email,
            name: item.User.User_Profile.name,
            phone_number: item.User.User_Profile.phone_number
          },
          outlet: item.Outlet.name,
          date: item.createdAt,
          check_in: item.clock_in,
          check_out: item.clock_out
        };
      });

      setReports(compileReports);
    } catch (err) {
      setAllAttendances([]);
      console.log(err);
    }
  };

  React.useEffect(() => {
    getAttendances(outletId, status, rangeId, startRange, endRange);
  }, [outletId, status, rangeId, startRange, endRange]);

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

  const filename = () => {
    const value = ranges(startRange, endRange).find(
      (item) => item.id === rangeId
    ).valueId;
    const date = ranges(startRange, endRange).find(
      (item) => item.id === rangeId
    ).displayDate;

    const processValue = value
      .split(" ")
      .join("-")
      .toLowerCase();
    return `laporan-absensi-${processValue}_${date}`;
  };

  const columns = [
    {
      name: "No.",
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: "Staff Name",
      selector: "staff_name",
      sortable: true
    },
    {
      name: "Outlet",
      selector: "outlet_name",
      sortable: true
    },
    {
      name: "Check In Time",
      selector: "check_in",
      sortable: true
    },
    {
      name: "Check Out Time",
      selector: "check_out",
      sortable: true
    }
  ];

  const dataAttendances = () => {
    return allAttendances.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
        staff_name: item.User.User_Profile.name,
        outlet_name: item.Outlet?.name || "-",
        check_in: dayjs(item.clock_in).format("DD/MM/YYYY HH:mm"),
        check_out: item.clock_out
          ? dayjs(item.clock_out).format("DD/MM/YYYY HH:mm")
          : "-",
        check_in_image: item.image_in,
        check_out_image: item.image_out
      };
    });
  };

  const ExpandableComponent = ({ data }) => {
    const keys = [
      {
        key: "Check In Image",
        value: "check_in_image"
      },
      {
        key: "Check Out Image",
        value: "check_out_image"
      }
    ];

    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          <ListGroup.Item>
            <Row>
              <Col sm={4}></Col>
              <Col style={{ fontWeight: "700" }}>Check In Image</Col>
              <Col style={{ fontWeight: "700" }}>Check Out Image</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col sm={4}></Col>
              {keys.map((val, index) => {
                return (
                  <Col key={index}>
                    {data[val.value] ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}${
                          data[val.value]
                        }`}
                        alt="attendance-img"
                        style={{
                          width: "120px",
                          height: "auto"
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </Col>
                );
              })}
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </>
    );
  };

  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-attendance-report">
          <thead>
            <tr>
              <th>Laporan Absensi</th>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>Tanggal</th>
              <td>
                {
                  ranges(startRange, endRange).find(
                    (item) => item.id === rangeId
                  ).displayDate
                }
              </td>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>Tanggal & Waktu</th>
              <th>Nama Staff</th>
              <th>Outlet</th>
              <th>Check In Time</th>
              <th>Check Out Time</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{dayjs(item.date).format("DD/MM/YYYY")}</td>
                  <td>{item.user.name}</td>
                  <td>{item.outlet}</td>
                  <td>
                    {item.check_in ? dayjs(item.check_in).format("HH:mm") : "-"}
                  </td>
                  <td>
                    {item.check_out
                      ? dayjs(item.check_out).format("HH:mm")
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>Attendance Report</h3>
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
                    style={{ margin: "0 1rem" }}
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

                  <ExportExcel
                    className="btn btn-outline-primary"
                    table="table-attendance-report"
                    filename={filename()}
                    sheet="attendance-report"
                    buttonText="Export"
                  />
                </Row>
              </div>
            </div>

            {/* <div className="filterSection lineBottom">
              <Row>
                <Col md={6}>
                  <Row>
                    <Col>
                      <Form.Group as={Row}>
                        <Form.Label
                          style={{ alignSelf: "center", marginBottom: "0" }}
                        >
                          Status:
                        </Form.Label>
                        <Col>
                          <Form.Control
                            as="select"
                            name="status"
                            value={status}
                            onChange={handleSelectStatus}
                            onBlur={handleSelectStatus}
                          >
                            <option value={""}>All Status</option>
                            {["New", "Done", "Refund", "Closed"].map(
                              (item, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={item.toLowerCase()}
                                  >
                                    {item}
                                  </option>
                                );
                              }
                            )}
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
                  ranges(startRange, endRange).find(
                    (item) => item.id === rangeId
                  ).displayDate
                }
              </p>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataAttendances()}
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
