/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import rupiah from "rupiah-format";

import SVG from "react-inlinesvg";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { Dropdown } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../_helpers";
import { useHtmlClassService } from "../../../layout";
import { DropdownMenu2 } from "../../dropdowns";

import sum from "./helpers/sum";

export function MixedWidget1({ className }) {
  const uiService = useHtmlClassService();

  const [allOutlets, setAllOutlets] = React.useState([]);
  const [outletName, setOutletName] = React.useState("All Outlets");

  const [yesterdayTransactions, setYesterdayTransactions] = React.useState([]);
  const [todayTransactions, setTodayTransactions] = React.useState([]);

  const [yesterdaySales, setYesterdaySales] = React.useState(0);
  const [todaySales, setTodaySales] = React.useState(0);
  const [sixMonthsSales, setSixMonthsSales] = React.useState([
    0,
    0,
    0,
    0,
    0,
    0
  ]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
  ];

  const allSixMonths = new Array(6);
  let thisMonth = new Date().getMonth();

  for (let index = allSixMonths.length; index !== 0; index--) {
    allSixMonths[index] = thisMonth--;
  }

  allSixMonths.shift();
  const currentMonths = allSixMonths.map((item) => months[item]);

  const getOutlets = async () => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getTransactions = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const todayStartDate = dayjs().format("YYYY-MM-DD");
    const todayEndDate = dayjs()
      .add(1, "day")
      .format("YYYY-MM-DD");

    const yesterdayStartDate = dayjs()
      .subtract(1, "day")
      .format("YYYY-MM-DD");
    const yesterdayEndDate = dayjs().format("YYYY-MM-DD");

    const combineAllSales = (data) => {
      return data
        .map((item) => item.Transaction_Items)
        .map((item) => item.map((val) => val.subtotal))
        .flat(1);
    };

    if (id) {
      try {
        const yesterday = await axios.get(
          `${API_URL}/api/v1/transaction?outlet_id=${id}&date_start=${yesterdayStartDate}&date_end=${yesterdayEndDate}`
        );
        setYesterdayTransactions(yesterday.data.data);

        const sumAllSales = sum(combineAllSales(yesterday.data.data));
        setYesterdaySales(sumAllSales);
      } catch (err) {
        console.log(err);
      }

      try {
        const today = await axios.get(
          `${API_URL}/api/v1/transaction?outlet_id=${id}&date_start=${todayStartDate}&date_end=${todayEndDate}`
        );
        setTodayTransactions(today.data.data);

        const sumTodaySales = sum(combineAllSales(today.data.data));
        setTodaySales(sumTodaySales);
      } catch (err) {
        console.log(err);
      }

      try {
        const all = await axios.get(
          `${API_URL}/api/v1/transaction?outlet_id=${id}`
        );
        const getMon = [0, 0, 0, 0, 0, 0];

        if (all.data.data.length) {
          const mon = all.data.data.map((item) => {
            return new Date(item.createdAt).getMonth();
          });

          const countMonths = mon.reduce((count, val) => {
            count[val] = (count[val] || 0) + 1;
            return count;
          }, {});

          for (const val of Object.keys(countMonths)) {
            const ind = allSixMonths.findIndex((item) => {
              return item === parseInt(val);
            });

            getMon[ind] = countMonths[val];
          }
        }

        setSixMonthsSales(getMon);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const yesterday = await axios.get(
          `${API_URL}/api/v1/transaction?date_start=${yesterdayStartDate}&date_end=${yesterdayEndDate}`
        );
        setYesterdayTransactions(yesterday.data.data);

        const sumAllSales = sum(combineAllSales(yesterday.data.data));
        setYesterdaySales(sumAllSales);
      } catch (err) {
        console.log(err);
      }

      try {
        const today = await axios.get(
          `${API_URL}/api/v1/transaction?date_start=${todayStartDate}&date_end=${todayEndDate}`
        );
        setTodayTransactions(today.data.data);

        const sumTodaySales = sum(combineAllSales(today.data.data));
        setTodaySales(sumTodaySales);
      } catch (err) {
        console.log(err);
      }

      try {
        const all = await axios.get(`${API_URL}/api/v1/transaction`);
        const getMon = [0, 0, 0, 0, 0, 0];

        if (all.data.data.length) {
          const mon = all.data.data.map((item) => {
            return new Date(item.createdAt).getMonth();
          });

          const countMonths = mon.reduce((count, val) => {
            count[val] = (count[val] || 0) + 1;
            return count;
          }, {});

          for (const val of Object.keys(countMonths)) {
            const ind = allSixMonths.findIndex((item) => {
              return item === parseInt(val);
            });

            getMon[ind] = countMonths[val];
          }
        }

        setSixMonthsSales(getMon);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    getOutlets();
    getTransactions();
  }, []);

  const handleSelectOutlet = (data) => {
    if (data) {
      getTransactions(data.id);
      setOutletName(data.name);
    } else {
      getTransactions();
      setOutletName("All Outlets");
    }
  };

  const calcPercentage = (a, b) => Math.floor((a / b) * 100) || 0;

  const layoutProps = useMemo(() => {
    return {
      colorsGrayGray500: objectPath.get(
        uiService.config,
        "js.colors.gray.gray500"
      ),
      colorsGrayGray200: objectPath.get(
        uiService.config,
        "js.colors.gray.gray200"
      ),
      colorsGrayGray300: objectPath.get(
        uiService.config,
        "js.colors.gray.gray300"
      ),
      colorsThemeBaseDanger: objectPath.get(
        uiService.config,
        "js.colors.theme.base.danger"
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily")
    };
  }, [uiService]);

  useEffect(() => {
    const element = document.getElementById("kt_mixed_widget_1_chart");
    if (!element) {
      return;
    }

    const options = getChartOptions(layoutProps, sixMonthsSales, currentMonths);

    const chart = new ApexCharts(element, options);
    chart.render();
    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps, sixMonthsSales, currentMonths]);

  return (
    <div className={`card card-custom bg-gray-100 ${className}`}>
      {/* Header */}
      <div className="card-header border-0 bg-danger py-5">
        <h3 className="card-title font-weight-bolder text-white">
          Transaction Report
        </h3>

        <div className="card-toolbar">
          <Dropdown className="dropdown-inline" drop="down" alignRight>
            <Dropdown.Toggle
              className="btn btn-transparent-white btn-sm font-weight-bolder dropdown-toggle px-5"
              variant="transparent"
              id="dropdown-toggle-top"
            >
              Last 6 Months
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
              <Dropdown.Item>Today</Dropdown.Item>
              <Dropdown.Item>Yesterday</Dropdown.Item>
              <Dropdown.Item>This Week</Dropdown.Item>
              <Dropdown.Item>Last Week</Dropdown.Item>
              <Dropdown.Item>This Month</Dropdown.Item>
              <Dropdown.Item>Last Month</Dropdown.Item>
              <Dropdown.Item>Last 6 Months</Dropdown.Item>
              <Dropdown.Item>This Year</Dropdown.Item>
              <Dropdown.Item>Last Year</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown
            className="dropdown-inline"
            drop="down"
            alignRight
            style={{ marginLeft: "1rem" }}
          >
            <Dropdown.Toggle
              className="btn btn-transparent-white btn-sm font-weight-bolder dropdown-toggle px-5"
              variant="transparent"
              id="dropdown-toggle-top"
            >
              {outletName}
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
              <Dropdown.Item onClick={() => handleSelectOutlet()}>
                All Outlets
              </Dropdown.Item>
              {allOutlets.length
                ? allOutlets.map((item) => {
                    return (
                      <Dropdown.Item
                        key={item.id}
                        onClick={() => handleSelectOutlet(item)}
                      >
                        {item.name}
                      </Dropdown.Item>
                    );
                  })
                : ""}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown
            className="dropdown-inline"
            drop="down"
            alignRight
            style={{ marginLeft: "1rem" }}
          >
            <Dropdown.Toggle
              className="btn btn-transparent-white btn-sm font-weight-bolder dropdown-toggle px-5"
              variant="transparent"
              id="dropdown-toggle-top"
            >
              Export
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
              <DropdownMenu2 />
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      {/* Body */}
      <div className="card-body p-0 position-relative overflow-hidden">
        {/* Chart */}
        <div
          id="kt_mixed_widget_1_chart"
          className="card-rounded-bottom bg-danger"
          style={{ height: "200px" }}
        ></div>

        {/* Stat */}
        <div className="card-spacer" style={{ marginTop: "-3rem" }}>
          <div className="row m-0">
            <div className="col bg-light-warning px-6 py-8 rounded-xl mr-7 mb-7">
              <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Media/Equalizer.svg")}
                ></SVG>
              </span>
              <a
                href="#"
                className="text-warning font-weight-bold font-size-h6"
              >
                Sales
              </a>
              <p>
                {rupiah.convert(yesterdaySales)} <br />
                {yesterdaySales && todaySales ? (
                  <>+{calcPercentage(todaySales, yesterdaySales) + "%"}</>
                ) : (
                  ""
                )}{" "}
                ({rupiah.convert(todaySales)}) Today Sales
              </p>
            </div>
            <div className="col bg-light-primary px-6 py-8 rounded-xl mb-7">
              <span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/Add-user.svg"
                  )}
                ></SVG>
              </span>
              <a
                href="#"
                className="text-primary font-weight-bold font-size-h6 mt-2"
              >
                Transactions
              </a>
              <p>
                {yesterdayTransactions.length} Transactions <br />
                {yesterdayTransactions.length && todayTransactions.length ? (
                  <>
                    +
                    {calcPercentage(
                      todayTransactions.length,
                      yesterdayTransactions.length
                    ) + "%"}{" "}
                  </>
                ) : (
                  ""
                )}
                ({todayTransactions.length}) Today Transactions{" "}
              </p>
            </div>
          </div>
          {/* <div className="row m-0">
            <div className="col bg-light-danger px-6 py-8 rounded-xl mr-7">
              <span className="svg-icon svg-icon-3x svg-icon-danger d-block my-2">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                ></SVG>
              </span>
              <a
                href="#"
                className="text-danger font-weight-bold font-size-h6 mt-2"
              >
                Customers
              </a>
              <p>
                12 Outlets <br />
                +5 New Customers added to customer database
              </p>
            </div>
            <div className="col bg-light-success px-6 py-8 rounded-xl">
              <span className="svg-icon svg-icon-3x svg-icon-success d-block my-2">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/Urgent-mail.svg"
                  )}
                ></SVG>
              </span>
              <a
                href="#"
                className="text-success font-weight-bold font-size-h6 mt-2"
              >
                Products
              </a>
              <p>
                25 Products <br />
                +5 New Products added to product database
              </p>
            </div>
          </div> */}
        </div>

        {/* Resize */}
        <div className="resize-triggers">
          <div className="expand-trigger">
            <div style={{ width: "411px", height: "461px" }} />
          </div>
          <div className="contract-trigger" />
        </div>
      </div>
    </div>
  );
}

