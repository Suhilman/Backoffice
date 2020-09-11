/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect } from "react";
import { Card, Row, Col, Dropdown } from "react-bootstrap";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { useHtmlClassService } from "../../../layout";
import { DropdownCustomToggler, DropdownMenu1 } from "../../dropdowns";

export function FinanceSummary({ className }) {
  const uiService = useHtmlClassService();
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
      colorsThemeBaseSuccess: objectPath.get(
        uiService.config,
        "js.colors.theme.base.success"
      ),
      colorsThemeLightSuccess: objectPath.get(
        uiService.config,
        "js.colors.theme.light.success"
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily")
    };
  }, [uiService]);

  useEffect(() => {
    const element = document.getElementById("finance-summary");

    if (!element) {
      return;
    }

    const options = getChartOption(layoutProps);
    const chart = new ApexCharts(element, options);
    chart.render();
    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps]);

  return (
    <Card>
      <Card.Header>
        <Row>
          <Col style={{ alignSelf: "center" }}>
            <h5>Finance Summary</h5>
          </Col>
          <Col style={{ textAlign: "end" }}>
            <div className="card-toolbar">
              <Dropdown className="dropdown-inline" alignRight>
                <Dropdown.Toggle
                  className="btn btn-clean btn-hover-light-primary btn-sm btn-icon"
                  variant="transparent"
                  id="dropdown-toggle-top"
                  as={DropdownCustomToggler}
                >
                  <i className="ki ki-bold-more-hor" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                  <DropdownMenu1 />
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body style={{ padding: "0" }}>
        <Row style={{ padding: "2rem" }}>
          <Col>
            <h6>Total Earnings</h6>
            <h5>Rp. 50.000,000</h5>
          </Col>
          <Col>
            <h6>Next Tax Review Date</h6>
            <h5>July 24,2017</h5>
          </Col>
        </Row>
        <Row style={{ padding: "2rem" }}>
          <Col>
            <h6>Average Product Price</h6>
            <h5>Rp.360,700</h5>
          </Col>
        </Row>

        <div
          id="finance-summary"
          className="card-rounded-bottom"
          style={{ height: "150px" }}
        ></div>
      </Card.Body>
    </Card>
  );
}

function getChartOption(layoutProps) {
  const options = {
    series: [
      {
        name: "Net Profit",
        data: [30, 45, 32, 70, 40]
      }
    ],
    chart: {
      type: "area",
      height: 150,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: true
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
      opacity: 1
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [layoutProps.colorsThemeBaseSuccess]
    },
    xaxis: {
      categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
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
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily
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
          return "$" + val + " thousands";
        }
      }
    },
    colors: [layoutProps.colorsThemeLightSuccess],
    markers: {
      colors: [layoutProps.colorsThemeLightSuccess],
      strokeColor: [layoutProps.colorsThemeBaseSuccess],
      strokeWidth: 3
    }
  };
  return options;
}
