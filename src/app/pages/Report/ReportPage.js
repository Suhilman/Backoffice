import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Dropdown,
  Row,
  Col,
  DropdownButton,
  Form,
  InputGroup
} from "react-bootstrap";
import { Paper } from "@material-ui/core";
import { CalendarToday, TodayOutlined } from "@material-ui/icons";

import { SalesSummaryTab } from "./SalesSummaryTab";
import { PaymentMethodTab } from "./PaymentMethodTab";
import { SalesTypeTab } from "./SalesTypeTab";
import { CategorySalesTab } from "./CategorySalesTab";
import { TransactionHistoryTab } from "./TransactionHistoryTab";
import { AttendanceTab } from "./AttendanceTab";

import CustomDateRange from "../../components/CustomDateRange";
import ExportExcel from "react-html-table-to-excel";

export const ReportPage = () => {
  const [tabs, setTabs] = React.useState(1);

  const [allOutlets, setAllOutlets] = React.useState([]);
  const [selectedOutlet, setSelectedOutlet] = React.useState({
    id: "",
    name: ""
  });

  const [startRange, setStartRange] = React.useState(new Date());
  const [endRange, setEndRange] = React.useState(new Date());

  const [startDate, setStartDate] = React.useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = React.useState(dayjs().format("YYYY-MM-DD"));
  const [stateCustom, setStateCustom] = React.useState(false);
  const [status, setStatus] = React.useState("");

  const tabData = [
    {
      no: 1,
      title: "Sales Summary",
      table: "table-summary",
      filename: `transaksi-penjualan-produk_${startDate}-${endDate}`,
      Component: SalesSummaryTab
    },
    {
      no: 2,
      title: "Payment Method",
      Component: PaymentMethodTab
    },
    {
      no: 3,
      title: "Sales Type",
      Component: SalesTypeTab
    },
    {
      no: 4,
      title: "Category Sales",
      Component: CategorySalesTab
    },
    {
      no: 5,
      title: "Transaction History",
      table: "table-history-transaction",
      filename: `riwayat-transaksi_${startDate}-${endDate}`,
      Component: TransactionHistoryTab
    },
    {
      no: 6,
      title: "Attendance",
      table: "table-attendance-report",
      filename: `laporan-absensi_${startDate}-${endDate}`,
      Component: AttendanceTab
    }
  ];

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

  React.useEffect(() => {
    getOutlets();
  }, []);

  const handleSelectTab = (e) => {
    const { value } = e.target;
    setTabs(value);

    setSelectedOutlet({
      id: "",
      name: "All Outlet"
    });

    const today = new Date();
    setStartRange(today);
    setEndRange(today);

    setStartDate(dayjs(today).format("YYYY-MM-DD"));
    setEndDate(dayjs(today).format("YYYY-MM-DD"));
  };

  const handleSelectOutlet = (e) => {
    const { value } = e.target;

    let outlet;
    if (value) {
      outlet = allOutlets.find((item) => item.id === parseInt(value));
    }

    setSelectedOutlet({
      id: value,
      name: outlet ? outlet.Location.name : "All Outlet"
    });
  };

  const handleStartRange = ({ selection }) => {
    const { startDate: start, endDate: end } = selection;
    setStartRange(start);
    setEndRange(end);
  };

  const handleOpenCustom = () => setStateCustom(true);
  const handleCloseCustom = () => {
    setStartRange(new Date(startDate));
    setEndRange(new Date(endDate));
    setStateCustom(false);
  };
  const handleSaveCustom = () => {
    setStartDate(dayjs(startRange).format("YYYY-MM-DD"));
    setEndDate(dayjs(endRange).format("YYYY-MM-DD"));
    setStateCustom(false);
  };

  const handleSelectStatus = (e) => setStatus(e.target.value);

  const displayDate = () => {
    const start = dayjs(startDate).format("DD-MM-YYYY");
    const end = dayjs(endDate).format("DD-MM-YYYY");

    if (start === end) {
      return start;
    } else {
      return `${start} - ${end}`;
    }
  };

  return (
    <>
      <CustomDateRange
        show={stateCustom}
        handleClose={handleCloseCustom}
        handleSave={handleSaveCustom}
        startRange={startRange}
        endRange={endRange}
        handleStartRange={handleStartRange}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div
              className="headerPage lineBottom"
              style={{ marginBottom: "1rem" }}
            >
              <div className="headerStart">
                <h3 style={{ margin: "0" }}>Report</h3>
              </div>

              <div className="headerEnd">
                <Row>
                  <DropdownButton
                    title={
                      tabData.find((item) => item.no === parseInt(tabs))
                        .title || "-"
                    }
                  >
                    {tabData.map((item) => {
                      return (
                        <Dropdown.Item
                          as="button"
                          key={item.no}
                          value={item.no}
                          onClick={handleSelectTab}
                        >
                          {item.title}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>

                  {tabData.find((item) => item.no === parseInt(tabs)).table ? (
                    <ExportExcel
                      className="btn btn-outline-primary ml-2"
                      table={
                        tabData.find((item) => item.no === parseInt(tabs))
                          .table || ""
                      }
                      filename={
                        tabData.find((item) => item.no === parseInt(tabs))
                          .filename || `laporan_${startDate}-${endDate}`
                      }
                      sheet="transaction-report"
                      buttonText="Export"
                    />
                  ) : (
                    ""
                  )}
                </Row>
              </div>
            </div>

            <div className="filterSection lineBottom">
              <Row>
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
                        value={selectedOutlet.id}
                        onChange={handleSelectOutlet}
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
                      Date:
                    </Form.Label>
                    <Col>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          value={displayDate()}
                          onClick={handleOpenCustom}
                          style={{
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0
                          }}
                          readOnly
                        />

                        <InputGroup.Append>
                          <InputGroup.Text>
                            <CalendarToday />
                          </InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </Col>
                  </Form.Group>
                </Col>

                {tabs === "5" ? (
                  <Col>
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
                ) : (
                  ""
                )}
              </Row>
            </div>

            {tabData.map((item, index) => {
              if (item.no === parseInt(tabs)) {
                return (
                  <item.Component
                    key={index}
                    selectedOutlet={selectedOutlet}
                    startDate={startDate}
                    endDate={endDate}
                    status={status}
                  />
                );
              } else {
                return "";
              }
            })}
          </Paper>
        </Col>
      </Row>
    </>
  );
};