function getChartOptions(layoutProps, sixMonthsSales, currentMonths) {
  const strokeColor = "#D13647";

  const highestSales = Math.max.apply(Math, sixMonthsSales) + 10;

  const options = {
    series: [
      {
        name: "Sales Stats",
        data: sixMonthsSales
      }
    ],
    chart: {
      type: "area",
      height: 200,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: true
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: strokeColor,
        opacity: 0.5
      }
    },
    plotOptions: {},
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: "solid",
      opacity: 0
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [strokeColor]
    },
    xaxis: {
      categories: currentMonths,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily
        }
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: layoutProps.colorsGrayGray300,
          width: 1,
          dashArray: 3
        }
      }
    },
    yaxis: {
      min: 0,
      max: highestSales,
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily
        }
      }
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0
        }
      },
      hover: {
        filter: {
          type: "none",
          value: 0
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0
        }
      }
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: layoutProps.fontFamily
      },
      // y: {
      //   formatter: function(val) {
      //     return "$" + val + " thousands";
      //   }
      // },
      marker: {
        show: false
      }
    },
    colors: ["transparent"],
    markers: {
      colors: layoutProps.colorsThemeBaseDanger,
      strokeColor: [strokeColor],
      strokeWidth: 3
    }
  };
  return options;
}
