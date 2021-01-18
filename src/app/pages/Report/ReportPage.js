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
  const [allTransactions, setAllTransactions] = React.useState([]);

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
      table: "sales-type",
      Component: SalesTypeTab
    },
    {
      no: 4,
      title: "Category Sales",
      table: "category-sales",
      Component: CategorySalesTab
    },
    {
      no: 5,
      title: "Transaction History",
      table: "transaction-history",
      Component: TransactionHistoryTab
    },
    {
      no: 6,
      title: "Attendance",
      table: "attendance",
      Component: AttendanceTab
    }
  ];

  const [reports, setReports] = React.useState([
    {
      product_name: "",
      addons_name: "",
      category_name: "",
      sku: "",
      totalItems: 0,
      grossSales: 0,
      discountSales: 0,
      totalSales: 0
    }
  ]);

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

  const getTransactions = async (id, start_range, end_range) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const outlet_id = id ? `?outlet_id=${id}&` : "?";

    if (start_range === end_range) {
      end_range = dayjs(end_range)
        .add(1, "day")
        .format("YYYY-MM-DD");
    }

    if (new Date(start_range) > new Date(end_range)) {
      start_range = dayjs(start_range)
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      end_range = dayjs(end_range)
        .add(1, "day")
        .format("YYYY-MM-DD");
    }

    let allSales;
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setAllTransactions(data.data);
      allSales = data.data;
    } catch (err) {
      if (err.response.status === 404) {
        setAllTransactions([]);
      }
      allSales = [];
      console.log(err);
    }

    const completedTransactions = allSales.filter(
      (item) => item.Payment?.status === "done"
    );

    const allItems = completedTransactions.map((item) => {
      const grossSales = item.Transaction_Items.reduce(
        (init, curr) => (init += curr.price_total + curr.price_discount),
        0
      );
      const discountSales = item.Transaction_Items.reduce(
        (init, curr) => (init += curr.price_discount),
        0
      );
      const totalSales = item.Transaction_Items.reduce(
        (init, curr) => (init += curr.price_total),
        0
      );

      const output = item.Transaction_Items.map((val) => {
        const currAddons = val.Transaction_Item_Addons.map(
          (addons) => addons.Addon?.name
        ).filter((val) => val);

        const joinedAddons = currAddons.length ? currAddons.join(",") : "";

        return {
          product_name: val.Product.name,
          addons_name: joinedAddons,
          category_name: val.Product.Product_Category.name,
          sku: val.Product.sku,
          totalItems: val.quantity,
          grossSales: grossSales,
          discountSales: discountSales,
          totalSales: totalSales
        };
      });

      return output;
    });

    const allProductNames = allItems.flat(1).reduce((init, curr) => {
      init[`${curr.product_name}-${curr.addons_name}`] = curr.category_name;
      return init;
    }, {});

    const compileReports = Object.keys(allProductNames).map((item) => {
      const name = item.split("-")[0];
      const addons = item.split("-")[1];
      const category = allProductNames[item];

      const sku = allItems
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init = curr.sku), "");

      const totalItems = allItems
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init += curr.totalItems), 0);

      const grossSales = allItems
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init += curr.grossSales), 0);

      const discountSales = allItems
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init += curr.discountSales), 0);

      const totalSales = allItems
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init += curr.totalSales), 0);

      return {
        product_name: name,
        addons_name: addons,
        category_name: category,
        sku,
        totalItems,
        grossSales,
        discountSales,
        totalSales
      };
    });

    setReports(compileReports);
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
              </Row>
            </div>

            {tabData.map((item, index) => {
              if (item.no === parseInt(tabs)) {
                return (
                  <item.Component
                    key={index}
                    getTransactions={getTransactions}
                    allTransactions={allTransactions}
                    reports={reports}
                    selectedOutlet={selectedOutlet}
                    startDate={startDate}
                    endDate={endDate}
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
