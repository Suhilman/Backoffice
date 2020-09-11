import React from "react";
import { Row, Col } from "react-bootstrap";

import { MixedWidget1, MixedWidget14, StatsWidget11 } from "../widgets";
import { ProductSale } from "./widgets/ProductSale";
import { PaymentMethod } from "./widgets/PaymentMethod";
import { ProductCategory } from "./widgets/ProductCategory";
import { FinanceSummary } from "./widgets/FinanceSummary";

export function Demo1Dashboard() {
  return (
    <>
      <div className="row">
        {/* Sales Stat */}
        <div className="col-lg-12 col-xxl-4">
          <MixedWidget1 className="card-stretch gutter-b" />
        </div>

        <div className="col-lg-12 col-xxl-4">
          <StatsWidget11 className="card-stretch gutter-b" />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <ProductSale />
        </div>
        <div className="col-lg-4">
          <PaymentMethod />
        </div>
        <div className="col-lg-4">
          <ProductCategory />
        </div>
      </div>
      <Row>
        <Col>
          <FinanceSummary />
        </Col>
      </Row>
    </>
  );
}
