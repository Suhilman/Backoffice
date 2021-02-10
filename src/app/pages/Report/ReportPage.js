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
import { DiscountSalesTab } from "./DiscountTab";
import { RecapTab } from "./RecapTab";
import { SalesPerProductTab } from "./SalesPerProductTab";
import COGSReport from "./COGSReport";
import ProfitReport from "./ProfitReport";
import StaffTransaction from "./StaffTransaction";
import VoidTransaction from "./VoidTransaction";
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
    },
    {
      no: 7,
      title: "Discount Sales",
      // table: "table-attendance-report",
      // filename: `laporan-absensi_${startDate}-${endDate}`,
      Component: DiscountSalesTab
    },
    {
      no: 8,
      title: "Recap",
      table: "table-recap",
      filename: `laporan-rekap_${startDate}-${endDate}`,
      Component: RecapTab
    },
    {
      no: 9,
      title: "Sales Per Product",
      table: "table-sales-per-product",
      filename: `laporan-penjualan-per-produk_${startDate}-${endDate}`,
      Component: SalesPerProductTab
    },
    {
      no: 10,
      title: "Cost of Good Sold",
      table: "table-cogs",
      filename: `laporan-COGS_${startDate}-${endDate}`,
      Component: COGSReport
    },
    {
      no: 11,
      title: "Profit Calculation",
      table: "table-profit",
      filename: `laporan-perhitunga-laba_${startDate}-${endDate}`,
      Component: ProfitReport
    },
    {
      no: 12,
      title: "Staff Transaction",
      table: "table-staff-transaction",
      filename: `laporan-penjualan-staff_${startDate}-${endDate}`,
      Component: StaffTransaction
    },
    {
      no: 13,
      title: "Void Transaction",
      table: "table-void",
      filename: `laporan-transaksi-void/refund_${startDate}-${endDate}`,
      Component: VoidTransaction
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
