import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {
  Dropdown,
  Row,
  Col,
  DropdownButton,
  Form,
  InputGroup
} from "react-bootstrap";
import { Paper } from "@material-ui/core";
import { CalendarToday, TodayOutlined, Schedule } from "@material-ui/icons";
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
import CustomTimeRangePicker from "../../components/CustomTimeRangePicker";
import ExportExcel from "react-html-table-to-excel";
import SalesPerHour from "./SalesPerHour";
import StockReport from "./StockReport";
import LoyaltiReport from "./LoyaltiReport";
import RawMaterial from "./RawMaterialTab"
import CommissionReport from "./CommissionReport";

export const ReportPage = () => {
  const [tabs, setTabs] = React.useState(1);
  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date());
  const [time, setTime] = React.useState("");
  const [showTimePicker, setShowTimePicker] = React.useState(false);
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
  const { t } = useTranslation();
  const tabData = [
    {
      no: 1,
      title: `${t("salesSummary")}`,
      table: "table-summary",
      filename: `transaksi-penjualan-produk_${startDate}-${endDate}`,
      Component: SalesSummaryTab
    },
    {
      no: 2,
      title: `${t("paymentMethod")}`,
      table: "table-payment",
      filename: `payment-method_${startDate}-${endDate}`,
      Component: PaymentMethodTab
    },
    {
      no: 3,
      title: `${t("salesType")}`,
      table: "table-sales",
      filename: `sales-type_${startDate}-${endDate}`,
      Component: SalesTypeTab
    },
    {
      no: 4,
      title: `${t("categorySales")}`,
      table: "table-category",
      filename: `table-category_${startDate}-${endDate}`,
      Component: CategorySalesTab
    },
    {
      no: 5,
      title: `${t("transactionHistory")}`,
      table: "table-history-transaction",
      filename: `riwayat-transaksi_${startDate}-${endDate}`,
      Component: TransactionHistoryTab
    },
    {
      no: 6,
      title: `${t("attendance")}`,
      table: "table-attendance-report",
      filename: `laporan-absensi_${startDate}-${endDate}`,
      Component: AttendanceTab
    },
    {
      no: 7,
      title: `${t("discountSales")}`,
      table: "table-discount",
      filename: `laporan-diskon_${startDate}-${endDate}`,
      Component: DiscountSalesTab
    },
    {
      no: 8,
      title: `${t("recap")}`,
      table: "table-recap",
      filename: `laporan-rekap_${startDate}-${endDate}`,
      Component: RecapTab
    },
    {
      no: 9,
      title: `${t("salesPerProduct")}`,
      table: "table-sales-per-product",
      filename: `laporan-penjualan-per-produk_${startDate}-${endDate}`,
      Component: SalesPerProductTab
    },
    {
      no: 10,
      title: `${t("costOfGoodSold")}`,
      table: "table-cogs",
      filename: `laporan-COGS_${startDate}-${endDate}`,
      Component: COGSReport
    },
    {
      no: 11,
      title: `${t("profitCalculation")}`,
      table: "table-profit",
      filename: `laporan-perhitunga-laba_${startDate}-${endDate}`,
      Component: ProfitReport
    },
    {
      no: 12,
      title: `${t("staffTransaction")}`,
      table: "table-staff-transaction",
      filename: `laporan-penjualan-staff_${startDate}-${endDate}`,
      Component: StaffTransaction
    },
    {
      no: 13,
      title: `${t("voidTransaction")}`,
      table: "table-void",
      filename: `laporan-transaksi-void/refund_${startDate}-${endDate}`,
      Component: VoidTransaction
    },
    {
      no: 14,
      title: `${t("salesPerHour")}`,
      table: "table-sales-per-hour",
      filename: `laporan-transaksi-penjualan-per-jam_${startDate}-${endDate}`,
      Component: SalesPerHour
    },
    {
      no: 15,
      title: `${t("stockReport")}`,
      table: "table-stock",
      filename: `laporan-stock-barang_${startDate}-${endDate}`,
      Component: StockReport
    },
    {
      no: 16,
      title: `${t("rawMaterial")}`,
      table: "table-raw-material-report",
      filename: `raw_material_report_${startDate}-${endDate}`,
      Component: RawMaterial
    },
    {
      no: 17,
      title: `${t("commissionReport")}`,
      table: "table-commission-report",
      filename: `commission_report${startDate}-${endDate}`,
      Component: CommissionReport
    },
    // {
    //   no: 16,
    //   title: "Loyalty report",
    //   table: "table-loyalty",
    //   filename: `laporan-loyalty_${startDate}-${endDate}`,
    //   Component: LoyaltiReport
    // }
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
    console.log('ini apa hyo', value)
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
      name: outlet ? outlet.Location?.name : "All Outlet"
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
    setEndDate(
      dayjs(endRange)
        .add(1, "days")
        .format("YYYY-MM-DD")
    );
    setStateCustom(false);
  };

  const handleSelectStatus = (e) => setStatus(e.target.value);

  const displayDate = () => {
    const start = dayjs(startDate).format("DD-MM-YYYY");
    const end = dayjs(endRange).format("DD-MM-YYYY");

    if (start === end) {
      return start;
    } else {
      return `${start} - ${end}`;
    }
  };
  const handleTimeStart = (date) => setStartTime(date);
  const handleTimeEnd = (date) => setEndTime(date);
  const handleSaveTime = () => {
    let time_start = dayjs(startTime).format("HH:mm");
    let end_time = dayjs(endTime).format("HH:mm");
    setTime(`${time_start} - ${end_time}`);
    setShowTimePicker(false);
  };
  console.log("baksoow", allOutlets)
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
      <CustomTimeRangePicker
        show={showTimePicker}
        handleClose={() => setShowTimePicker(false)}
        handleSave={handleSaveTime}
        startTime={startTime}
        endTime={endTime}
        handleStartTime={handleTimeStart}
        handleEndTime={handleTimeEnd}
      />
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div
              className="headerPage lineBottom"
              style={{ marginBottom: "1rem" }}
            >
              <div className="headerStart">
                <h3 style={{ margin: "0" }}>{t("report")}</h3>
              </div>

              <div className="headerEnd">
                <Row>
                  <DropdownButton
                    title={
                      tabData.find((item) => item.no === parseInt(tabs))
                        .title || "-"
                    }
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3,1fr)",
                        gridGap: "5px",
                        padding: "5px"
                      }}
                    >
                      {tabData.map((item) => {
                        return (
                          <Dropdown.Item
                            as="button"
                            key={item.no}
                            value={item.no}
                            onClick={handleSelectTab}
                            className="selected"
                            style={{
                              border: "1.5px solid #ccc",
                              borderRadius: "5px"
                            }}
                          >
                            {item.title}
                          </Dropdown.Item>
                        );
                      })}
                    </div>
                  </DropdownButton>

                  {tabData.find((item) => 
                  item.no === parseInt(tabs)).table ? (
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
                      buttonText={t("export")}
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
                      {t("outlet")}:
                    </Form.Label>
                    <Col>
                      <Form.Control
                        as="select"
                        name="outlet_id"
                        value={selectedOutlet.id}
                        onChange={handleSelectOutlet}
                      >
                        <option value="">{t("all")}</option>
                        {allOutlets.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
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
                      {t("date")}:
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
                            {t("status")}:
                          </Form.Label>
                          <Col>
                            <Form.Control
                              as="select"
                              name="status"
                              value={status}
                              onChange={handleSelectStatus}
                              onBlur={handleSelectStatus}
                            >
                              <option value={""}>{t("dashboard")}</option>
                              {[`${t("new")}`, `${t("done")}`, `${t("refund")}`, `${t("closed")}`].map(
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
                ) : tabs === "14" ? (
                  <Col>
                    <Row>
                      <Col>
                        <Form.Group as={Row}>
                          <Form.Label
                            style={{ alignSelf: "center", marginBottom: "0" }}
                          >
                            {t("time")} :
                          </Form.Label>
                          <Col>
                            <InputGroup>
                              <Form.Control
                                type="text"
                                value={time}
                                onClick={() =>
                                  setShowTimePicker(!showTimePicker)
                                }
                                style={{
                                  borderTopRightRadius: 0,
                                  borderBottomRightRadius: 0
                                }}
                                readOnly
                              />

                              <InputGroup.Append>
                                <InputGroup.Text>
                                  <Schedule />
                                </InputGroup.Text>
                              </InputGroup.Append>
                            </InputGroup>
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
                    startTime={startTime}
                    endTime={endTime}
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
