/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { Card } from "react-bootstrap";
import { useHtmlClassService } from "../../../layout";
import { KTUtil } from "../../../_assets/js/components/util";

export function ProductCategory({ className }) {
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      colorsGrayGray100: objectPath.get(
        uiService.config,
        "js.colors.gray.gray100"
      ),
      colorsGrayGray700: objectPath.get(
        uiService.config,
        "js.colors.gray.gray700"
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
    const element = document.getElementById("product-category");
    if (!element) {
      return;
    }

    const height = parseInt(KTUtil.css(element, "height"));
    const options = getChartOptions(layoutProps, height);

    const chart = new ApexCharts(element, options);
    chart.render();
    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps]);

  return (
    <Card className="card-stretch gutter-b">
      <Card.Body style={{ padding: "2rem" }}>
        <h3>Product Category</h3>
        <h5 style={{ fontSize: "1rem" }}>by quantity sold items</h5>
        <div
          id="product-category"
          style={{ height: "200px", marginTop: "3rem" }}
        ></div>
      </Card.Body>
    </Card>
  );
}

function getChartOptions(layoutProps, height) {
  const options = {
    series: [102, 59, 20],
    labels: ["Food", "Coffee", "Appetizer"],
    chart: {
      type: "donut"
    }
  };
  return options;
}
