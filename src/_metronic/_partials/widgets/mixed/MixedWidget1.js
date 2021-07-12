/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect } from "react";
import rupiah from "rupiah-format";
import axios from 'axios'
import { useTranslation } from "react-i18next";
import SVG from "react-inlinesvg";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { Dropdown, Button, Modal } from "react-bootstrap";
import { CalendarToday } from "@material-ui/icons";
import { toAbsoluteUrl } from "../../../_helpers";
import { useHtmlClassService } from "../../../layout";
import { DropdownMenu2 } from "../../dropdowns";
import { DateRangePicker } from "react-date-range";
import Swal from "sweetalert2"
import ExportExcel from "react-html-table-to-excel";
import NumberFormat from 'react-number-format'
import { useHistory } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import './style.css'

export function MixedWidget1({
  className,
  currentSales,
  currentRange,
  rangeName,
  outletName,
  ranges,
  rangeId,
  handleSelectRange,
  handleSelectOutlet,
  allOutlets,
  yesterdaySales,
  yesterdayTransactions,
  todaySales,
  todayTransactions,
  startRange,
  endRange,
  handleStartRange,
  reports
}) {
  const uiService = useHtmlClassService();
  const [currency, setCurrency] = React.useState("")

  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)

    console.log("currency nya brpw", data.data.Currency.name)
     

    setCurrency(data.data.Currency.name)
  }
  React.useEffect(() => {
    handleCurrency()
  }, [])
  
  const calcPercentage = (a, b) => Math.floor((a / b) * 100) || 0;
  const { t } = useTranslation();
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

    const options = getChartOptions(layoutProps, currentSales, currentRange);

    const chart = new ApexCharts(element, options);
    chart.render();

    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps, currentSales, currentRange]);

  const [selectDate, setSelectDate] = React.useState(false);

  const handleSelectDate = () => setSelectDate((state) => !state);

  // function insertAfter(referenceNode, newNode) {
  //   if (referenceNode) {
  //     referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  //   }
  // }

  // React.useEffect(() => {
  //   const el = document.createElement("div");
  //   el.innerHTML = "test";
  //   // el.className = "header header-fixed";
  //   // el.innerHTML =
  //   //   "<div class='container-fluid d-flex align-items-stretch justify-content-between'>Test</div>";
  //   // el.style.cssText = "position:fixed;top:65px";
  //   const div = document.getElementById("kt_header");
  //   div.append(el);
  //   // insertAfter(div, el);
  // }, []);

  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };

  const filename = () => {
    const value = ranges.find((item) => item.id === rangeId).valueId;
    const date = ranges.find((item) => item.id === rangeId).displayDate;

    const processValue = value
      .split(" ")
      .join("-")
      .toLowerCase();
    return `transaksi-${processValue}_${date}`;
  };
  return (
    <>
      <ModalCustomRange
        show={selectDate}
        handleClose={handleSelectDate}
        startRange={startRange}
        endRange={endRange}
        handleStartRange={handleStartRange}
        handleSelectRange={handleSelectRange}
        ranges={ranges}
      />

      <div style={{ display: "none" }}>
        <table id="table-transactions">
          <thead>
            <tr>
              <th>
                {t("salesReport")}{" "}
                {ranges.find((item) => item.id === rangeId).valueId}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>{t("outlet")}</th>
              <td>{outletName}</td>
            </tr>
          </thead>
          <thead>
            <tr>
              <th>{t("date")}</th>
              <td>{ranges.find((item) => item.id === rangeId).displayDate}</td>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>{t("date")}</th>
              <th>{t("numberOfTransaction")}</th>
              <th>{t("sales")}</th>
              <th>{t("average")}</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.totalTransactions}</td>
                  <td>{item.totalSales}</td>
                  <td>{item.average}</td>
                </tr>
              );
            })}
            <tr>
              <th>{t("grandTotal")}</th>
              <th>{sumReports(reports, "totalTransactions")} </th>
              <th>{sumReports(reports, "totalSales")} </th>
              <th>{sumReports(reports, "average")} </th>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={`card card-custom bg-gray-100 ${className}`}>
        {/* Header */}
        <div className="card-header border-0 bg-danger py-5">
          <h3 className="card-title font-weight-bolder text-white">
            {t("transactionReport")}
          </h3>

          <div className="card-toolbar">
            <Dropdown className="dropdown-inline" drop="down" alignRight>
              <Dropdown.Toggle
                className="btn btn-transparent-white btn-sm font-weight-bolder dropdown-toggle px-5"
                variant="transparent"
                id="dropdown-toggle-top"
              >
                {rangeName}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                {ranges.map((item) => {
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
                <Dropdown.Item onClick={handleSelectDate}>{t("custom")}</Dropdown.Item>
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
                  {t("allOutlets")}
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
              <ExportExcel
                className="btn btn-transparent-white btn-sm font-weight-bolder px-5"
                table="table-transactions"
                filename={filename()}
                sheet="transaction-report"
                buttonText="Export"
              />
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
                  {t("sales")}
                </a>
                <p>
                  (<NumberFormat value={yesterdaySales} displayType={'text'} thousandSeparator={true} prefix={currency} />) {t("yesterdaySales")}<br />
                  {yesterdaySales && todaySales ? (
                    <>+{calcPercentage(todaySales, yesterdaySales) + "%"}</>
                  ) : (
                    ""
                  )}{" "}
                  (<NumberFormat value={todaySales} displayType={'text'} thousandSeparator={true} prefix={currency} />) {t("todaySales")}
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
                  {t("transaction")}
                </a>
                <p>
                  ({yesterdayTransactions.length}) {t("yesterdayTransaction")} <br />
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
                  ({todayTransactions.length}) {t("todayTransaction")}
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
    </>
  );
}

function getChartOptions(layoutProps, currentSales, currentRange) {
  const strokeColor = "#D13647";

  const options = {
    series: [
      {
        name: "Sales Stats",
        data: currentSales
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
      curve: "straight",
      show: true,
      width: 3,
      colors: [strokeColor]
    },
    xaxis: {
      categories: currentRange,
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
      y: {
        formatter: function(val) {
          return val;
        }
      },
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

const ModalCustomRange = ({
  show,
  handleClose,
  startRange,
  endRange,
  handleStartRange,
  handleSelectRange,
  ranges
}) => {
  const { t } = useTranslation();
  const [showGuide, setShowGuide] = React.useState(null)
  const API_URL = process.env.REACT_APP_API_URL;
  const userInfo = JSON.parse(localStorage.getItem("user_info"));

  const checkUserGuideBusiness = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)
      if(!data.data.user_guide) {
        setShowGuide("dashboard")
      } else {
        setShowGuide(null)
      }
      console.log("data businessnya", data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleShowGuide = async (state) => {
    if (state === 'finish_guide') {
      await axios.patch(`${API_URL}/api/v1/business/update-guide/${userInfo.business_id}`, {
        user_guide: 1
      })
      setShowGuide(null)
    } else {
      setShowGuide(state)
    }
  }

  React.useEffect(() => {
    checkUserGuideBusiness()
  },[])

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <DateRangePicker
          ranges={[
            {
              startDate: startRange,
              endDate: endRange,
              key: "selection"
            }
          ]}
          onChange={handleStartRange}
        />
        <Modal.Footer>
          <Button
            onClick={() => {
              handleSelectRange(ranges.find((item) => item.id === 9));
              handleClose();
            }}
          >
            {t("save")}
          </Button>
          <Button onClick={handleClose} variant="secondary">
            {t("cancel")}
          </Button>
        </Modal.Footer>
      </Modal>
      {showGuide === 'dashboard' ? (
        <div className="wrapper-guide dashboard">
          <div onClick={() => handleShowGuide('report')}>
            <div className="font-weight-bold">Dashboard</div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
          </div>
          <div className="d-flex justify-content-end" onClick={() => handleShowGuide('finish_guide')}>
            <div className="badge badge-danger">Skip All Guide</div>
          </div>
        </div>
      ) : null}
      {showGuide === 'report' ? (
        <div className="wrapper-guide report">
          <div onClick={() => handleShowGuide('product')}>
            <div className="font-weight-bold">Report</div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
          </div>
          <div className="d-flex justify-content-end" onClick={() => handleShowGuide('finish_guide')}>
            <div className="badge badge-danger">Skip All Guide</div>
          </div>
        </div>
      ) : null}
      {showGuide === 'product' ? (
        <div className="wrapper-guide product" >
          <div onClick={() => handleShowGuide('inventory')}>
          <div className="font-weight-bold">Product</div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
          </div>
          <div className="d-flex justify-content-end" onClick={() => handleShowGuide('finish_guide')}>
            <div className="badge badge-danger">Skip All Guide</div>
          </div>
        </div>
      ) : null }
      {showGuide === 'inventory' ? (
        <div className="wrapper-guide inventory">
          <div onClick={() => handleShowGuide('kitchen')}>
            <div className="font-weight-bold">Inventory</div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
          </div>
          <div className="d-flex justify-content-end" onClick={() => handleShowGuide('finish_guide')}>
            <div className="badge badge-danger">Skip All Guide</div>
          </div>
        </div>
      ): null}
      {showGuide === 'kitchen' ? (
        <div className="wrapper-guide kitchen">
          <div  onClick={() => handleShowGuide('outlet')}>
            <div className="font-weight-bold">Kitchen</div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
          </div>
          <div className="d-flex justify-content-end" onClick={() => handleShowGuide('finish_guide')}>
            <div className="badge badge-danger">Skip All Guide</div>
          </div>
        </div>
      ): null}
      {showGuide === 'outlet' ? (
        <div className="wrapper-guide outlet" >
          <div onClick={() => handleShowGuide('promo')}>
            <div className="font-weight-bold">Outlet</div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
          </div>
          <div className="d-flex justify-content-end" onClick={() => handleShowGuide('finish_guide')}>
            <div className="badge badge-danger">Skip All Guide</div>
          </div>
        </div>
      ): null}
      {showGuide === 'promo' ? (
        <div className="wrapper-guide promo"> 
          <div onClick={() => handleShowGuide('staff')}>
            <div className="font-weight-bold">Promo</div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
          </div>
          <div className="d-flex justify-content-end" onClick={() => handleShowGuide('finish_guide')}>
            <div className="badge badge-danger">Skip All Guide</div>
          </div>
        </div>
      ): null}
      {showGuide === 'staff' ? (
        <div className="wrapper-guide staff">
          <div onClick={() => handleShowGuide('role')}>
            <div className="font-weight-bold">Staff</div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
          </div>
          <div className="d-flex justify-content-end" onClick={() => handleShowGuide('finish_guide')}>
            <div className="badge badge-danger">Skip All Guide</div>
          </div>
        </div>
      ): null}
      {showGuide === 'role' ? (
        <div className="wrapper-guide role">
          <div onClick={() => handleShowGuide('customer')}>
            <div className="font-weight-bold">Role</div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
          </div>
          <div className="d-flex justify-content-end" onClick={() => handleShowGuide('finish_guide')}>
            <div className="badge badge-danger">Skip All Guide</div>
          </div>
        </div>
      ): null}
      {showGuide === 'customer' ? (
        <div className="wrapper-guide customer">
          <div onClick={() => handleShowGuide('commission')}>
            <div className="font-weight-bold">Customer</div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
          </div>
          <div className="d-flex justify-content-end" onClick={() => handleShowGuide('finish_guide')}>
            <div className="badge badge-danger">Skip All Guide</div>
          </div>
        </div>
      ): null}
      {showGuide === 'commission' ? (
        <div className="wrapper-guide commission">
          <div onClick={() => handleShowGuide('account')}>
            <div className="font-weight-bold">Commission</div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
          </div>
          <div className="d-flex justify-content-end" onClick={() => handleShowGuide('finish_guide')}>
            <div className="badge badge-danger">Skip All Guide</div>
          </div>
        </div>
      ): null}
      {showGuide === 'account' ? (
        <div className="wrapper-guide account">
          <div onClick={() => handleShowGuide('finish_guide')}>
            <div className="font-weight-bold">Account</div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
          </div>
          <div className="d-flex justify-content-end" onClick={() => handleShowGuide('finish_guide')}>
            <div className="badge badge-danger">Skip All Guide</div>
          </div>
        </div>
      ): null}
    </div>
  );
};
